const express = require('express');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @desc    Get all members
// @route   GET /api/members
// @access  Private/Admin/Officer
router.get('/', authorize('admin', 'officer'), async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        // Build query for members only
        let query = {
            role: { $in: ['member', 'volunteer'] },
            isActive: true
        };

        // Filter by branch
        if (req.query.branch) {
            query.branch = req.query.branch;
        }

        // Filter by approval status
        if (req.query.isApproved !== undefined) {
            query.isApproved = req.query.isApproved === 'true';
        }

        // Search by name, email, or student ID
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            query.$or = [
                { firstName: searchRegex },
                { lastName: searchRegex },
                { email: searchRegex },
                { studentId: searchRegex }
            ];
        }

        const total = await User.countDocuments(query);
        const members = await User.find(query)
            .populate('branch', 'name code')
            .populate('approvedBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(startIndex);

        // Pagination result
        const pagination = {};

        if (startIndex + limit < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.status(200).json({
            success: true,
            count: members.length,
            total,
            pagination,
            members
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get member statistics
// @route   GET /api/members/stats
// @access  Private/Admin/Officer
router.get('/stats', authorize('admin', 'officer'), async (req, res, next) => {
    try {
        const memberStats = await User.aggregate([
            {
                $match: {
                    role: { $in: ['member', 'volunteer'] },
                    isActive: true
                }
            },
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 },
                    approved: {
                        $sum: { $cond: [{ $eq: ['$isApproved', true] }, 1, 0] }
                    }
                }
            }
        ]);

        const branchStats = await User.aggregate([
            {
                $match: {
                    role: { $in: ['member', 'volunteer'] },
                    isActive: true
                }
            },
            {
                $lookup: {
                    from: 'branches',
                    localField: 'branch',
                    foreignField: '_id',
                    as: 'branchInfo'
                }
            },
            {
                $unwind: '$branchInfo'
            },
            {
                $group: {
                    _id: '$branchInfo.name',
                    members: {
                        $sum: { $cond: [{ $eq: ['$role', 'member'] }, 1, 0] }
                    },
                    volunteers: {
                        $sum: { $cond: [{ $eq: ['$role', 'volunteer'] }, 1, 0] }
                    },
                    total: { $sum: 1 }
                }
            }
        ]);

        const bloodTypeStats = await User.aggregate([
            {
                $match: {
                    role: { $in: ['member', 'volunteer'] },
                    isActive: true,
                    isApproved: true,
                    bloodType: { $ne: 'Unknown' }
                }
            },
            {
                $group: {
                    _id: '$bloodType',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id': 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            memberStats,
            branchStats,
            bloodTypeStats
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;