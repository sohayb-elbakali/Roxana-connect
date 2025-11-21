const mongoose = require('mongoose');

const LoginAttemptSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    index: true
  },
  attempts: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // TTL index: auto-delete after 10 minutes (600 seconds)
  }
});

// Create index for faster IP lookups
LoginAttemptSchema.index({ ip: 1 });

module.exports = mongoose.model('LoginAttempt', LoginAttemptSchema);
