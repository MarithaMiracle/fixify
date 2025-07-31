const express = require('express');
const { Op } = require('sequelize');
const { body, query, validationResult } = require('express-validator');
const { Provider, User, Service, Review, Booking } = require('../models');
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
                [Op.gte]: minRating };
        }

        // Filter by city
        if (city) {
            userWhereClause['address.city'] = {
                [Op.iLike]: `%${city}%` };
        }

        // Filter by category (through services)
        if (category) {
            serviceWhereClause.categoryId = category;
        }

        // Search in business name and bio
        if (search) {
            whereClause[Op.or] = [
                { businessName: {
                        [Op.iLike]: `%${search}%` } },
                { bio: {
                        [Op.iLike]: `%${search}%` } }
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