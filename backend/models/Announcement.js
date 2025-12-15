const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Announcement title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    content: {
        type: String,
        required: [true, 'Announcement content is required'],
        trim: true,
        maxlength: [2000, 'Content cannot exceed 2000 characters']
    },
    type: {
        type: String,
        required: [true, 'Announcement type is required'],
        enum: ['general', 'urgent', 'event', 'donation', 'training', 'meeting', 'emergency']
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetAudience: {
        roles: [{
            type: String,
            enum: ['admin', 'officer', 'member', 'volunteer', 'visitor', 'all']
        }],
        branches: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Branch'
        }],
        specific: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    visibility: {
        type: String,
        enum: ['public', 'members_only', 'officers_only', 'admin_only'],
        default: 'public'
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived', 'deleted'],
        default: 'draft'
    },
    attachments: [{
        name: String,
        url: String,
        type: String,
        size: Number,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    images: [{
        url: String,
        caption: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    relatedEvent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    // Engagement tracking
    views: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        viewedAt: {
            type: Date,
            default: Date.now
        },
        ipAddress: String
    }],
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        likedAt: {
            type: Date,
            default: Date.now
        }
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: [500, 'Comment cannot exceed 500 characters']
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        isEdited: {
            type: Boolean,
            default: false
        },
        editedAt: Date
    }],
    // Notification settings
    sendNotification: {
        type: Boolean,
        default: true
    },
    notificationSent: {
        type: Boolean,
        default: false
    },
    notificationSentAt: Date,
    // Pin to top
    isPinned: {
        type: Boolean,
        default: false
    },
    pinnedUntil: Date,
    // Approval workflow
    requiresApproval: {
        type: Boolean,
        default: false
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: Date,
    rejectionReason: String
}, {
    timestamps: true
});

// Indexes for better query performance
announcementSchema.index({ publishDate: -1 });
announcementSchema.index({ type: 1 });
announcementSchema.index({ priority: 1 });
announcementSchema.index({ status: 1 });
announcementSchema.index({ visibility: 1 });
announcementSchema.index({ isPinned: 1 });
announcementSchema.index({ expiryDate: 1 });

// Virtual for view count
announcementSchema.virtual('viewCount').get(function () {
    return this.views.length;
});

// Virtual for like count
announcementSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

// Virtual for comment count
announcementSchema.virtual('commentCount').get(function () {
    return this.comments.length;
});

// Virtual to check if announcement is active
announcementSchema.virtual('isActive').get(function () {
    const now = new Date();
    return this.status === 'published' &&
        this.publishDate <= now &&
        (!this.expiryDate || this.expiryDate > now);
});

// Method to check if user can view announcement
announcementSchema.methods.canUserView = function (user) {
    if (this.visibility === 'public') return true;
    if (!user) return false;

    switch (this.visibility) {
        case 'members_only':
            return ['admin', 'officer', 'member', 'volunteer'].includes(user.role);
        case 'officers_only':
            return ['admin', 'officer'].includes(user.role);
        case 'admin_only':
            return user.role === 'admin';
        default:
            return false;
    }
};

// Method to add view
announcementSchema.methods.addView = function (userId, ipAddress) {
    // Check if user already viewed (to avoid duplicate views)
    const existingView = this.views.find(view =>
        view.user && view.user.toString() === userId.toString()
    );

    if (!existingView) {
        this.views.push({ user: userId, ipAddress });
        return this.save();
    }
    return Promise.resolve(this);
};

// Ensure virtual fields are serialized
announcementSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Announcement', announcementSchema);