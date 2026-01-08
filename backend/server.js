const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const memberRoutes = require('./routes/members');
const volunteerRoutes = require('./routes/volunteers');
const eventRoutes = require('./routes/events');
const donationRoutes = require('./routes/donations');
const announcementRoutes = require('./routes/announcements');
const branchRoutes = require('./routes/branches');
const dashboardRoutes = require('./routes/dashboard');
const galleryRoutes = require('./routes/gallery');
const contactRoutes = require('./routes/contact');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Security middleware
app.use(helmet());

// Request logging middleware
app.use(logger.requestLogger());

// Rate limiting - Disabled for development, enabled for production only
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 1000 : 999999, // Essentially unlimited in development
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(15 * 60) // 15 minutes in seconds
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting entirely in development
        return process.env.NODE_ENV !== 'production';
    }
});

// Apply rate limiting only in production
if (process.env.NODE_ENV === 'production') {
    app.use('/api/', limiter);
}

// Stricter rate limiting for authentication endpoints only in production
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Increased limit for auth endpoints
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.',
        retryAfter: Math.ceil(15 * 60)
    },
    skipSuccessfulRequests: true,
    skip: (req) => {
        // Skip auth rate limiting in development
        return process.env.NODE_ENV !== 'production';
    }
});

// Apply stricter rate limiting to auth routes only in production
if (process.env.NODE_ENV === 'production') {
    app.use('/api/auth/login', authLimiter);
    app.use('/api/auth/register', authLimiter);
}

// CORS configuration - Updated for production deployment
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = process.env.NODE_ENV === 'production'
            ? [
                'https://haramaya-university-red-cross-club.vercel.app',
                /^https:\/\/haramaya-university-red-cross-club-.*\.vercel\.app$/,
                'https://your-frontend-domain.com'
            ]
            : [
                'http://localhost:3000',
                'http://localhost:3001',
                'http://localhost:3002',
                'http://localhost:3003'
            ];

        // Check if origin is allowed
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (typeof allowedOrigin === 'string') {
                return origin === allowedOrigin;
            } else if (allowedOrigin instanceof RegExp) {
                return allowedOrigin.test(origin);
            }
            return false;
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Body parsing middleware with proper limits
app.use(express.json({
    limit: '10mb',
    verify: (req, res, buf) => {
        // Check if payload is too large
        if (buf.length > 10 * 1024 * 1024) { // 10MB
            const error = new Error('Payload too large');
            error.status = 413;
            throw error;
        }
    }
}));
app.use(express.urlencoded({
    extended: true,
    limit: '10mb',
    verify: (req, res, buf) => {
        if (buf.length > 10 * 1024 * 1024) {
            const error = new Error('Payload too large');
            error.status = 413;
            throw error;
        }
    }
}));

// Static files
app.use('/uploads', express.static('uploads'));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);

// Root endpoint - API information
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Haramaya University Red Cross Club API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            users: '/api/users',
            events: '/api/events',
            donations: '/api/donations',
            announcements: '/api/announcements',
            dashboard: '/api/dashboard',
            gallery: '/api/gallery',
            contact: '/api/contact'
        },
        documentation: 'Visit /api/health for system status'
    });
});

// Health check endpoint with system status
app.get('/api/health', async (req, res) => {
    try {
        // Check database connection
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

        // Check memory usage
        const memoryUsage = process.memoryUsage();

        // System uptime
        const uptime = process.uptime();

        const healthData = {
            success: true,
            message: 'Haramaya Red Cross API is running',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            status: {
                database: dbStatus,
                uptime: `${Math.floor(uptime / 60)} minutes`,
                memory: {
                    used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
                    total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`
                }
            }
        };

        // Log health check access
        logger.info('Health check accessed', {
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });

        res.status(200).json(healthData);
    } catch (error) {
        logger.error('Health check failed', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Health check failed',
            timestamp: new Date().toISOString()
        });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

module.exports = app;