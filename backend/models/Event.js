const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Event description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    type: {
        type: String,
        required: [true, 'Event type is required'],
        enum: ['blood_donation', 'training', 'emergency_response', 'awareness', 'fundraising', 'meeting', 'other']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    location: {
        type: String,
        required: [true, 'Event location is required'],
        trim: true
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    maxParticipants: {
        type: Number,
        min: [1, 'Maximum participants must be at least 1'],
        default: 50
    },
    registrationDeadline: {
        type: Date,
        required: true
    },
    requirements: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
        default: 'draft'
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        registeredAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['registered', 'confirmed', 'attended', 'absent'],
            default: 'registered'
        },
        notes: String
    }],
    images: [{
        url: String,
        caption: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    isPublic: {
        type: Boolean,
        default: true
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    feedback: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        submittedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Indexes for better query performance
eventSchema.index({ startDate: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ branch: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ isPublic: 1 });

// Virtual for participant count
eventSchema.virtual('participantCount').get(function () {
    return this.participants.length;
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function () {
    return this.maxParticipants - this.participants.length;
});

// Virtual for average rating
eventSchema.virtual('averageRating').get(function () {
    if (this.feedback.length === 0) return 0;
    const sum = this.feedback.reduce((acc, fb) => acc + fb.rating, 0);
    return (sum / this.feedback.length).toFixed(1);
});

// Ensure virtual fields are serialized
eventSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    }
});

// Validate end date is after start date
eventSchema.pre('save', function (next) {
    if (this.endDate <= this.startDate) {
        next(new Error('End date must be after start date'));
    }
    if (this.registrationDeadline >= this.startDate) {
        next(new Error('Registration deadline must be before event start date'));
    }
    next();
});

module.exports = mongoose.model('Event', eventSchema);