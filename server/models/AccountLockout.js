const mongoose = require('mongoose');

const AccountLockoutSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        index: true
    },
    attempts: {
        type: Number,
        default: 1
    },
    lastAttempt: {
        type: Date,
        default: Date.now
    },
    lockedUntil: {
        type: Date,
        default: null
    },
    deviceFingerprint: {
        type: String,
        default: null
    },
    userAgent: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 900 // TTL index: auto-delete after 15 minutes (900 seconds)
    }
});

// Create compound index for faster lookups
AccountLockoutSchema.index({ email: 1, deviceFingerprint: 1 });

module.exports = mongoose.model('AccountLockout', AccountLockoutSchema);
