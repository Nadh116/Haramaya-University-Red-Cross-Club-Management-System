const { body, validationResult } = require('express-validator');

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// User registration validation
exports.validateUserRegistration = [
    body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),

    body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),

    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

    body('phone')
        .matches(/^\+?[1-9]\d{1,14}$/)
        .withMessage('Please provide a valid phone number'),

    body('branch')
        .isMongoId()
        .withMessage('Please provide a valid branch ID'),

    body('studentId')
        .optional()
        .isLength({ min: 4, max: 30 })
        .withMessage('Student ID must be between 4 and 30 characters')
];

// User login validation
exports.validateUserLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// Event creation validation
exports.validateEventCreation = [
    body('title')
        .trim()
        .isLength({ min: 5, max: 100 })
        .withMessage('Event title must be between 5 and 100 characters'),

    body('description')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('Event description must be between 10 and 1000 characters'),

    body('type')
        .isIn(['blood_donation', 'training', 'emergency_response', 'awareness', 'fundraising', 'meeting', 'other'])
        .withMessage('Please provide a valid event type'),

    body('startDate')
        .isISO8601()
        .toDate()
        .withMessage('Please provide a valid start date'),

    body('endDate')
        .isISO8601()
        .toDate()
        .withMessage('Please provide a valid end date'),

    body('location')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Location must be between 3 and 100 characters'),

    body('maxParticipants')
        .isInt({ min: 1, max: 1000 })
        .withMessage('Maximum participants must be between 1 and 1000'),

    body('registrationDeadline')
        .isISO8601()
        .toDate()
        .withMessage('Please provide a valid registration deadline')
];

// Donation creation validation
exports.validateDonationCreation = [
    body('type')
        .isIn(['blood', 'money', 'supplies', 'other'])
        .withMessage('Please provide a valid donation type'),

    body('donationDate')
        .isISO8601()
        .toDate()
        .withMessage('Please provide a valid donation date'),

    body('location')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Location must be between 3 and 100 characters'),

    // Conditional validation for blood donations
    body('bloodType')
        .if(body('type').equals('blood'))
        .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .withMessage('Please provide a valid blood type'),

    body('bloodUnits')
        .if(body('type').equals('blood'))
        .isInt({ min: 1, max: 10 })
        .withMessage('Blood units must be between 1 and 10'),

    // Conditional validation for money donations
    body('amount')
        .if(body('type').equals('money'))
        .isFloat({ min: 0 })
        .withMessage('Amount must be a positive number'),

    body('currency')
        .if(body('type').equals('money'))
        .isLength({ min: 3, max: 3 })
        .withMessage('Currency must be a 3-letter code')
];

// Announcement creation validation
exports.validateAnnouncementCreation = [
    body('title')
        .trim()
        .isLength({ min: 5, max: 100 })
        .withMessage('Announcement title must be between 5 and 100 characters'),

    body('content')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Announcement content must be between 10 and 2000 characters'),

    body('type')
        .isIn(['general', 'urgent', 'event', 'donation', 'training', 'meeting', 'emergency'])
        .withMessage('Please provide a valid announcement type'),

    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'critical'])
        .withMessage('Please provide a valid priority level'),

    body('visibility')
        .optional()
        .isIn(['public', 'members_only', 'officers_only', 'admin_only'])
        .withMessage('Please provide a valid visibility level'),

    body('expiryDate')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Please provide a valid expiry date')
];