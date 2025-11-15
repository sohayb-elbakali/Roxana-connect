const mongoose = require("mongoose");

const ApplicationTrackingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "internship",
    required: true,
  },
  
  status: {
    type: String,
    enum: [
      "not_applied",
      "applied",
      "interviewing",
      "offer_received",
      "rejected",
      "accepted",
      "declined",
    ],
    required: true,
    default: "not_applied",
  },
  
  applicationDate: {
    type: Date,
  },
  
  statusHistory: [
    {
      status: {
        type: String,
        enum: [
          "not_applied",
          "applied",
          "interviewing",
          "offer_received",
          "rejected",
          "accepted",
          "declined",
        ],
      },
      date: {
        type: Date,
        default: Date.now,
      },
      notes: {
        type: String,
      },
    },
  ],
  
  privateNotes: {
    type: String,
  },
  
  reminders: [
    {
      date: {
        type: Date,
      },
      message: {
        type: String,
      },
      sent: {
        type: Boolean,
        default: false,
      },
    },
  ],
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for performance
ApplicationTrackingSchema.index({ user: 1 });
ApplicationTrackingSchema.index({ internship: 1 });
ApplicationTrackingSchema.index({ user: 1, internship: 1 }, { unique: true });

// Update the updatedAt timestamp before saving
ApplicationTrackingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = ApplicationTracking = mongoose.model(
  "applicationtracking",
  ApplicationTrackingSchema
);
