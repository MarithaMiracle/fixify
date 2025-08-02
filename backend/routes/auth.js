const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const { User, Provider } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email'); // Corrected and updated imports
const { Op } = require('sequelize');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Register user
router.post('/register', [
    body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
    body('phone')
    .matches(/^(\+234|0)[789]\d{9}$/)
    .withMessage('Please enter a valid Nigerian phone number'),
    body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
    body('role')
    .optional()
    .isIn(['user', 'provider'])
    .withMessage('Role must be either user or provider')
], async(req, res) => {
    console.log('--- Register route hit ---'); // Logging the start of the route
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation failed:', errors.array());
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { fullName, email, phone, password, role = 'user' } = req.body;
        console.log(`Attempting to register new user with email: ${email} and phone: ${phone}`);

        // Check if user already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { phone }]
            }
        });

        if (existingUser) {
            console.log('User found in database. Registration denied.', existingUser.id);
            return res.status(400).json({
                success: false,
                message: 'User with this email or phone already exists'
            });
        }

        console.log('No existing user found. Proceeding with registration.');

        // Generate email verification token
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');

        // Create user
        const user = await User.create({
            fullName,
            email,
            phone,
            password,
            role,
            emailVerificationToken
        });

        console.log('New user created in database:', user.id);

        // If provider, create provider profile
        if (role === 'provider') {
            await Provider.create({
                userId: user.id,
                bio: `Professional ${fullName}`,
                isVerified: false
            });
            console.log('New provider profile created for user:', user.id);
        }

        // Send verification email
        await sendVerificationEmail(user.email, emailVerificationToken, user.fullName);

        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please check your email for verification.',
            data: {
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified
                },
                token
            }
        });
    } catch (error) {
        console.error('CRITICAL Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

// Login user
router.post('/login', [
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
    body('password')
    .notEmpty()
    .withMessage('Password is required')
], async(req, res) => {
    console.log('--- Login route hit ---'); // Logging the start of the route
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation failed:', errors.array());
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;
        console.log(`Attempting to log in user with email: ${email}`);

        // Find user with password
        const user = await User.findOne({
            where: { email },
            attributes: { include: ['password'] },
            include: [{
                model: Provider,
                as: 'providerProfile',
                required: false
            }]
        });

        if (!user || !(await user.comparePassword(password))) {
            console.log('Login failed: Invalid email or password.');
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        if (!user.isActive) {
            console.log('Login failed: Account is deactivated.');
            return res.status(401).json({
                success: false,
                message: 'Account has been deactivated'
            });
        }

        // Update last login
        await user.update({ lastLoginAt: new Date() });
        console.log('User successfully logged in:', user.id);

        const token = generateToken(user.id);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified,
                    profileImage: user.profileImage,
                    walletBalance: user.walletBalance,
                    providerProfile: user.providerProfile
                },
                token
            }
        });
    } catch (error) {
        console.error('CRITICAL Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// Get current user profile
router.get('/me', authenticateToken, async(req, res) => {
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
            message: 'Failed to fetch user profile',
            error: error.message
        });
    }
});

// Verify email
router.get('/verify-email/:token', async(req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            where: { emailVerificationToken: token }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }

        await user.update({
            isEmailVerified: true,
            emailVerificationToken: null
        });

        res.json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Email verification failed',
            error: error.message
        });
    }
});

// Forgot password
router.post('/forgot-password', [
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email')
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

        const { email } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await user.update({
            passwordResetToken: resetToken,
            passwordResetExpires: resetExpires
        });

        // Send reset email
        await sendPasswordResetEmail(user.email, resetToken, user.fullName);

        res.json({
            success: true,
            message: 'Password reset link sent to your email'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to send reset email',
            error: error.message
        });
    }
});

// Reset password
router.post('/reset-password/:token', [
    body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
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

        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            where: {
                passwordResetToken: token,
                passwordResetExpires: {
                    [Op.gt]: new Date()
                }
            }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        await user.update({
            password,
            passwordResetToken: null,
            passwordResetExpires: null
        });

        res.json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Password reset failed',
            error: error.message
        });
    }
});

// Change password
router.post('/change-password', authenticateToken, [
    body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
    body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
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

        const { currentPassword, newPassword } = req.body;

        const user = await User.findByPk(req.user.id, {
            attributes: { include: ['password'] }
        });

        if (!(await user.comparePassword(currentPassword))) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        await user.update({ password: newPassword });

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to change password',
            error: error.message
        });
    }
});

module.exports = router;