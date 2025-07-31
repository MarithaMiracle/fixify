const express = require('express');
const { body, validationResult } = require('express-validator');
const { Review, Booking, User, Provider } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { sendNotification } = require('../utils/notifications');

const router = express.Router();

// Create a review
router.post('/', authenticateToken, [
    body('bookingId').isUUID().withMessage('Booking ID must be valid'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters')
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

        const { bookingId, rating, comment, images = [] } = req.body;

        // Verify booking exists and belongs to user
        const booking = await Booking.findOne({
            where: {
                id: bookingId,
                userId: req.user.id,
                status: 'completed'
            }
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Completed booking not found'
            });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({ where: { bookingId } });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'Review already exists for this booking'
            });
        }

        // Create review
        const review = await Review.create({
            bookingId,
            userId: req.user.id,
            providerId: booking.providerId,
            rating,
            comment,
            images
        });

        // Update provider average rating
        const provider = await Provider.findByPk(booking.providerId);
        const allReviews = await Review.findAll({
            where: { providerId: booking.providerId }
        });

        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = (totalRating / allReviews.length).toFixed(2);

        await provider.update({
            averageRating,
            totalReviews: allReviews.length
        });

        // Send notification to provider
        const providerUser = await User.findByPk(provider.userId);
        await sendNotification(provider.userId, {
            title: 'New Review Received',
            message: `You received a ${rating}-star review from ${req.user.fullName}`,
            type: 'review',
            data: { reviewId: review.id, rating }
        });

        const completeReview = await Review.findByPk(review.id, {
            include: [
                { model: User, as: 'user', attributes: ['fullName', 'profileImage'] },
                { model: Booking, as: 'booking' }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: { review: completeReview }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create review',
            error: error.message
        });
    }
});

// Get reviews for a provider
router.get('/provider/:providerId', async(req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const reviews = await Review.findAndCountAll({
            where: { providerId: req.params.providerId },
            include: [
                { model: User, as: 'user', attributes: ['fullName', 'profileImage'] },
                { model: Booking, as: 'booking', attributes: ['bookingNumber'] }
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
                reviews: reviews.rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(reviews.count / limit),
                    totalItems: reviews.count,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
            error: error.message
        });
    }
});

module.exports = router;