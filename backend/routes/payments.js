const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const { Payment, Booking, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { createWalletTransaction } = require('../utils/wallet');

const router = express.Router();

// Initialize Paystack payment
router.post('/paystack/initialize', authenticateToken, [
    body('bookingId').isUUID().withMessage('Booking ID must be valid'),
    body('email').isEmail().withMessage('Valid email is required')
], async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { bookingId, email } = req.body;

        // Find the booking and associated payment
        const booking = await Booking.findOne({
            where: { id: bookingId, userId: req.user.id },
            include: [{ model: Payment, as: 'payment' }]
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (!booking.payment || booking.payment.status === 'successful') {
            return res.status(400).json({
                success: false,
                message: 'Payment already processed or not found'
            });
        }

        // Generate unique reference
        const reference = `FXF_${Date.now()}_${booking.id.slice(-8)}`;

        // Initialize payment with Paystack
        const paystackData = {
            email,
            amount: Math.round(parseFloat(booking.totalAmount) * 100), // Convert to kobo
            reference,
            currency: 'NGN',
            callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
            metadata: {
                bookingId,
                userId: req.user.id,
                custom_fields: [{
                    display_name: "Booking Number",
                    variable_name: "booking_number",
                    value: booking.bookingNumber
                }]
            }
        };

        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            paystackData, {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.status) {
            // Update payment record
            await booking.payment.update({
                transactionReference: reference,
                paymentGateway: 'paystack',
                status: 'processing'
            });

            res.json({
                success: true,
                message: 'Payment initialized successfully',
                data: {
                    authorizationUrl: response.data.data.authorization_url,
                    accessCode: response.data.data.access_code,
                    reference
                }
            });
        } else {
            throw new Error('Failed to initialize payment');
        }
    } catch (error) {
        console.error('Paystack initialization error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to initialize payment',
            error: (error.response && error.response.data && error.response.data.message) || error.message
        });
    }
});

// Verify Paystack payment
router.post('/paystack/verify', authenticateToken, [
    body('reference').notEmpty().withMessage('Reference is required')
], async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { reference } = req.body;

        // Verify payment with Paystack
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        );

        if (response.data.status && response.data.data.status === 'success') {
            // Find payment record
            const payment = await Payment.findOne({
                where: { transactionReference: reference },
                include: [{ model: Booking, as: 'booking' }]
            });

            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment record not found'
                });
            }

            // Update payment status
            await payment.update({
                status: 'successful',
                gatewayReference: response.data.data.reference,
                gatewayResponse: response.data.data,
                paidAt: new Date()
            });

            // Update booking status
            await payment.booking.update({
                status: 'confirmed',
                paymentStatus: 'paid'
            });

            res.json({
                success: true,
                message: 'Payment verified successfully',
                data: {
                    payment,
                    booking: payment.booking
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify payment',
            error: (error.response && error.response.data && error.response.data.message) || error.message
        });
    }
});

// Paystack webhook
router.post('/paystack/webhook', express.raw({ type: 'application/json' }), async(req, res) => {
    try {
        const hash = crypto
            .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET)
            .update(req.body)
            .digest('hex');

        if (hash !== req.headers['x-paystack-signature']) {
            return res.status(400).send('Invalid signature');
        }

        const event = JSON.parse(req.body);

        if (event.event === 'charge.success') {
            const { reference, status, amount } = event.data;

            const payment = await Payment.findOne({
                where: { transactionReference: reference },
                include: [{ model: Booking, as: 'booking' }]
            });

            if (payment && status === 'success') {
                await payment.update({
                    status: 'successful',
                    gatewayReference: event.data.reference,
                    gatewayResponse: event.data,
                    paidAt: new Date()
                });

                await payment.booking.update({
                    status: 'confirmed',
                    paymentStatus: 'paid'
                });

                // Emit socket event
                if (global.io) {
                    global.io.to(`booking_${payment.booking.id}`).emit('payment_successful', {
                        bookingId: payment.booking.id,
                        paymentId: payment.id
                    });
                }
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Webhook processing failed');
    }
});

// Add funds to wallet
router.post('/wallet/add-funds', authenticateToken, [
    body('amount').isFloat({ min: 100 }).withMessage('Minimum amount is ₦100'),
    body('paymentMethod').isIn(['paystack', 'card']).withMessage('Invalid payment method')
], async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { amount, paymentMethod } = req.body;
        const reference = `WALLET_${Date.now()}_${req.user.id.slice(-8)}`;

        // Initialize payment
        const paystackData = {
            email: req.user.email,
            amount: Math.round(parseFloat(amount) * 100),
            reference,
            currency: 'NGN',
            callback_url: `${process.env.FRONTEND_URL}/wallet/callback`,
            metadata: {
                type: 'wallet_funding',
                userId: req.user.id
            }
        };

        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            paystackData, {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.status) {
            res.json({
                success: true,
                message: 'Wallet funding initialized',
                data: {
                    authorizationUrl: response.data.data.authorization_url,
                    reference,
                    amount
                }
            });
        } else {
            throw new Error('Failed to initialize wallet funding');
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to initialize wallet funding',
            error: (error.response && error.response.data && error.response.data.message) || error.message
        });
    }
});

// Get payment history
router.get('/history', authenticateToken, async(req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const payments = await Payment.findAndCountAll({
            where: { userId: req.user.id },
            include: [{
                model: Booking,
                as: 'booking',
                include: [{
                    model: require('../models').Service,
                    as: 'service'
                }]
            }],
            order: [
                ['createdAt', 'DESC']
            ],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            data: {
                payments: payments.rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(payments.count / limit),
                    totalItems: payments.count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment history',
            error: error.message
        });
    }
});

module.exports = router;