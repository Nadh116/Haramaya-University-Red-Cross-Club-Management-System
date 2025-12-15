const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: [true, 'Donation type is required'],
        enum: ['blood', 'money', 'supplies', 'other']
    },
    // Blood donation specific fields
    bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: function () {
            return this.type === 'blood';
        }
    },
    bloodUnits: {
        type: Number,
        min: [1, 'Blood units must be at least 1'],
        required: function () {
            return this.type === 'blood';
        }
    },
    // Money donation specific fields
    amount: {
        type: Number,
        min: [0, 'Amount cannot be negative'],
        required: function () {
            return this.type === 'money';
        }
    },
    currency: {
        type: String,
        default: 'ETB',
        required: function () {
            return this.type === 'money';
        }
    },
    // Supply donation specific fields
    items: [{
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        unit: {
            type: String,
            required: true
        },
        estimatedValue: {
            type: Number,
            min: 0
        }
    }],
    // General fields
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    donationDate: {
        type: Date,
        required: [true, 'Donation date is required'],
        default: Date.now
    },
    location: {
        type: String,
        required: [true, 'Donation location is required'],
        trim: true
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'verified', 'processed', 'rejected'],
        default: 'pending'
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    verifiedAt: {
        type: Date
    },
    // Medical information for blood donations
    medicalInfo: {
        hemoglobin: {
            type: Number,
            min: 0,
            max: 20
        },
        bloodPressure: {
            systolic: Number,
            diastolic: Number
        },
        weight: {
            type: Number,
            min: 0
        },
        temperature: {
            type: Number,
            min: 35,
            max: 42
        },
        medicallyEligible: {
            type: Boolean,
            default: true
        },
        notes: String
    },
    // Receipt and documentation
    receiptNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    documents: [{
        name: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Follow-up information
    followUp: {
        required: {
            type: Boolean,
            default: false
        },
        date: Date,
        notes: String,
        completed: {
            type: Boolean,
            default: false
        }
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    isAnonymous: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for better query performance
donationSchema.index({ donor: 1 });
donationSchema.index({ type: 1 });
donationSchema.index({ donationDate: -1 });
donationSchema.index({ branch: 1 });
donationSchema.index({ status: 1 });
donationSchema.index({ bloodType: 1 });

// Virtual for total value (for supply donations)
donationSchema.virtual('totalValue').get(function () {
    if (this.type === 'money') {
        return this.amount;
    }
    if (this.type === 'supplies' && this.items) {
        return this.items.reduce((total, item) => total + (item.estimatedValue || 0), 0);
    }
    return 0;
});

// Generate receipt number before saving
donationSchema.pre('save', async function (next) {
    if (!this.receiptNumber && this.status === 'verified') {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const count = await this.constructor.countDocuments({
            createdAt: {
                $gte: new Date(year, new Date().getMonth(), 1),
                $lt: new Date(year, new Date().getMonth() + 1, 1)
            }
        });
        this.receiptNumber = `HRC-${year}${month}-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

// Ensure virtual fields are serialized
donationSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Donation', donationSchema);