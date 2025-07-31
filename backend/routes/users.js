const express = require('express');
const { body, validationResult } = require('express-validator');
const { User, Provider, Booking, WalletTransaction, Notification } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async(req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
            include: [{
                model: Provider,
                as: 'providerProfile',
                required: false
            }]
        });

        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
            error: error.message
        });
    }
});

// Update user profile
router.put('/profile', authenticateToken, [
    body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
    body('phone')
    .optional()
    .matches(/^(\+234|0)[789]\d{9}$/)
    .withMessage('Please enter a valid Nigerian phone number'),
    body('address')
    .optional()
    .isObject()
    .withMessage('Address must be an object')
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

        const allowedUpdates = ['fullName', 'phone', 'address', 'profileImage'];
        const updates = {};

        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const user = await User.findByPk(req.user.id);
        await user.update(updates);

        const updatedUser = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: { user: updatedUser }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
});

// Get user bookings
router.get('/bookings', authenticateToken, async(req, res) => {
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
                    model: Provider,
                    as: 'provider',
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['fullName', 'profileImage']
                    }]
                },
                {
                    model: require('../models').Service,
                    as: 'service'
                }
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

// Get wallet transactions
router.get('/wallet/transactions', authenticateToken, async(req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const transactions = await WalletTransaction.findAndCountAll({
            where: { userId: req.user.id },
            order: [
                ['createdAt', 'DESC']
            ],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            data: {
                transactions: transactions.rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(transactions.count / limit),
                    totalItems: transactions.count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch wallet transactions',
            error: error.message
        });
    }
});

// Get user notifications
router.get('/notifications', authenticateToken, async(req, res) => {
    try {
        const { page = 1, limit = 20, unread = false } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = { userId: req.user.id };
        if (unread === 'true') {
            whereClause.isRead = false;
        }

        const notifications = await Notification.findAndCountAll({
            where: whereClause,
            order: [
                ['createdAt', 'DESC']
            ],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            data: {
                notifications: notifications.rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(notifications.count / limit),
                    totalItems: notifications.count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notifications',
            error: error.message
        });
    }
});

// Mark notification as read
router.put('/notifications/:id/read', authenticateToken, async(req, res) => {
    try {
        const notification = await Notification.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        await notification.update({
            isRead: true,
            readAt: new Date()
        });

        res.json({
            success: true,
            message: 'Notification marked as read'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update notification',
            error: error.message
        });
    }
});

// Delete user account
router.delete('/account', authenticateToken, [
    body('password')
    .notEmpty()
    .withMessage('Password is required to delete account')
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

        const { password } = req.body;

        const user = await User.findByPk(req.user.id, {
            attributes: { include: ['password'] }
        });

        if (!(await user.comparePassword(password))) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect password'
            });
        }

        // Instead of deleting, we deactivate the account
        await user.update({ isActive: false });

        res.json({
            success: true,
            message: 'Account deactivated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete account',
            error: error.message
        });
    }
});

module.exports = router;