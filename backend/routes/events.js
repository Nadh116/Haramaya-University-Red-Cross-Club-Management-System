const express = require('express');
const {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    unregisterFromEvent,
    addEventFeedback
} = require('../controllers/eventController');

const { protect, authorize, optionalAuth } = require('../middleware/auth');
const {
    validateEventCreation,
    handleValidationErrors
} = require('../middleware/validation');

const router = express.Router();

// Public routes (with optional auth for personalized content)
router.get('/', optionalAuth, getEvents);
router.get('/:id', optionalAuth, getEvent);

// Protected routes
router.use(protect);

// Event management (Admin/Officer only)
router.post('/', authorize('admin', 'officer'), validateEventCreation, handleValidationErrors, createEvent);
router.put('/:id', authorize('admin', 'officer'), updateEvent);
router.delete('/:id', authorize('admin', 'officer'), deleteEvent);

// Event participation (All authenticated users)
router.post('/:id/register', registerForEvent);
router.delete('/:id/register', unregisterFromEvent);
router.post('/:id/feedback', addEventFeedback);

module.exports = router;