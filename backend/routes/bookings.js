const express = require('express');
const { body, validationResult } = require('express-validator');
const { Booking, Service, Provider, User, Payment, Notification } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { createWalletTransaction } = require('../utils/wallet');
const { sendNotification } = require('../utils/notifications');

const bookingRouter = express.Router();

// Create a new booking
bookingRouter.post('/', authenticateToken, [
    body('serviceId').isUUID().withMessage('Service ID must be valid'),
    body('scheduledDate').isISO8601().withMessage('Scheduled date must be valid'),
    body('scheduledTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Time must be in HH:MM format'),
    body('address').isObject().withMessage('Address must be an object'),
    body('paymentMethod').isIn(['card', 'wallet', 'paystack']).withMessage('Invalid payment method')
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

        const { serviceId, scheduledDate, scheduledTime, address, specialInstructions, paymentMethod } = req.body;

        // Validate service exists and is active
        const service = await Service.findOne({
            where: { id: serviceId, isActive: true },
            include: [{
                model: Provider,
                as: 'provider',
                where: { isVerified: true, isAvailable: true }
            }]
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found or unavailable'
            });
        }

        // Check if provider is available at the requested time
        const conflictingBooking = await Booking.findOne({
            where: {
                providerId: service.providerId,
                scheduledDate,
                scheduledTime,
                status: ['confirmed', 'in_progress']
            }
        });

        if (conflictingBooking) {
            return res.status(400).json({
                success: false,
                message: 'Provider is not available at the selected time'
            });
        }

        // Calculate total amount (service price + any fees)
        const totalAmount = parseFloat(service.price);

        // If paying with wallet, check balance
        if (paymentMethod === 'wallet') {
            const user = await User.findByPk(req.user.id);
            if (parseFloat(user.walletBalance) < totalAmount) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient wallet balance'
                });
            }
        }

        // Create booking
        const booking = await Booking.create({
            userId: req.user.id,
            providerId: service.providerId,
            serviceId,
            scheduledDate,
            scheduledTime,
            address,
            totalAmount,
            specialInstructions,
            status: paymentMethod === 'wallet' ? 'confirmed' : 'pending'
        });

        // Create payment record
        const payment = await Payment.create({
            bookingId: booking.id,
            userId: req.user.id,
            amount: totalAmount,
            paymentMethod,
            status: paymentMethod === 'wallet' ? 'successful' : 'pending'
        });

        // If wallet payment, deduct from balance
        if (paymentMethod === 'wallet') {
            await createWalletTransaction({
                userId: req.user.id,
                type: 'debit',
                amount: totalAmount,
                description: `Payment for booking ${booking.bookingNumber}`,
                reference: booking.id
            });

            await payment.update({ paidAt: new Date() });
        }

        // Send notifications
        await sendNotification(req.user.id, {
            title: 'Booking Created',
            message: `Your booking ${booking.bookingNumber} has been created successfully`,
            type: 'booking',
            data: { bookingId: booking.id }
        });

        // Get provider user for notification
        const provider = await Provider.findByPk(service.providerId, {
            include: [{ model: User, as: 'user' }]
        });

        await sendNotification(provider.userId, {
            title: 'New Booking Request',
            message: `You have a new booking request for ${service.title}`,
            type: 'booking',
            data: { bookingId: booking.id }
        });

        // Fetch complete booking data
        const completeBooking = await Booking.findByPk(booking.id, {
            include: [
                { model: Service, as: 'service' },
                { model: Provider, as: 'provider', include: [{ model: User, as: 'user' }] },
                { model: Payment, as: 'payment' }
            ]
        });

        // Emit socket event for real-time updates
        if (global.io) {
            global.io.to(`booking_${booking.id}`).emit('booking_created', completeBooking);
        }

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: { booking: completeBooking }
        });
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create booking',
            error: error.message
        });
    }
});

// Get user's bookings
bookingRouter.get('/my-bookings', authenticateToken, async(req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = { userId: req.user.id };
        if (status) {
            whereClause.status = status;
        }

        const bookings = await Booking.findAndCountAll({
            where: whereClause,
            include: [{
                    model: Service,
                    as: 'service',
                    include: [{ model: Provider, as: 'provider', include: [{ model: User, as: 'user' }] }]
                },
                { model: Payment, as: 'payment' }
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            data: {
                bookings: bookings.rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(bookings.count / limit),
                    totalItems: bookings.count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings',
            error: error.message
        });
    }
});

// Get provider's bookings
bookingRouter.get('/provider-bookings', authenticateToken, authorizeRoles('provider'), async(req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const provider = await Provider.findOne({ where: { userId: req.user.id } });
        if (!provider) {
            return res.status(403).json({
                success: false,
                message: 'Provider profile required'
            });
        }

        const whereClause = { providerId: provider.id };
        if (status) {
            whereClause.status = status;
        }

        const bookings = await Booking.findAndCountAll({
            where: whereClause,
            include: [
                { model: User, as: 'user', attributes: { exclude: ['password'] } },
                { model: Service, as: 'service' },
                { model: Payment, as: 'payment' }
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            data: {
                bookings: bookings.rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(bookings.count / limit),
                    totalItems: bookings.count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch provider bookings',
            error: error.message
        });
    }
});

// Get single booking
bookingRouter.get('/:id', authenticateToken, async(req, res) => {
    try {
        const booking = await Booking.findOne({
            where: { id: req.params.id },
            include: [
                { model: User, as: 'user', attributes: { exclude: ['password'] } },
                { model: Service, as: 'service', include: [{ model: Provider, as: 'provider' }] },
                { model: Payment, as: 'payment' }
            ]
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user is authorized to view this booking
        const provider = await Provider.findOne({ where: { userId: req.user.id } });
        const isAuthorized = booking.userId === req.user.id ||
            (provider && booking.providerId === provider.id) ||
            req.user.role === 'admin';

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this booking'
            });
        }

        res.json({
            success: true,
            data: { booking }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch booking',
            error: error.message
        });
    }
});

// Update booking status (Provider only)
bookingRouter.put('/:id/status', authenticateToken, authorizeRoles('provider'), [
    body('status').isIn(['confirmed', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status')
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

        const { status } = req.body;
        const provider = await Provider.findOne({ where: { userId: req.user.id } });

        if (!provider) {
            return res.status(403).json({
                success: false,
                message: 'Provider profile required'
            });
        }

        const booking = await Booking.findOne({
            where: { id: req.params.id, providerId: provider.id }
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found or unauthorized'
            });
        }

        const updateData = { status };
        if (status === 'completed') {
            updateData.completedAt = new Date();
        } else if (status === 'cancelled') {
            updateData.cancelledAt = new Date();
        }

        await booking.update(updateData);

        // Send notification to user
        await sendNotification(booking.userId, {
            title: 'Booking Status Updated',
            message: `Your booking ${booking.bookingNumber} is now ${status}`,
            type: 'booking',
            data: { bookingId: booking.id, status }
        });

        // Emit socket event
        if (global.io) {
            global.io.to(`booking_${booking.id}`).emit('booking_status_updated', {
                bookingId: booking.id,
                status
            });
        }

        res.json({
            success: true,
            message: 'Booking status updated successfully',
            data: { booking }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update booking status',
            error: error.message
        });
    }
});

// Cancel booking (User only)
bookingRouter.put('/:id/cancel', authenticateToken, [
    body('reason').optional().isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters')
], async(req, res) => {
    try {
        const { reason } = req.body;

        const booking = await Booking.findOne({
            where: { id: req.params.id, userId: req.user.id },
            include: [{ model: Payment, as: 'payment' }]
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found or unauthorized'
            });
        }

        if (booking.status === 'completed' || booking.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel this booking'
            });
        }

        await booking.update({
            status: 'cancelled',
            cancelledAt: new Date(),
            cancellationReason: reason
        });

        // Process refund if payment was made
        if (booking.payment && booking.payment.status === 'successful') {
            if (booking.payment.paymentMethod === 'wallet') {
                await createWalletTransaction({
                    userId: req.user.id,
                    type: 'credit',
                    amount: booking.totalAmount,
                    description: `Refund for cancelled booking ${booking.bookingNumber}`,
                    reference: booking.id
                });
            }

            await booking.payment.update({
                status: 'refunded',
                refundedAt: new Date()
            });
        }

        // Send notification to provider
        const provider = await Provider.findByPk(booking.providerId, {
            include: [{ model: User, as: 'user' }]
        });

        await sendNotification(provider.userId, {
            title: 'Booking Cancelled',
            message: `Booking ${booking.bookingNumber} has been cancelled by the customer`,
            type: 'booking',
            data: { bookingId: booking.id }
        });

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            data: { booking }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to cancel booking',
            error: error.message
        });
    }
});

// Rate and review a completed booking
bookingRouter.post('/:id/review', authenticateToken, [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
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

        const { rating, comment } = req.body;

        const booking = await Booking.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id,
                status: 'completed'
            },
            include: [{ model: Service, as: 'service' }]
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Completed booking not found or unauthorized'
            });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({
            where: { bookingId: booking.id }
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'Review already exists for this booking'
            });
        }

        // Create review
        const review = await Review.create({
            userId: req.user.id,
            providerId: booking.providerId,
            serviceId: booking.serviceId,
            bookingId: booking.id,
            rating,
            comment
        });

        // Update booking with review flag
        await booking.update({ hasReview: true });

        // Send notification to provider
        await sendNotification(booking.service.provider.userId, {
            title: 'New Review Received',
            message: `You received a ${rating}-star review for ${booking.service.title}`,
            type: 'review',
            data: { reviewId: review.id, bookingId: booking.id }
        });

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: { review }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to submit review',
            error: error.message
        });
    }
});

// Get booking statistics (for dashboard)
bookingRouter.get('/stats/overview', authenticateToken, async(req, res) => {
    try {
        const { timeframe = '30' } = req.query; // days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(timeframe));

        let whereClause = {};
        let providerWhereClause = {};

        // Check if user is a provider
        const provider = await Provider.findOne({ where: { userId: req.user.id } });
        if (provider) {
            providerWhereClause.providerId = provider.id;
        } else {
            // Regular user - show their bookings
            whereClause.userId = req.user.id;
        }

        // Combine where clauses
        const finalWhereClause = {...whereClause, ...providerWhereClause };

        // Get total bookings
        const totalBookings = await Booking.count({
            where: finalWhereClause
        });

        // Get bookings in timeframe
        const recentBookings = await Booking.count({
            where: {
                ...finalWhereClause,
                createdAt: {
                    [Op.gte]: startDate
                }
            }
        });

        // Get bookings by status
        const bookingsByStatus = await Booking.findAll({
            where: finalWhereClause,
            attributes: [
                'status', [require('sequelize').fn('COUNT', require('sequelize').col('status')), 'count']
            ],
            group: ['status']
        });

        // Get total revenue (for providers)
        let totalRevenue = 0;
        let recentRevenue = 0;
        if (provider) {
            const revenueData = await Booking.findAll({
                where: {
                    providerId: provider.id,
                    status: 'completed'
                },
                attributes: [
                    [require('sequelize').fn('SUM', require('sequelize').col('totalAmount')), 'total']
                ]
            });

            const revenueValue = revenueData[0] && revenueData[0].dataValues && revenueData[0].dataValues.total;

            // Ensure revenueValue is a number
            totalRevenue = parseFloat(revenueValue || 0);

            const recentRevenueData = await Booking.findAll({
                where: {
                    providerId: provider.id,
                    status: 'completed',
                    completedAt: {
                        [Op.gte]: startDate
                    }
                },
                attributes: [
                    [require('sequelize').fn('SUM', require('sequelize').col('totalAmount')), 'total']
                ]
            });
            recentRevenue = parseFloat(
                (recentRevenueData[0] && recentRevenueData[0].dataValues && recentRevenueData[0].dataValues.total) || 0
            );
        }

        res.json({
            success: true,
            data: {
                totalBookings,
                recentBookings,
                totalRevenue,
                recentRevenue,
                bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
                    acc[item.status] = parseInt(item.dataValues.count);
                    return acc;
                }, {}),
                timeframe: parseInt(timeframe)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch booking statistics',
            error: error.message
        });
    }
});

// Reschedule booking
bookingRouter.put('/:id/reschedule', authenticateToken, [
    body('scheduledDate').isISO8601().withMessage('Scheduled date must be valid'),
    body('scheduledTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Time must be in HH:MM format'),
    body('reason').optional().isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters')
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

        const { scheduledDate, scheduledTime, reason } = req.body;

        const booking = await Booking.findOne({
            where: { id: req.params.id, userId: req.user.id },
            include: [{ model: Service, as: 'service' }]
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found or unauthorized'
            });
        }

        if (!['confirmed', 'pending'].includes(booking.status)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot reschedule this booking'
            });
        }

        // Check if provider is available at the new time
        const conflictingBooking = await Booking.findOne({
            where: {
                providerId: booking.providerId,
                scheduledDate,
                scheduledTime,
                status: ['confirmed', 'in_progress'],
                id: {
                    [Op.ne]: booking.id
                }
            }
        });

        if (conflictingBooking) {
            return res.status(400).json({
                success: false,
                message: 'Provider is not available at the selected time'
            });
        }

        // Update booking
        await booking.update({
            scheduledDate,
            scheduledTime,
            rescheduleReason: reason,
            isRescheduled: true
        });

        // Send notification to provider
        const provider = await Provider.findByPk(booking.providerId, {
            include: [{ model: User, as: 'user' }]
        });

        await sendNotification(provider.userId, {
            title: 'Booking Rescheduled',
            message: `Booking ${booking.bookingNumber} has been rescheduled to ${scheduledDate} at ${scheduledTime}`,
            type: 'booking',
            data: { bookingId: booking.id }
        });

        // Emit socket event
        if (global.io) {
            global.io.to(`booking_${booking.id}`).emit('booking_rescheduled', {
                bookingId: booking.id,
                scheduledDate,
                scheduledTime
            });
        }

        res.json({
            success: true,
            message: 'Booking rescheduled successfully',
            data: { booking }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to reschedule booking',
            error: error.message
        });
    }
});

// Get upcoming bookings
bookingRouter.get('/upcoming/list', authenticateToken, async(req, res) => {
    try {
        const { limit = 5 } = req.query;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let whereClause = {
            status: ['confirmed', 'in_progress'],
            scheduledDate: {
                [Op.gte]: today
            }
        };

        // Check if user is a provider
        const provider = await Provider.findOne({ where: { userId: req.user.id } });
        if (provider) {
            whereClause.providerId = provider.id;
        } else {
            whereClause.userId = req.user.id;
        }

        const upcomingBookings = await Booking.findAll({
            where: whereClause,
            include: [
                { model: Service, as: 'service' },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'fullName', 'email', 'phone', 'profileImage']
                },
                {
                    model: Provider,
                    as: 'provider',
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['id', 'fullName', 'email', 'phone', 'profileImage']
                    }]
                }
            ],
            order: [
                ['scheduledDate', 'ASC'],
                ['scheduledTime', 'ASC']
            ],
            limit: parseInt(limit)
        });

        res.json({
            success: true,
            data: { bookings: upcomingBookings }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch upcoming bookings',
            error: error.message
        });
    }
});

// Generate booking invoice/receipt
bookingRouter.get('/:id/invoice', authenticateToken, async(req, res) => {
    try {
        const booking = await Booking.findOne({
            where: { id: req.params.id },
            include: [
                { model: User, as: 'user', attributes: { exclude: ['password'] } },
                {
                    model: Service,
                    as: 'service',
                    include: [{
                        model: Provider,
                        as: 'provider',
                        include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }]
                    }]
                },
                { model: Payment, as: 'payment' }
            ]
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check authorization
        const provider = await Provider.findOne({ where: { userId: req.user.id } });
        const isAuthorized = booking.userId === req.user.id ||
            (provider && booking.providerId === provider.id) ||
            req.user.role === 'admin';

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this invoice'
            });
        }

        // Generate invoice data
        const invoiceData = {
            bookingNumber: booking.bookingNumber,
            invoiceDate: new Date(),
            customer: {
                name: booking.user.fullName,
                email: booking.user.email,
                phone: booking.user.phone,
                address: booking.address
            },
            provider: {
                name: booking.service.provider.user.fullName,
                email: booking.service.provider.user.email,
                phone: booking.service.provider.user.phone,
                businessName: booking.service.provider.businessName
            },
            service: {
                title: booking.service.title,
                description: booking.service.description,
                price: booking.service.price,
                duration: booking.service.duration
            },
            booking: {
                scheduledDate: booking.scheduledDate,
                scheduledTime: booking.scheduledTime,
                status: booking.status,
                totalAmount: booking.totalAmount,
                createdAt: booking.createdAt,
                completedAt: booking.completedAt
            },
            payment: booking.payment ? {
                method: booking.payment.paymentMethod,
                status: booking.payment.status,
                paidAt: booking.payment.paidAt,
                transactionRef: booking.payment.transactionRef
            } : null
        };

        res.json({
            success: true,
            data: { invoice: invoiceData }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to generate invoice',
            error: error.message
        });
    }
});

module.exports = bookingRouter;