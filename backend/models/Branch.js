const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Branch name is required'],
        unique: true,
        trim: true,
        enum: ['Main Campus', 'Technology Campus', 'Veterinary Campus']
    },
    code: {
        type: String,
        required: [true, 'Branch code is required'],
        unique: true,
        uppercase: true,
        enum: ['MAIN', 'TECH', 'VET']
    },
    location: {
        type: String,
        required: [true, 'Branch location is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    contactPerson: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        },
        phone: {
            type: String,
            required: true
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    establishedDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for better query performance
branchSchema.index({ code: 1 });
branchSchema.index({ isActive: 1 });

module.exports = mongoose.model('Branch', branchSchema);