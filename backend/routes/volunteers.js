const express = require('express');
const User = require('../models/User');
const Event = require('../models/Event');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @desc    Get all volunteers
// @route   GET /api/volunteers
// @access  Private/Admin/Officer
router.get('/', authorize('admin', 'officer'), async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        // Build query for volunteers only
        let query = {
            role: 'volunteer',
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
        const volunteers = await User.find(query)
            .populate('branch', 'name code')
            .populate('approvedBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(startIndex);

        // Get volunteer participation stats
        const volunteersWithStats = await Promise.all(
            volunteers.map(async (volunteer) => {
                const eventCount = await Event.countDocuments({
                    'participants.user': volunteer._id,
                    'participants.status': 'attended'
                });

                return {
                    ...volunteer.toJSON(),
                    eventsAttended: eventCount
                };
            })
        );

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
            count: volunteers.length,
            total,
            pagination,
            volunteers: volunteersWithStats
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get volunteer statistics
// @route   GET /api/volunteers/stats
// @access  Private/Admin/Officer
router.get('/stats', authorize('admin', 'officer'), async (req, res, next) => {
    try {
        const totalVolunteers = await User.countDocuments({
            role: 'volunteer',
            isActive: true
        });

        const approvedVolunteers = await User.countDocuments({
            role: 'volunteer',
            isActive: true,
            isApproved: true
        });

        const branchStats = await User.aggregate([
            {
                $match: {
                    role: 'volunteer',
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
                    count: { $sum: 1 },
                    approved: {
                        $sum: { $cond: [{ $eq: ['$isApproved', true] }, 1, 0] }
                    }
                }
            }
        ]);

        // Get most active volunteers
        const activeVolunteers = await Event.aggregate([
            { $unwind: '$participants' },
            {
                $match: {
                    'participants.status': 'attended'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'participants.user',
                    foreignField: '_id',
                    as: 'volunteer'
                }
            },
            { $unwind: '$volunteer' },
            {
                $match: {
                    'volunteer.role': 'volunteer',
                    'volunteer.isActive': true
                }
            },
            {
                $group: {
                    _id: '$volunteer._id',
                    name: { $first: { $concat: ['$volunteer.firstName', ' ', '$volunteer.lastName'] } },
                    email: { $first: '$volunteer.email' },
                    eventsAttended: { $sum: 1 }
                }
            },
            { $sort: { eventsAttended: -1 } },
            { $limit: 10 }
        ]);

        res.status(200).json({
            success: true,
            totalVolunteers,
            approvedVolunteers,
            pendingApproval: totalVolunteers - approvedVolunteers,
            branchStats,
            activeVolunteers
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get volunteer's event history
// @route   GET /api/volunteers/:id/events
// @access  Private/Admin/Officer
router.get('/:id/events', authorize('admin', 'officer'), async (req, res, next) => {
    try {
        const volunteer = await User.findById(req.params.id);

        if (!volunteer || volunteer.role !== 'volunteer') {
            return res.status(404).json({
                success: false,
                message: 'Volunteer not found'
            });
        }

        const events = await Event.find({
            'participants.user': volunteer._id
        })
            .populate('branch', 'name code')
            .populate('organizer', 'firstName lastName')
            .sort({ startDate: -1 });

        // Add participation status to each event
        const eventsWithStatus = events.map(event => {
            const participation = event.participants.find(
                p => p.user.toString() === volunteer._id.toString()
            );

            return {
                ...event.toJSON(),
                participationStatus: participation ? participation.status : 'not_registered',
                registeredAt: participation ? participation.registeredAt : null,
                notes: participation ? participation.notes : null
            };
        });

        res.status(200).json({
            success: true,
            volunteer: {
                id: volunteer._id,
                name: volunteer.fullName,
                email: volunteer.email
            },
            events: eventsWithStatus
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;