const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    imageUrl: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String
    },
    category: {
        type: String,
        required: true,
        enum: ['blood-donation', 'training', 'community', 'events', 'emergency', 'general'],
        default: 'general'
    },
    tags: [{
        type: String,
        trim: true
    }],
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: false
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: false
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    viewCount: {
        type: Number,
        default: 0
    },
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
    metadata: {
        fileSize: Number,
        dimensions: {
            width: Number,
            height: Number
        },
        format: String,
        uploadDate: {
            type: Date,
            default: Date.now
        }
    },
    seoData: {
        altText: String,
        caption: String
    }
}, {
    timestamps: true
});

// Indexes for better query performance
gallerySchema.index({ category: 1, isPublished: 1 });
gallerySchema.index({ createdAt: -1 });
gallerySchema.index({ isFeatured: 1, isPublished: 1 });
gallerySchema.index({ uploadedBy: 1 });
gallerySchema.index({ eventId: 1 });

// Virtual for like count
gallerySchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

// Method to increment view count
gallerySchema.methods.incrementViewCount = function () {
    this.viewCount += 1;
    return this.save();
};

// Method to toggle like
gallerySchema.methods.toggleLike = function (userId) {
    const existingLike = this.likes.find(like => like.user.toString() === userId.toString());

    if (existingLike) {
        this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
    } else {
        this.likes.push({ user: userId });
    }

    return this.save();
};

// Static method to get gallery statistics
gallerySchema.statics.getStatistics = async function () {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                totalImages: { $sum: 1 },
                publishedImages: {
                    $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] }
                },
                totalViews: { $sum: '$viewCount' },
                totalLikes: { $sum: { $size: '$likes' } }
            }
        }
    ]);

    const categoryStats = await this.aggregate([
        { $match: { isPublished: true } },
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 },
                totalViews: { $sum: '$viewCount' }
            }
        }
    ]);

    return {
        overall: stats[0] || { totalImages: 0, publishedImages: 0, totalViews: 0, totalLikes: 0 },
        byCategory: categoryStats
    };
};

module.exports = mongoose.model('Gallery', gallerySchema);