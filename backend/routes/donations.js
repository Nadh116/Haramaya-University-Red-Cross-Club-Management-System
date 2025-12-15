const express = require('express');
const {
    getDonations,
    getDonation,
    createDonation,
    updateDonation,
    deleteDonation,
    verifyDonation,
    getDonationStats
} = require('../controllers/donationController');

const { protect, authorize } = require('../middleware/auth');
const {
    validateDonationCreation,
    handleValidationErrors
} = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Statistics route
router.get('/stats', authorize('admin', 'officer'), getDonationStats);

// CRUD routes
router
    .route('/')
    .get(getDonations)
    .post(authorize('admin', 'officer'), validateDonationCreation, handleValidationErrors, createDonation);

router
    .route('/:id')
    .get(getDonation)
    .put(authorize('admin', 'officer'), updateDonation)
    .delete(authorize('admin'), deleteDonation);

// Verification route
router.put('/:id/verify', authorize('admin', 'officer'), verifyDonation);

module.exports = router;