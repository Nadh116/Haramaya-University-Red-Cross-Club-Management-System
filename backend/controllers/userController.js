const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        // Build query
        let query = {};

        // Filter by role
        if (req.query.role) {
            query.role = req.query.role;
        }

        // Filter by branch
        if (req.query.branch) {
            query.branch = req.query.branch;
        }

        // Filter by approval status
        if (req.query.isApproved !== undefined) {
            query.isApproved = req.query.isApproved === 'true';
        }

        // Filter by active status
        if (req.query.isActive !== undefined) {
            query.isActive = req.query.isActive === 'true';
        }

        // Search by name or email
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
        const users = await User.find(query)
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
            count: users.length,
            total,
            pagination,
            users
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('branch')
            .populate('approvedBy', 'firstName lastName');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        await user.populate('branch');

        res.status(201).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Don't allow password updates through this route
        if (req.body.password) {
            delete req.body.password;
        }

        user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('branch');

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Soft delete - deactivate user instead of removing
        user.isActive = false;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User deactivated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Approve user
// @route   PUT /api/users/:id/approve
// @access  Private/Admin/Officer
exports.approveUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isApproved) {
            return res.status(400).json({
                success: false,
                message: 'User is already approved'
            });
        }

        user.isApproved = true;
        user.approvedBy = req.user.id;
        user.approvedAt = new Date();
        await user.save();

        await user.populate('branch');

        res.status(200).json({
            success: true,
            message: 'User approved successfully',
            user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reject user
// @route   PUT /api/users/:id/reject
// @access  Private/Admin/Officer
exports.rejectUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.isApproved = false;
        user.isActive = false;
        user.approvedBy = null;
        user.approvedAt = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User rejected successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get pending approvals
// @route   GET /api/users/pending
// @access  Private/Admin/Officer
exports.getPendingApprovals = async (req, res, next) => {
    try {
        const users = await User.find({
            isApproved: false,
            isActive: true,
            role: { $in: ['member', 'volunteer'] }
        })
            .populate('branch', 'name code')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private/Admin/Officer
exports.getUserStats = async (req, res, next) => {
    try {
        const stats = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 },
                    approved: {
                        $sum: { $cond: [{ $eq: ['$isApproved', true] }, 1, 0] }
                    },
                    active: {
                        $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                    }
                }
            }
        ]);

        const branchStats = await User.aggregate([
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
                    count: { $sum: 1 },
                    approved: {
                        $sum: { $cond: [{ $eq: ['$isApproved', true] }, 1, 0] }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            roleStats: stats,
            branchStats
        });
    } catch (error) {
        next(error);
    }
};