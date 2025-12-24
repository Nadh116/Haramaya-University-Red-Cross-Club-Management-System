const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    subject: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    inquiryType: {
        type: String,
        required: true,
        enum: ['general', 'volunteer', 'emergency', 'donation', 'training', 'partnership', 'complaint', 'suggestion'],
        default: 'general'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['new', 'in-progress', 'resolved', 'closed'],
        default: 'new'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },
    responseRequired: {
        type: Boolean,
        default: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],
    responses: [{
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        message: {
            type: String,
            required: true,
            maxlength: 2000
        },
        responseDate: {
            type: Date,
            default: Date.now
        },
        isInternal: {
            type: Boolean,
            default: false
        }
    }],
    metadata: {
        ipAddress: String,
        userAgent: String,
        referrer: String,
        source: {
            type: String,
            enum: ['website', 'mobile-app', 'phone', 'email', 'walk-in'],
            default: 'website'
        }
    },
    tags: [{
        type: String,
        trim: true
    }],
    followUpDate: Date,
    resolvedAt: Date,
    closedAt: Date
}, {
    timestamps: true
});

// Indexes for better query performance
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ inquiryType: 1, status: 1 });
contactSchema.index({ priority: 1, status: 1 });
contactSchema.index({ assignedTo: 1, status: 1 });
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });

// Virtual for response count
contactSchema.virtual('responseCount').get(function () {
    return this.responses.length;
});

// Virtual for days since creation
contactSchema.virtual('daysSinceCreated').get(function () {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to mark as read
contactSchema.methods.markAsRead = function (userId) {
    if (!this.readBy.find(read => read.user.toString() === userId.toString())) {
        this.readBy.push({ user: userId });
        this.isRead = true;
    }
    return this.save();
};

// Method to add response
contactSchema.methods.addResponse = function (respondedBy, message, isInternal = false) {
    this.responses.push({
        respondedBy,
        message,
        isInternal
    });

    if (!isInternal) {
        this.status = 'in-progress';
    }

    return this.save();
};

// Method to update status
contactSchema.methods.updateStatus = function (newStatus) {
    this.status = newStatus;

    if (newStatus === 'resolved') {
        this.resolvedAt = new Date();
    } else if (newStatus === 'closed') {
        this.closedAt = new Date();
    }

    return this.save();
};

// Static method to get contact statistics
contactSchema.statics.getStatistics = async function () {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                totalContacts: { $sum: 1 },
                newContacts: {
                    $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] }
                },
                inProgressContacts: {
                    $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
                },
                resolvedContacts: {
                    $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
                },
                urgentContacts: {
                    $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] }
                }
            }
        }
    ]);

    const inquiryTypeStats = await this.aggregate([
        {
            $group: {
                _id: '$inquiryType',
                count: { $sum: 1 }
            }
        }
    ]);

    const monthlyStats = await this.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                count: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
    ]);

    return {
        overall: stats[0] || {
            totalContacts: 0,
            newContacts: 0,
            inProgressContacts: 0,
            resolvedContacts: 0,
            urgentContacts: 0
        },
        byInquiryType: inquiryTypeStats,
        monthly: monthlyStats
    };
};

// Auto-set priority based on inquiry type
contactSchema.pre('save', function (next) {
    if (this.inquiryType === 'emergency') {
        this.priority = 'urgent';
    } else if (this.inquiryType === 'volunteer' || this.inquiryType === 'donation') {
        this.priority = 'high';
    }
    next();
});

module.exports = mongoose.model('Contact', contactSchema);