const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    submitContactForm,
    getContacts,
    getContact,
    updateContactStatus,
    addContactResponse,
    deleteContact,
    getContactStatistics
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

// Validation middleware for contact form
const contactValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('subject')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Subject must be between 5 and 200 characters'),
    body('message')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Message must be between 10 and 2000 characters'),
    body('inquiryType')
        .isIn(['general', 'volunteer', 'emergency', 'donation', 'training', 'partnership', 'complaint', 'suggestion'])
        .withMessage('Please select a valid inquiry type')
];

// Public routes
router.post('/', contactValidation, submitContactForm);

// Admin routes (require authentication and admin privileges)
router.use(protect);
router.use(authorize('admin', 'moderator'));

router.get('/', getContacts);
router.get('/statistics', getContactStatistics);
router.get('/:id', getContact);
router.put('/:id/status', updateContactStatus);
router.post('/:id/response', addContactResponse);
router.delete('/:id', deleteContact);

module.exports = router;