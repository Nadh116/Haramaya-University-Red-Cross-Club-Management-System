const Donation = require('../models/Donation');
const User = require('../models/User');

// @desc    Get all donations
// @route   GET /api/donations
// @access  Private/Admin/Officer
exports.getDonations = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        // Build query
        let query = {};

        // Filter by type
        if (req.query.type) {
            query.type = req.query.type;
        }

        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Filter by branch
        if (req.query.branch) {
            query.branch = req.query.branch;
        }

        // Filter by donor (for personal donations)
        if (req.query.donor) {
            query.donor = req.query.donor;
        }

        // Filter by date range
        if (req.query.startDate || req.query.endDate) {
            query.donationDate = {};
            if (req.query.startDate) {
                query.donationDate.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                query.donationDate.$lte = new Date(req.query.endDate);
            }
        }

        // If user is not admin/officer, only show their own donations
        if (!['admin', 'officer'].includes(req.user.role)) {
            query.donor = req.user.id;
        }

        const total = await Donation.countDocuments(query);
        const donations = await Donation.find(query)
            .populate('donor', 'firstName lastName email studentId')
            .populate('branch', 'name code')
            .populate('event', 'title type')
            .populate('recordedBy', 'firstName lastName')
            .populate('verifiedBy', 'firstName lastName')
            .sort({ donationDate: -1 })
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
            count: donations.length,
            total,
            pagination,
            donations
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single donation
// @route   GET /api/donations/:id
// @access  Private
exports.getDonation = async (req, res, next) => {
    try {
        const donation = await Donation.findById(req.params.id)
            .populate('donor', 'firstName lastName email phone studentId')
            .populate('branch', 'name code location')
            .populate('event', 'title type startDate')
            .populate('recordedBy', 'firstName lastName email')
            .populate('verifiedBy', 'firstName lastName email');

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
        }

        // Check if user can view this donation
        if (!['admin', 'officer'].includes(req.user.role) &&
            donation.donor._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this donation'
            });
        }

        res.status(200).json({
            success: true,
            donation
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new donation
// @route   POST /api/donations
// @access  Private/Admin/Officer
exports.createDonation = async (req, res, next) => {
    try {
        // Add recordedBy to req.body
        req.body.recordedBy = req.user.id;

        // Set branch if not provided (use user's branch)
        if (!req.body.branch) {
            req.body.branch = req.user.branch;
        }

        // If donor is not specified, use current user
        if (!req.body.donor) {
            req.body.donor = req.user.id;
        }

        const donation = await Donation.create(req.body);
        await donation.populate([
            { path: 'donor', select: 'firstName lastName email' },
            { path: 'branch', select: 'name code' },
            { path: 'recordedBy', select: 'firstName lastName' }
        ]);

        res.status(201).json({
            success: true,
            donation
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update donation
// @route   PUT /api/donations/:id
// @access  Private/Admin/Officer
exports.updateDonation = async (req, res, next) => {
    try {
        let donation = await Donation.findById(req.params.id);

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
        }

        // Make sure user is authorized to update
        if (!['admin', 'officer'].includes(req.user.role) &&
            donation.recordedBy.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this donation'
            });
        }

        donation = await Donation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate([
            { path: 'donor', select: 'firstName lastName email' },
            { path: 'branch', select: 'name code' },
            { path: 'recordedBy', select: 'firstName lastName' }
        ]);

        res.status(200).json({
            success: true,
            donation
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete donation
// @route   DELETE /api/donations/:id
// @access  Private/Admin
exports.deleteDonation = async (req, res, next) => {
    try {
        const donation = await Donation.findById(req.params.id);

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
        }

        await donation.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Donation deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify donation
// @route   PUT /api/donations/:id/verify
// @access  Private/Admin/Officer
exports.verifyDonation = async (req, res, next) => {
    try {
        const donation = await Donation.findById(req.params.id);

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: 'Donation not found'
            });
        }

        if (donation.status === 'verified') {
            return res.status(400).json({
                success: false,
                message: 'Donation is already verified'
            });
        }

        donation.status = 'verified';
        donation.verifiedBy = req.user.id;
        donation.verifiedAt = new Date();
        await donation.save();

        await donation.populate([
            { path: 'donor', select: 'firstName lastName email' },
            { path: 'verifiedBy', select: 'firstName lastName' }
        ]);

        res.status(200).json({
            success: true,
            message: 'Donation verified successfully',
            donation
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get donation statistics
// @route   GET /api/donations/stats
// @access  Private/Admin/Officer
exports.getDonationStats = async (req, res, next) => {
    try {
        const stats = await Donation.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                    totalValue: { $sum: '$amount' },
                    verified: {
                        $sum: { $cond: [{ $eq: ['$status', 'verified'] }, 1, 0] }
                    }
                }
            }
        ]);

        const bloodStats = await Donation.aggregate([
            { $match: { type: 'blood', status: 'verified' } },
            {
                $group: {
                    _id: '$bloodType',
                    units: { $sum: '$bloodUnits' },
                    donors: { $sum: 1 }
                }
            }
        ]);

        const monthlyStats = await Donation.aggregate([
            {
                $match: {
                    donationDate: {
                        $gte: new Date(new Date().getFullYear(), 0, 1)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$donationDate' },
                        type: '$type'
                    },
                    count: { $sum: 1 },
                    totalValue: { $sum: '$amount' }
                }
            },
            {
                $sort: { '_id.month': 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            typeStats: stats,
            bloodStats,
            monthlyStats
        });
    } catch (error) {
        next(error);
    }
};