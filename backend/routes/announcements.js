const express = require('express');
const {
    getAnnouncements,
    getAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    toggleLike,
    addComment
} = require('../controllers/announcementController');

const { protect, authorize, optionalAuth } = require('../middleware/auth');
const {
    validateAnnouncementCreation,
    handleValidationErrors
} = require('../middleware/validation');

const router = express.Router();

// Public routes (with optional auth for personalized content)
router.get('/', optionalAuth, getAnnouncements);
router.get('/:id', optionalAuth, getAnnouncement);

// Protected routes
router.use(protect);

// CRUD routes (Admin/Officer only)
router.post('/', authorize('admin', 'officer'), validateAnnouncementCreation, handleValidationErrors, createAnnouncement);
router.put('/:id', authorize('admin', 'officer'), updateAnnouncement);
router.delete('/:id', authorize('admin', 'officer'), deleteAnnouncement);

// Interaction routes (All authenticated users)
router.post('/:id/like', toggleLike);
router.post('/:id/comments', addComment);

module.exports = router;