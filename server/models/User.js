const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    level: {
        type: Number,
        enum: [1, 2, 3],
        // Only set default for regular users, admins should have no level
        default: function() {
            return this.role === 'admin' ? undefined : 1;
        },
        // Level only applies to regular users, not admins
        validate: {
            validator: function(v) {
                // If user is admin, level should be undefined/null
                if (this.role === 'admin') return v === undefined || v === null;
                // For regular users, level must be 1, 2, or 3
                return [1, 2, 3].includes(v);
            },
            message: 'Admins should not have a level. Regular users must have level 1, 2, or 3'
        }
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    refreshToken: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model("user", UserSchema);