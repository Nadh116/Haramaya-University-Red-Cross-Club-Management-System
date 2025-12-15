const express = require('express');
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    approveUser,
    rejectUser,
    getPendingApprovals,
    getUserStats
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Public routes for authenticated users
router.get('/stats', authorize('admin', 'officer'), getUserStats);
router.get('/pending', authorize('admin', 'officer'), getPendingApprovals);

// Admin/Officer only routes
router
    .route('/')
    .get(authorize('admin', 'officer'), getUsers)
    .post(authorize('admin'), createUser);

router
    .route('/:id')
    .get(authorize('admin', 'officer'), getUser)
    .put(authorize('admin'), updateUser)
    .delete(authorize('admin'), deleteUser);

// Approval routes
router.put('/:id/approve', authorize('admin', 'officer'), approveUser);
router.put('/:id/reject', authorize('admin', 'officer'), rejectUser);

module.exports = router;