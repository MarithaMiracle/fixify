const express = require('express');
const { Op } = require('sequelize');
const { body, query, validationResult } = require('express-validator');
const { Provider, User, Service, Review, Booking, Payment, WalletTransaction } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get all providers with filters
router.get('/', [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('city').optional().isString(),
    query('category').optional().isUUID(),
    query('minRating').optional().isFloat({ min: 0, max: 5 }),
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
                limit = 12,
                city,
                category,
                minRating,
                search,
                sortBy = 'averageRating',
                sortOrder = 'DESC'
        } = req.query;

        const offset = (page - 1) * limit;
        const whereClause = { isVerified: true, isAvailable: true };
        const userWhereClause = { isActive: true };
        const serviceWhereClause = { isActive: true };

        // Filter by minimum rating
        if (minRating) {
            whereClause.averageRating = {
                [Op.gte]: minRating
            };
        }

        // Filter by city
        if (city) {
            userWhereClause['address.city'] = {
                [Op.iLike]: `%${city}%`
            };
        }

        // Filter by category (through services)
        if (category) {
            serviceWhereClause.categoryId = category;
        }

        // Search in business name and bio
        if (search) {
            whereClause[Op.or] = [{
                    businessName: {
                        [Op.iLike]: `%${search}%`
                    }
                },
                {
                    bio: {
                        [Op.iLike]: `%${search}%`
                    }
                }
            ];
        }

        const providers = await Provider.findAndCountAll({
            where: whereClause,
            include: [{
                    model: User,
                    as: 'user',
                    where: userWhereClause,
                    attributes: { exclude: ['password'] }
                },
                {
                    model: Service,
                    as: 'services',
                    where: serviceWhereClause,
                    required: category ? true : false,
                    limit: 3
                }
            ],
            order: [
                [sortBy, sortOrder.toUpperCase()]
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true
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
            message: 'Failed to fetch providers',
            error: error.message
        });
    }
});

// --- ENHANCED ROUTE FOR PROVIDER DASHBOARD ---
// @route   GET /api/providers/me
// @desc    Get complete dashboard data for the logged-in provider
// @access  Private (only for authenticated providers)
router.get('/me', authenticateToken, async(req, res) => {
    try {
        // Find the provider profile associated with the logged-in user's ID
        const provider = await Provider.findOne({
            where: { userId: req.user.id },
            include: [{
                    model: User,
                    attributes: ['id', 'email', 'fullName', 'profileImage', 'isProvider', 'phone', 'address']
                },
                {
                    model: Service,
                    attributes: ['id', 'name', 'description', 'price', 'imageUrl', 'isActive', 'createdAt'],
                    order: [
                        ['createdAt', 'DESC']
                    ]
                },
                {
                    model: Booking,
                    attributes: ['id', 'status', 'bookingDate', 'totalAmount', 'createdAt', 'serviceId'],
                    include: [{
                            model: User,
                            attributes: ['fullName', 'phone', 'email', 'profileImage']
                        },
                        {
                            model: Service,
                            attributes: ['name', 'price']
                        }
                    ],
                    order: [
                        ['bookingDate', 'DESC']
                    ],
                    limit: 20
                },
                {
                    model: Review,
                    attributes: ['id', 'rating', 'comment', 'createdAt'],
                    include: [{
                        model: User,
                        attributes: ['fullName', 'profileImage']
                    }],
                    order: [
                        ['createdAt', 'DESC']
                    ],
                    limit: 10
                }
            ]
        });

        // If no provider profile is found, return a 404 error
        if (!provider) {
            return res.status(404).json({
                success: false,
                message: 'Provider profile not found. Please complete your provider registration.'
            });
        }

        // Calculate earnings and statistics
        const completedBookings = await Booking.findAll({
            where: {
                providerId: provider.id,
                status: 'completed'
            },
            include: [{ model: Payment, where: { status: 'completed' }, required: false }]
        });

        const pendingBookings = await Booking.findAll({
            where: {
                providerId: provider.id,
                status: {
                    [Op.in]: ['pending', 'confirmed'] }
            }
        });

        // Calculate total earnings from completed bookings
        const totalEarnings = completedBookings.reduce((sum, booking) => {
            return sum + (booking.totalAmount || 0);
        }, 0);

        // Calculate pending earnings (confirmed but not yet paid)
        const pendingEarnings = pendingBookings
            .filter(booking => booking.status === 'confirmed')
            .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

        // Get recent wallet transactions for payout history
        const walletTransactions = await WalletTransaction.findAll({
            where: { userId: req.user.id, type: 'withdrawal' },
            order: [
                ['createdAt', 'DESC']
            ],
            limit: 10
        });

        // Calculate monthly statistics
        const currentMonth = new Date();
        const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

        const monthlyBookings = await Booking.count({
            where: {
                providerId: provider.id,
                createdAt: {
                    [Op.gte]: firstDayOfMonth }
            }
        });

        const monthlyEarnings = await Booking.sum('totalAmount', {
            where: {
                providerId: provider.id,
                status: 'completed',
                createdAt: {
                    [Op.gte]: firstDayOfMonth }
            }
        }) || 0;

        // Prepare the enhanced response
        const enhancedProviderData = {
            ...provider.toJSON(),
            statistics: {
                totalBookings: provider.Bookings ? .length || 0,
                completedBookings: completedBookings.length,
                pendingBookings: pendingBookings.length,
                totalServices: provider.Services ? .length || 0,
                totalReviews: provider.Reviews ? .length || 0,
                monthlyBookings,
                monthlyEarnings
            },
            earnings: {
                totalEarnings,
                pendingEarnings,
                availableForWithdrawal: totalEarnings - (walletTransactions.reduce((sum, tx) => sum + tx.amount, 0))
            },
            payoutHistory: walletTransactions.map(tx => ({
                id: tx.id,
                amount: tx.amount,
                status: tx.status,
                date: tx.createdAt,
                reference: tx.reference
            }))
        };

        // Return the complete provider data
        res.json({
            success: true,
            data: { provider: enhancedProviderData }
        });
    } catch (err) {
        console.error('Provider dashboard error:', err.message);
        res.status(500).json({
            success: false,
            message: 'Failed to load provider dashboard data'
        });
    }
});

// --- NEW ROUTE FOR UPDATING BOOKING STATUS ---
// @route   PUT /api/providers/bookings/:bookingId/status
// @desc    Update booking status (accept/decline)
// @access  Private (Provider only)
router.put('/bookings/:bookingId/status', authenticateToken, [
    body('status').isIn(['confirmed', 'cancelled']).withMessage('Status must be confirmed or cancelled')
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

        const { bookingId } = req.params;
        const { status } = req.body;

        // Find the provider first
        const provider = await Provider.findOne({ where: { userId: req.user.id } });
        if (!provider) {
            return res.status(404).json({
                success: false,
                message: 'Provider profile not found'
            });
        }

        // Find the booking and verify it belongs to this provider
        const booking = await Booking.findOne({
            where: {
                id: bookingId,
                providerId: provider.id
            }
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found or access denied'
            });
        }

        // Update the booking status
        await booking.update({ status });

        res.json({
            success: true,
            message: `Booking ${status === 'confirmed' ? 'accepted' : 'declined'} successfully`,
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

// Get single provider by ID
router.get('/:id', async(req, res) => {
    try {
        const provider = await Provider.findOne({
            where: { id: req.params.id, isVerified: true },
            include: [{
                    model: User,
                    as: 'user',
                    attributes: { exclude: ['password'] }
                },
                {
                    model: Service,
                    as: 'services',
                    where: { isActive: true },
                    required: false
                },
                {
                    model: Review,
                    as: 'reviews',
                    limit: 10,
                    order: [
                        ['createdAt', 'DESC']
                    ],
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['fullName', 'profileImage']
                    }]
                }
            ]
        });

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: 'Provider not found'
            });
        }

        res.json({
            success: true,
            data: { provider }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch provider',
            error: error.message
        });
    }
});

// Update provider profile
router.put('/profile', authenticateToken, authorizeRoles('provider'), [
    body('businessName').optional().trim().isLength({ min: 2, max: 100 }),
    body('bio').optional().isLength({ max: 1000 }),
    body('skills').optional().isArray(),
    body('experience').optional().isInt({ min: 0 }),
    body('hourlyRate').optional().isFloat({ min: 0 })
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

        const provider = await Provider.findOne({ where: { userId: req.user.id } });
        if (!provider) {
            return res.status(404).json({
                success: false,
                message: 'Provider profile not found'
            });
        }

        const allowedUpdates = [
            'businessName', 'bio', 'skills', 'experience',
            'hourlyRate', 'workingHours', 'serviceRadius'
        ];

        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        await provider.update(updates);

        const updatedProvider = await Provider.findByPk(provider.id, {
            include: [{
                model: User,
                as: 'user',
                attributes: { exclude: ['password'] }
            }]
        });

        res.json({
            success: true,
            message: 'Provider profile updated successfully',
            data: { provider: updatedProvider }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update provider profile',
            error: error.message
        });
    }
});

module.exports = router;