const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
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

        // Filter by branch
        if (req.query.branch) {
            query.branch = req.query.branch;
        }

        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        } else {
            // Default to published events for public access
            if (!req.user || !['admin', 'officer'].includes(req.user.role)) {
                query.status = 'published';
                query.isPublic = true;
            }
        }

        // Filter by date range
        if (req.query.startDate || req.query.endDate) {
            query.startDate = {};
            if (req.query.startDate) {
                query.startDate.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                query.startDate.$lte = new Date(req.query.endDate);
            }
        }

        // Search by title or description
        if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            query.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { location: searchRegex }
            ];
        }

        const total = await Event.countDocuments(query);
        const events = await Event.find(query)
            .populate('branch', 'name code')
            .populate('organizer', 'firstName lastName email')
            .populate('participants.user', 'firstName lastName email')
            .sort({ startDate: 1 })
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
            count: events.length,
            total,
            pagination,
            events
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('branch', 'name code location')
            .populate('organizer', 'firstName lastName email phone')
            .populate('participants.user', 'firstName lastName email phone bloodType')
            .populate('feedback.user', 'firstName lastName');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if user can view this event
        if (!event.isPublic && (!req.user || !['admin', 'officer'].includes(req.user.role))) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this event'
            });
        }

        res.status(200).json({
            success: true,
            event
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Admin/Officer
exports.createEvent = async (req, res, next) => {
    try {
        // Add organizer to req.body
        req.body.organizer = req.user.id;

        // Set branch if not provided (use user's branch)
        if (!req.body.branch) {
            req.body.branch = req.user.branch;
        }

        const event = await Event.create(req.body);
        await event.populate([
            { path: 'branch', select: 'name code' },
            { path: 'organizer', select: 'firstName lastName email' }
        ]);

        res.status(201).json({
            success: true,
            event
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin/Officer
exports.updateEvent = async (req, res, next) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Make sure user is event organizer or admin
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this event'
            });
        }

        event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate([
            { path: 'branch', select: 'name code' },
            { path: 'organizer', select: 'firstName lastName email' }
        ]);

        res.status(200).json({
            success: true,
            event
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin/Officer
exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Make sure user is event organizer or admin
        if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this event'
            });
        }

        await event.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
exports.registerForEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if event is published and registration is open
        if (event.status !== 'published') {
            return res.status(400).json({
                success: false,
                message: 'Event registration is not open'
            });
        }

        // Check registration deadline
        if (new Date() > event.registrationDeadline) {
            return res.status(400).json({
                success: false,
                message: 'Registration deadline has passed'
            });
        }

        // Check if event is full
        if (event.participants.length >= event.maxParticipants) {
            return res.status(400).json({
                success: false,
                message: 'Event is full'
            });
        }

        // Check if user is already registered
        const isRegistered = event.participants.some(
            participant => participant.user.toString() === req.user.id
        );

        if (isRegistered) {
            return res.status(400).json({
                success: false,
                message: 'You are already registered for this event'
            });
        }

        // Add user to participants
        event.participants.push({
            user: req.user.id,
            notes: req.body.notes || ''
        });

        await event.save();
        await event.populate('participants.user', 'firstName lastName email');

        res.status(200).json({
            success: true,
            message: 'Successfully registered for event',
            event
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Unregister from event
// @route   DELETE /api/events/:id/register
// @access  Private
exports.unregisterFromEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if user is registered
        const participantIndex = event.participants.findIndex(
            participant => participant.user.toString() === req.user.id
        );

        if (participantIndex === -1) {
            return res.status(400).json({
                success: false,
                message: 'You are not registered for this event'
            });
        }

        // Remove user from participants
        event.participants.splice(participantIndex, 1);
        await event.save();

        res.status(200).json({
            success: true,
            message: 'Successfully unregistered from event'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add feedback to event
// @route   POST /api/events/:id/feedback
// @access  Private
exports.addEventFeedback = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if event is completed
        if (event.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Can only provide feedback for completed events'
            });
        }

        // Check if user participated in the event
        const participated = event.participants.some(
            participant => participant.user.toString() === req.user.id &&
                participant.status === 'attended'
        );

        if (!participated) {
            return res.status(400).json({
                success: false,
                message: 'Only participants who attended can provide feedback'
            });
        }

        // Check if user already provided feedback
        const existingFeedback = event.feedback.find(
            fb => fb.user.toString() === req.user.id
        );

        if (existingFeedback) {
            return res.status(400).json({
                success: false,
                message: 'You have already provided feedback for this event'
            });
        }

        // Add feedback
        event.feedback.push({
            user: req.user.id,
            rating,
            comment
        });

        await event.save();
        await event.populate('feedback.user', 'firstName lastName');

        res.status(200).json({
            success: true,
            message: 'Feedback added successfully',
            event
        });
    } catch (error) {
        next(error);
    }
};