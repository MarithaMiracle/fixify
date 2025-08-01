const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const providerRoutes = require('./routes/providers');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Body parsing middleware (move before rate limiting)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// More specific rate limiting - only apply to auth routes in production
if (process.env.NODE_ENV === 'production') {
    const authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 10, // limit auth attempts
        message: {
            success: false,
            message: 'Too many authentication attempts, please try again later.'
        }
    });

    const generalLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000, // More generous for general API usage
        message: {
            success: false,
            message: 'Too many requests from this IP, please try again later.'
        }
    });

    // Apply stricter limits to auth routes
    app.use('/api/auth/login', authLimiter);
    app.use('/api/auth/register', authLimiter);
    app.use('/api/auth/forgot-password', authLimiter);

    // Apply general limits to other routes
    app.use('/api/', generalLimiter);
} else {
    // In development, use very lenient rate limiting or none at all
    console.log('🔧 Development mode: Rate limiting disabled');
}

// Database connection and sync
const startServer = async() => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to PostgreSQL');

        // Sync database (creates tables if they don't exist)
        if (process.env.NODE_ENV !== 'production') {
            await sequelize.sync({ alter: true });
            console.log('✅ Database synchronized');
        }

        // Health check endpoint (before other routes for quick access)
        app.get('/api/health', (req, res) => {
            res.json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development',
                database: 'Connected',
                server: 'Fixify Backend v1.0'
            });
        });

        // Routes
        app.use('/api/auth', authRoutes);
        app.use('/api/users', userRoutes);
        app.use('/api/providers', providerRoutes);
        app.use('/api/services', serviceRoutes);
        app.use('/api/bookings', bookingRoutes);
        app.use('/api/payments', paymentRoutes);
        app.use('/api/reviews', reviewRoutes);
        app.use('/api/admin', adminRoutes);
        app.use('/api/upload', uploadRoutes);

        // Error handling middleware (must be last)
        app.use(errorHandler);

        // 404 handler
        app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                message: `Route ${req.originalUrl} not found`,
                availableRoutes: [
                    'GET /api/health',
                    'POST /api/auth/register',
                    'POST /api/auth/login',
                    'GET /api/auth/me'
                ]
            });
        });

        const server = app.listen(PORT, () => {
            console.log(`🚀 Fixify Backend Server running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
            console.log(`🔐 Auth Endpoints: http://localhost:${PORT}/api/auth/*`);
        });

        // Socket.IO setup for real-time features
        const { Server } = require('socket.io');
        const io = new Server(server, {
            cors: {
                origin: process.env.FRONTEND_URL || 'http://localhost:3000',
                methods: ['GET', 'POST']
            }
        });

        // Socket.IO connection handling
        io.on('connection', (socket) => {
            console.log('🔌 User connected:', socket.id);

            socket.on('join_booking_room', (bookingId) => {
                socket.join(`booking_${bookingId}`);
                console.log(`📋 User ${socket.id} joined booking room: ${bookingId}`);
            });

            socket.on('booking_update', (data) => {
                socket.to(`booking_${data.bookingId}`).emit('booking_status_updated', data);
                console.log(`📋 Booking update sent for: ${data.bookingId}`);
            });

            socket.on('disconnect', () => {
                console.log('🔌 User disconnected:', socket.id);
            });
        });

        // Make io available globally
        global.io = io;

        // Graceful shutdown handling
        process.on('SIGTERM', async() => {
            console.log('🛑 SIGTERM received, shutting down gracefully');
            server.close(() => {
                console.log('💤 Process terminated');
            });
        });

        process.on('SIGINT', async() => {
            console.log('🛑 SIGINT received, shutting down gracefully');
            server.close(() => {
                console.log('💤 Process terminated');
            });
        });

    } catch (error) {
        console.error('❌ Unable to connect to database:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;