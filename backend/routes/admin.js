const express = require('express');
const { Op } = require('sequelize');
const { body, query, validationResult } = require('express-validator');
const { sequelize } = require('../models'); // Added missing import
const {
    User,
    Provider,
    Service,
    ServiceCategory,
    Booking,
    Payment,
    Review,
    WalletTransaction,
    Notification
} = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { sendNotification } = require('../utils/notifications');

const router = express.Router();

// All admin routes require admin authentication
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// Dashboard statistics
router.get('/dashboard/stats', async(req, res) => {
    try {
        const [
            totalUsers,
            totalProviders,
            totalBookings,
            totalRevenue,
            pendingBookings,
            completedBookings,
            activeServices,
            pendingProviders
        ] = await Promise.all([
            User.count({ where: { role: 'user', isActive: true } }),
            Provider.count({ where: { isVerified: true } }),
            Booking.count(),
            Payment.sum('amount', { where: { status: 'successful' } }),
            Booking.count({ where: { status: 'pending' } }),
            Booking.count({ where: { status: 'completed' } }),
            Service.count({ where: { isActive: true } }),
            Provider.count({ where: { isVerified: false } })
        ]);

        // Get monthly booking trends (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyBookings = await Booking.findAll({
            attributes: [
                [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
                [sequelize.fn('COUNT', '*'), 'count']
            ],
            where: {
                createdAt: {
                    [Op.gte]: sixMonthsAgo
                }
            },
            group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
            order: [
                [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']
            ]
        });

        // Get top service categories
        const topCategories = await ServiceCategory.findAll({
            attributes: [
                'name', [sequelize.fn('COUNT', sequelize.col('services.id')), 'serviceCount']
            ],
            include: [{
                model: Service,
                as: 'services',
                attributes: [],
                where: { isActive: true },
                required: false
            }],
            group: ['ServiceCategory.id', 'ServiceCategory.name'],
            order: [
                [sequelize.fn('COUNT', sequelize.col('services.id')), 'DESC']
            ],
            limit: 5
        });

        res.json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    totalProviders,
                    totalBookings,
                    totalRevenue: parseFloat(totalRevenue || 0),
                    pendingBookings,
                    completedBookings,
                    activeServices,
                    pendingProviders
                },
                trends: {
                    monthlyBookings,
                    topCategories
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        });
    }
});

// Get all users with filters
router.get('/users', [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('role').optional().isIn(['user', 'provider', 'admin']),
    query('status').optional().isIn(['active', 'inactive']),
    query('search').optional().isString()
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

        const {
            page = 1,
                limit = 20,
                role,
                status,
                search,
                sortBy = 'createdAt',
                sortOrder = 'DESC'
        } = req.query;

        const offset = (page - 1) * limit;
        const whereClause = {};

        if (role) whereClause.role = role;
        if (status === 'active') whereClause.isActive = true;
        if (status === 'inactive') whereClause.isActive = false;

        if (search) {
            whereClause[Op.or] = [{
                    fullName: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                {
                    email: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                {
                    phone: {
                        [Op.iLike]: `%${search}%`
                    }
                }
            ];
        }

        const users = await User.findAndCountAll({
            where: whereClause,
            attributes: { exclude: ['password'] },
            include: [{
                model: Provider,
                as: 'providerProfile',
                required: false
            }],
            order: [
                [sortBy, sortOrder.toUpperCase()]
            ],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            data: {
                users: users.rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(users.count / limit),
                    totalItems: users.count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
});

// Get single user details
router.get('/users/:id', async(req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [
                { model: Provider, as: 'providerProfile' },
                {
                    model: Booking,
                    as: 'bookings',
                    limit: 10,
                    order: [
                        ['createdAt', 'DESC']
                    ]
                },
                {
                    model: WalletTransaction,
                    as: 'walletTransactions',
                    limit: 10,
                    order: [
                        ['createdAt', 'DESC']
                    ]
                }
            ]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: { user }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user details',
            error: error.message
        });
    }
});

// Update user status
router.put('/users/:id/status', [
    body('isActive').isBoolean().withMessage('Status must be boolean'),
    body('reason').optional().isString().withMessage('Reason must be string')
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

        const { isActive, reason } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.update({ isActive });

        // Send notification to user
        await sendNotification(user.id, {
            title: `Account ${isActive ? 'Activated' : 'Deactivated'}`,
            message: reason || `Your account has been ${isActive ? 'activated' : 'deactivated'} by admin`,
            type: 'system'
        });

        res.json({
            success: true,
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update user status',
            error: error.message
        });
    }
});

// Get all providers for verification
router.get('/providers/pending', async(req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const providers = await Provider.findAndCountAll({
            where: { isVerified: false },
            include: [{
                model: User,
                as: 'user',
                attributes: { exclude: ['password'] }
            }],
            order: [
                ['createdAt', 'ASC']
            ],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            data: {
                providers: providers.rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(providers.count / limit),
                    totalItems: providers.count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending providers',
            error: error.message
        });
    }
});

// Verify/reject provider
router.put('/providers/:id/verify', [
    body('isVerified').isBoolean().withMessage('Verification status must be boolean'),
    body('reason').optional().isString().withMessage('Reason must be string')
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

        const { isVerified, reason } = req.body;
        const provider = await Provider.findByPk(req.params.id, {
            include: [{ model: User, as: 'user' }]
        });

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: 'Provider not found'
            });
        }

        await provider.update({ isVerified });

        // Send notification to provider
        await sendNotification(provider.userId, {
            title: `Provider ${isVerified ? 'Approved' : 'Rejected'}`,
            message: reason || `Your provider application has been ${isVerified ? 'approved' : 'rejected'}`,
            type: 'system'
        });

        res.json({
            success: true,
            message: `Provider ${isVerified ? 'verified' : 'rejected'} successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update provider verification',
            error: error.message
        });
    }
});

// Manage service categories
router.get('/categories', async(req, res) => {
    try {
        const categories = await ServiceCategory.findAll({
            include: [{
                model: Service,
                as: 'services',
                attributes: ['id'],
                required: false
            }],
            order: [
                ['name', 'ASC']
            ]
        });

        const categoriesWithCount = categories.map(cat => ({
            ...cat.toJSON(),
            serviceCount: cat.services ? cat.services.length : 0
        }));

        res.json({
            success: true,
            data: { categories: categoriesWithCount }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
});

// Create service category
router.post('/categories', [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('icon').optional().isString().withMessage('Icon must be string')
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

        const { name, description, icon } = req.body;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const category = await ServiceCategory.create({
            name,
            slug,
            description,
            icon
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: { category }
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Category name already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create category',
            error: error.message
        });
    }
});

// Update service category
router.put('/categories/:id', [
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('description').optional().isLength({ max: 500 }),
    body('icon').optional().isString(),
    body('isActive').optional().isBoolean()
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

        const category = await ServiceCategory.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        const updates = {...req.body };
        if (updates.name) {
            updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }

        await category.update(updates);

        res.json({
            success: true,
            message: 'Category updated successfully',
            data: { category }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update category',
            error: error.message
        });
    }
});

// Get all bookings for admin
router.get('/bookings', [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
    query('dateFrom').optional().isISO8601(),
    query('dateTo').optional().isISO8601()
], async(req, res) => {
    try {
        const {
            page = 1,
                limit = 20,
                status,
                dateFrom,
                dateTo,
                sortBy = 'createdAt',
                sortOrder = 'DESC'
        } = req.query;

        const offset = (page - 1) * limit;
        const whereClause = {};

        if (status) whereClause.status = status;
        if (dateFrom && dateTo) {
            whereClause.createdAt = {
                [Op.between]: [new Date(dateFrom), new Date(dateTo)]
            };
        }

        const bookings = await Booking.findAndCountAll({
            where: whereClause,
            include: [
                { model: User, as: 'user', attributes: ['fullName', 'email', 'phone'] },
                { model: Service, as: 'service', attributes: ['title'] },
                { model: Provider, as: 'provider', include: [{ model: User, as: 'user', attributes: ['fullName'] }] },
                { model: Payment, as: 'payment' }
            ],
            order: [
                [sortBy, sortOrder.toUpperCase()]
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

// Send system notification to users
router.post('/notifications/broadcast', [
    body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required'),
    body('message').trim().isLength({ min: 1, max: 500 }).withMessage('Message is required'),
    body('userRole').optional().isIn(['user', 'provider', 'all']).withMessage('Invalid user role'),
    body('userIds').optional().isArray().withMessage('User IDs must be array')
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

        const { title, message, userRole = 'all', userIds } = req.body;
        let targetUsers = [];

        if (userIds && userIds.length > 0) {
            // Send to specific users
            targetUsers = await User.findAll({
                where: {
                    id: {
                        [Op.in]: userIds
                    },
                    isActive: true
                },
                attributes: ['id']
            });
        } else {
            // Send to users by role
            const whereClause = { isActive: true };
            if (userRole !== 'all') {
                whereClause.role = userRole;
            }

            targetUsers = await User.findAll({
                where: whereClause,
                attributes: ['id']
            });
        }

        // Create notifications for all target users
        const notifications = targetUsers.map(user => ({
            userId: user.id,
            title,
            message,
            type: 'system'
        }));

        await Notification.bulkCreate(notifications);

        // Send real-time notifications
        if (global.io) {
            targetUsers.forEach(user => {
                global.io.to(`user_${user.id}`).emit('new_notification', {
                    title,
                    message,
                    type: 'system',
                    createdAt: new Date()
                });
            });
        }

        res.json({
            success: true,
            message: `Notification sent to ${targetUsers.length} users`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to send notifications',
            error: error.message
        });
    }
});

module.exports = router;