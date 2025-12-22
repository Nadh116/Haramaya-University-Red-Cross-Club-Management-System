const Announcement = require('../models/Announcement');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
exports.getAnnouncements = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        // Build query
        let query = { status: 'published' };

        // Filter by type
        if (req.query.type) {
            query.type = req.query.type;
        }

        // Filter by priority
        if (req.query.priority) {
            query.priority = req.query.priority;
        }

        // Filter by visibility based on user role
        if (req.user) {
            const userRole = req.user.role;
            if (userRole === 'admin') {
                // Admin can see all announcements
                if (req.query.visibility) {
                    query.visibility = req.query.visibility;
                }
            } else if (userRole === 'officer') {
                query.visibility = { $in: ['public', 'members_only', 'officers_only'] };
            } else if (['member', 'volunteer'].includes(userRole)) {
                query.visibility = { $in: ['public', 'members_only'] };
            } else {
                query.visibility = 'public';
            }
        } else {
            query.visibility = 'public';
        }

        // Filter by active announcements (not expired)
        const now = new Date();
        query.$or = [
            { expiryDate: { $exists: false } },
            { expiryDate: null },
            { expiryDate: { $gt: now } }
        ];

        // Search by title or content
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            query.$and = query.$and || [];
            query.$and.push({
                $or: [
                    { title: searchRegex },
                    { content: searchRegex },
                    { tags: { $in: [searchRegex] } }
                ]
            });
        }

        const total = await Announcement.countDocuments(query);
        const announcements = await Announcement.find(query)
            .populate('author', 'firstName lastName role')
            .populate('relatedEvent', 'title type startDate')
            .sort({ isPinned: -1, publishDate: -1 })
            .limit(limit)
            .skip(startIndex);

        // Filter out announcements with deleted authors or add default author info
        const validAnnouncements = announcements.map(announcement => {
            if (!announcement.author) {
                // Create a default author object for announcements with deleted authors
                announcement.author = {
                    firstName: 'Unknown',
                    lastName: 'Author',
                    role: 'unknown'
                };
            }
            return announcement;
        });

        // Add view for authenticated users
        if (req.user) {
            for (let announcement of validAnnouncements) {
                await announcement.addView(req.user.id, req.ip);
            }
        }

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
            count: validAnnouncements.length,
            total,
            pagination,
            announcements: validAnnouncements
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Public
exports.getAnnouncement = async (req, res, next) => {
    try {
        const announcement = await Announcement.findById(req.params.id)
            .populate('author', 'firstName lastName role email')
            .populate('relatedEvent', 'title type startDate location')
            .populate('comments.user', 'firstName lastName')
            .populate('likes.user', 'firstName lastName');

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        // Handle missing author (deleted user)
        if (!announcement.author) {
            announcement.author = {
                firstName: 'Unknown',
                lastName: 'Author',
                role: 'unknown',
                email: 'unknown@example.com'
            };
        }

        // Handle missing users in comments
        if (announcement.comments) {
            announcement.comments = announcement.comments.map(comment => {
                if (!comment.user) {
                    comment.user = {
                        firstName: 'Unknown',
                        lastName: 'User'
                    };
                }
                return comment;
            });
        }

        // Handle missing users in likes
        if (announcement.likes) {
            announcement.likes = announcement.likes.filter(like => like.user);
        }

        // Check if user can view this announcement
        if (!announcement.canUserView(req.user)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this announcement'
            });
        }

        // Add view for authenticated users
        if (req.user) {
            await announcement.addView(req.user.id, req.ip);
        }

        res.status(200).json({
            success: true,
            announcement
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new announcement
// @route   POST /api/announcements
// @access  Private/Admin/Officer
exports.createAnnouncement = async (req, res, next) => {
    try {
        // Add author to req.body
        req.body.author = req.user.id;

        const announcement = await Announcement.create(req.body);
        await announcement.populate('author', 'firstName lastName role');

        res.status(201).json({
            success: true,
            announcement
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin/Officer
exports.updateAnnouncement = async (req, res, next) => {
    try {
        let announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        // Make sure user is announcement author or admin
        if (announcement.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this announcement'
            });
        }

        announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('author', 'firstName lastName role');

        res.status(200).json({
            success: true,
            announcement
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin/Officer
exports.deleteAnnouncement = async (req, res, next) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        // Make sure user is announcement author or admin
        if (announcement.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this announcement'
            });
        }

        await announcement.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Announcement deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Like/Unlike announcement
// @route   POST /api/announcements/:id/like
// @access  Private
exports.toggleLike = async (req, res, next) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        // Check if user already liked
        const likeIndex = announcement.likes.findIndex(
            like => like.user.toString() === req.user.id
        );

        if (likeIndex > -1) {
            // Unlike
            announcement.likes.splice(likeIndex, 1);
        } else {
            // Like
            announcement.likes.push({ user: req.user.id });
        }

        await announcement.save();

        res.status(200).json({
            success: true,
            liked: likeIndex === -1,
            likeCount: announcement.likes.length
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add comment to announcement
// @route   POST /api/announcements/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
    try {
        const { content } = req.body;
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        // Check if user can view this announcement
        if (!announcement.canUserView(req.user)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to comment on this announcement'
            });
        }

        announcement.comments.push({
            user: req.user.id,
            content
        });

        await announcement.save();
        await announcement.populate('comments.user', 'firstName lastName');

        res.status(200).json({
            success: true,
            message: 'Comment added successfully',
            comments: announcement.comments
        });
    } catch (error) {
        next(error);
    }
};