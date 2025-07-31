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

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

        // Health check endpoint
        app.get('/api/health', (req, res) => {
            res.json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development',
                database: 'Connected'
            });
        });

        // Error handling middleware (must be last)
        app.use(errorHandler);

        // 404 handler
        app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                message: 'Route not found'
            });
        });

        const server = app.listen(PORT, () => {
            console.log(`🚀 Fixify Backend Server running on port ${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
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
            });

            socket.on('booking_update', (data) => {
                socket.to(`booking_${data.bookingId}`).emit('booking_status_updated', data);
            });

            socket.on('disconnect', () => {
                console.log('🔌 User disconnected:', socket.id);
            });
        });

        // Make io available globally
        global.io = io;

    } catch (error) {
        console.error('❌ Unable to connect to database:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;