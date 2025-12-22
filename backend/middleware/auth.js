const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        logger.securityLog('Unauthorized Access Attempt', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            url: req.url,
            method: req.method
        });

        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        const user = await User.findById(decoded.id).populate('branch');

        if (!user) {
            logger.securityLog('Invalid Token - User Not Found', {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                url: req.url,
                tokenId: decoded.id
            });

            return res.status(401).json({
                success: false,
                message: 'No user found with this token'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            logger.securityLog('Deactivated User Access Attempt', {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                url: req.url,
                userId: user._id,
                userEmail: user.email
            });

            return res.status(401).json({
                success: false,
                message: 'User account is deactivated'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        logger.securityLog('Token Verification Failed', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            url: req.url,
            error: error.message
        });

        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            logger.securityLog('Unauthorized Role Access Attempt', {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                url: req.url,
                userId: req.user._id,
                userRole: req.user.role,
                requiredRoles: roles
            });

            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

// Check if user is approved (for members and volunteers)
exports.requireApproval = (req, res, next) => {
    if (['member', 'volunteer'].includes(req.user.role) && !req.user.isApproved) {
        return res.status(403).json({
            success: false,
            message: 'Your account is pending approval. Please wait for admin approval.'
        });
    }
    next();
};

// Optional authentication - doesn't fail if no token
exports.optionalAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).populate('branch');

            if (user && user.isActive) {
                req.user = user;
            }
        } catch (error) {
            // Token is invalid, but we continue without user
            req.user = null;
        }
    }

    next();
};