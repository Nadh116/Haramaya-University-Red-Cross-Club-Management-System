const express = require('express');
const router = express.Router();
const {
    getGalleryImages,
    getGalleryImage,
    uploadGalleryImage,
    updateGalleryImage,
    deleteGalleryImage,
    toggleLike,
    getGalleryStatistics,
    getFeaturedImages
} = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getGalleryImages);
router.get('/featured', getFeaturedImages);
router.get('/statistics', getGalleryStatistics);
router.get('/:id', getGalleryImage);

// Protected routes (require authentication)
router.use(protect);

// User routes (authenticated users)
router.post('/:id/like', toggleLike);

// Admin routes (require admin privileges)
router.post('/', authorize('admin', 'officer'), uploadGalleryImage);
router.put('/:id', authorize('admin', 'officer'), updateGalleryImage);
router.delete('/:id', authorize('admin', 'officer'), deleteGalleryImage);

module.exports = router;