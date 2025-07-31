const express = require('express');
const { Op } = require('sequelize');
const { body, query, validationResult } = require('express-validator');
const { Service, ServiceCategory, Provider, User, Review } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get all service categories
router.get('/categories', async(req, res) => {
    try {
        const categories = await ServiceCategory.findAll({
            where: { isActive: true },
            order: [
                ['name', 'ASC']
            ]
        });

        res.json({
            success: true,
            data: { categories }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
});

// Get all services with filters
router.get('/', [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('category').optional().isUUID().withMessage('Category must be a valid UUID'),
    query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be positive'),
    query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be positive'),
    query('city').optional().isString().withMessage('City must be a string'),
    query('search').optional().isString().withMessage('Search must be a string')
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
                category,
                minPrice,
                maxPrice,
                city,
                search,
                sortBy = 'createdAt',
                sortOrder = 'DESC'
        } = req.query;

        const offset = (page - 1) * limit;
        const whereClause = { isActive: true };
        const providerWhereClause = { isVerified: true, isAvailable: true };

        // Filter by category
        if (category) {
            whereClause.categoryId = category;
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            whereClause.price = {};
            if (minPrice) whereClause.price[Op.gte] = minPrice;
            if (maxPrice) whereClause.price[Op.lte] = maxPrice;
        }

        // Search in title and description
        if (search) {
            whereClause[Op.or] = [
                { title: {
                        [Op.iLike]: `%${search}%` } },
                { description: {
                        [Op.iLike]: `%${search}%` } }
            ];
        }

        // Filter by city
        if (city) {
            providerWhereClause['$user.address.city$'] = {
                [Op.iLike]: `%${city}%` };
        }

        const services = await Service.findAndCountAll({
            where: whereClause,
            include: [{
                    model: ServiceCategory,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: Provider,
                    as: 'provider',
                    where: providerWhereClause,
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['fullName', 'profileImage', 'address']
                    }]
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
                services: services.rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(services.count / limit),
                    totalItems: services.count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch services',
            error: error.message
        });
    }
});

// Get single service by ID
router.get('/:id', async(req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findOne({
            where: { id, isActive: true },
            include: [{
                    model: ServiceCategory,
                    as: 'category'
                },
                {
                    model: Provider,
                    as: 'provider',
                    include: [{
                            model: User,
                            as: 'user',
                            attributes: { exclude: ['password'] }
                        },
                        {
                            model: Review,
                            as: 'reviews',
                            limit: 5,
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
                }
            ]
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.json({
            success: true,
            data: { service }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch service',
            error: error.message
        });
    }
});

// Get featured services
router.get('/featured/list', async(req, res) => {
    try {
        const { limit = 8 } = req.query;

        const featuredServices = await Service.findAll({
            where: {
                isActive: true,
                isFeatured: true
            },
            include: [{
                    model: ServiceCategory,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: Provider,
                    as: 'provider',
                    where: { isVerified: true, isAvailable: true },
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: ['fullName', 'profileImage', 'address']
                    }]
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ],
            limit: parseInt(limit)
        });

        res.json({
            success: true,
            data: { services: featuredServices }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch featured services',
            error: error.message
        });
    }
});

// Get provider's services
router.get('/provider/my-services', authenticateToken, authorizeRoles('provider'), async(req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
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
            whereClause.isActive = status === 'active';
        }

        const services = await Service.findAndCountAll({
            where: whereClause,
            include: [{
                model: ServiceCategory,
                as: 'category',
                attributes: ['id', 'name', 'slug']
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
                services: services.rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(services.count / limit),
                    totalItems: services.count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch provider services',
            error: error.message
        });
    }
});

// Create a new service (Provider only)
router.post('/', authenticateToken, authorizeRoles('provider'), [
    body('categoryId').isUUID().withMessage('Category ID must be valid'),
    body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
    body('description').optional().isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('duration').optional().isInt({ min: 15 }).withMessage('Duration must be at least 15 minutes')
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

        // Check if user has provider profile
        const provider = await Provider.findOne({ where: { userId: req.user.id } });
        if (!provider) {
            return res.status(403).json({
                success: false,
                message: 'Provider profile required'
            });
        }

        const serviceData = {
            ...req.body,
            providerId: provider.id
        };

        const service = await Service.create(serviceData);

        const newService = await Service.findByPk(service.id, {
            include: [
                { model: ServiceCategory, as: 'category' },
                { model: Provider, as: 'provider' }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            data: { service: newService }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create service',
            error: error.message
        });
    }
});

// Update service (Provider only)
router.put('/:id', authenticateToken, authorizeRoles('provider'), [
    body('title').optional().trim().isLength({ min: 5, max: 100 }),
    body('description').optional().isLength({ max: 1000 }),
    body('price').optional().isFloat({ min: 0 }),
    body('duration').optional().isInt({ min: 15 })
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
            return res.status(403).json({
                success: false,
                message: 'Provider profile required'
            });
        }

        const service = await Service.findOne({
            where: { id: req.params.id, providerId: provider.id }
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found or unauthorized'
            });
        }

        await service.update(req.body);

        const updatedService = await Service.findByPk(service.id, {
            include: [
                { model: ServiceCategory, as: 'category' },
                { model: Provider, as: 'provider' }
            ]
        });

        res.json({
            success: true,
            message: 'Service updated successfully',
            data: { service: updatedService }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update service',
            error: error.message
        });
    }
});

// Delete service (Provider only)
router.delete('/:id', authenticateToken, authorizeRoles('provider'), async(req, res) => {
    try {
        const provider = await Provider.findOne({ where: { userId: req.user.id } });
        if (!provider) {
            return res.status(403).json({
                success: false,
                message: 'Provider profile required'
            });
        }

        const service = await Service.findOne({
            where: { id: req.params.id, providerId: provider.id }
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found or unauthorized'
            });
        }

        await service.update({ isActive: false });

        res.json({
            success: true,
            message: 'Service deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete service',
            error: error.message
        });
    }
});

module.exports = router;