const express = require('express');
const Branch = require('../models/Branch');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all branches
// @route   GET /api/branches
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const branches = await Branch.find({ isActive: true }).sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: branches.length,
            branches
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get single branch
// @route   GET /api/branches/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
    try {
        const branch = await Branch.findById(req.params.id);

        if (!branch) {
            return res.status(404).json({
                success: false,
                message: 'Branch not found'
            });
        }

        res.status(200).json({
            success: true,
            branch
        });
    } catch (error) {
        next(error);
    }
});

// Protected routes
router.use(protect);

// @desc    Create branch
// @route   POST /api/branches
// @access  Private/Admin
router.post('/', authorize('admin'), async (req, res, next) => {
    try {
        const branch = await Branch.create(req.body);

        res.status(201).json({
            success: true,
            branch
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Update branch
// @route   PUT /api/branches/:id
// @access  Private/Admin
router.put('/:id', authorize('admin'), async (req, res, next) => {
    try {
        const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!branch) {
            return res.status(404).json({
                success: false,
                message: 'Branch not found'
            });
        }

        res.status(200).json({
            success: true,
            branch
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Delete branch
// @route   DELETE /api/branches/:id
// @access  Private/Admin
router.delete('/:id', authorize('admin'), async (req, res, next) => {
    try {
        const branch = await Branch.findById(req.params.id);

        if (!branch) {
            return res.status(404).json({
                success: false,
                message: 'Branch not found'
            });
        }

        // Soft delete - deactivate instead of removing
        branch.isActive = false;
        await branch.save();

        res.status(200).json({
            success: true,
            message: 'Branch deactivated successfully'
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;