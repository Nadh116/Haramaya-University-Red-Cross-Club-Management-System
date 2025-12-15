const express = require('express');
const User = require('../models/User');
const Event = require('../models/Event');
const Donation = require('../models/Donation');
const Announcement = require('../models/Announcement');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', async (req, res, next) => {
    try {
        const userRole = req.user.role;
        let stats = {};

        // Common stats for all users
        const totalMembers = await User.countDocuments({
            role: { $in: ['member', 'volunteer'] },
            isActive: true,
            isApproved: true
        });

        const upcomingEvents = await Event.countDocuments({
            status: 'published',
            startDate: { $gte: new Date() }
        });

        const recentAnnouncements = await Announcement.countDocuments({
            status: 'published',
            publishDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
        });

        stats.common = {
            totalMembers,
            upcomingEvents,
            recentAnnouncements
        };

        // Role-specific stats
        if (['admin', 'officer'].includes(userRole)) {
            // Admin/Officer dashboard stats
            const pendingApprovals = await User.countDocuments({
                role: { $in: ['member', 'volunteer'] },
                isActive: true,
                isApproved: false
            });

            const totalDonations = await Donation.countDocuments({
                status: 'verified'
            });

            const bloodDonations = await Donation.aggregate([
                { $match: { type: 'blood', status: 'verified' } },
                { $group: { _id: null, totalUnits: { $sum: '$bloodUnits' } } }
            ]);

            const monthlyEvents = await Event.aggregate([
                {
                    $match: {
                        startDate: {
                            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                        }
                    }
                },
                {
                    $group: {
                        _id: '$type',
                        count: { $sum: 1 }
                    }
                }
            ]);

            stats.admin = {
                pendingApprovals,
                totalDonations,
                totalBloodUnits: bloodDonations[0]?.totalUnits || 0,
                monthlyEvents
            };
        }

        if (['member', 'volunteer'].includes(userRole)) {
            // Member/Volunteer dashboard stats
            const myEvents = await Event.countDocuments({
                'participants.user': req.user.id
            });

            const myDonations = await Donation.countDocuments({
                donor: req.user.id
            });

            const nextEvent = await Event.findOne({
                'participants.user': req.user.id,
                startDate: { $gte: new Date() }
            })
                .populate('branch', 'name')
                .sort({ startDate: 1 });

            stats.member = {
                myEvents,
                myDonations,
                nextEvent
            };
        }

        res.status(200).json({
            success: true,
            stats
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private
router.get('/activities', async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 10;
        const userRole = req.user.role;

        let activities = [];

        if (['admin', 'officer'].includes(userRole)) {
            // Recent registrations
            const recentUsers = await User.find({
                role: { $in: ['member', 'volunteer'] },
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            })
                .populate('branch', 'name')
                .sort({ createdAt: -1 })
                .limit(5);

            recentUsers.forEach(user => {
                activities.push({
                    type: 'user_registration',
                    message: `${user.fullName} registered as ${user.role}`,
                    timestamp: user.createdAt,
                    data: { user: user.fullName, role: user.role, branch: user.branch.name }
                });
            });

            // Recent donations
            const recentDonations = await Donation.find({
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            })
                .populate('donor', 'firstName lastName')
                .sort({ createdAt: -1 })
                .limit(5);

            recentDonations.forEach(donation => {
                activities.push({
                    type: 'donation',
                    message: `${donation.donor.firstName} ${donation.donor.lastName} made a ${donation.type} donation`,
                    timestamp: donation.createdAt,
                    data: { type: donation.type, status: donation.status }
                });
            });
        }

        // Recent events (for all users)
        const recentEvents = await Event.find({
            status: 'published',
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        })
            .populate('organizer', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(5);

        recentEvents.forEach(event => {
            activities.push({
                type: 'event_created',
                message: `New ${event.type.replace('_', ' ')} event: ${event.title}`,
                timestamp: event.createdAt,
                data: { title: event.title, type: event.type, startDate: event.startDate }
            });
        });

        // Recent announcements
        const recentAnnouncements = await Announcement.find({
            status: 'published',
            publishDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        })
            .populate('author', 'firstName lastName')
            .sort({ publishDate: -1 })
            .limit(5);

        recentAnnouncements.forEach(announcement => {
            activities.push({
                type: 'announcement',
                message: `New ${announcement.type} announcement: ${announcement.title}`,
                timestamp: announcement.publishDate,
                data: { title: announcement.title, type: announcement.type, priority: announcement.priority }
            });
        });

        // Sort all activities by timestamp and limit
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        activities = activities.slice(0, limit);

        res.status(200).json({
            success: true,
            count: activities.length,
            activities
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get user's personal dashboard
// @route   GET /api/dashboard/personal
// @access  Private
router.get('/personal', async (req, res, next) => {
    try {
        const userId = req.user.id;

        // User's registered events
        const myEvents = await Event.find({
            'participants.user': userId
        })
            .populate('branch', 'name')
            .sort({ startDate: -1 })
            .limit(5);

        // User's donations
        const myDonations = await Donation.find({
            donor: userId
        })
            .populate('branch', 'name')
            .sort({ donationDate: -1 })
            .limit(5);

        // Upcoming events user can join
        const availableEvents = await Event.find({
            status: 'published',
            startDate: { $gte: new Date() },
            'participants.user': { $ne: userId }
        })
            .populate('branch', 'name')
            .populate('organizer', 'firstName lastName')
            .sort({ startDate: 1 })
            .limit(5);

        // Recent announcements relevant to user
        const relevantAnnouncements = await Announcement.find({
            status: 'published',
            $or: [
                { visibility: 'public' },
                {
                    visibility: 'members_only',
                    $and: [{ targetAudience: { $exists: true } }]
                }
            ]
        })
            .populate('author', 'firstName lastName')
            .sort({ publishDate: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            dashboard: {
                myEvents,
                myDonations,
                availableEvents,
                relevantAnnouncements
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;