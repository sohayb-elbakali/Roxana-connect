const mongoose = require("mongoose");

const InternshipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  
  // Core internship fields
  company: {
    type: String,
    required: true,
  },
  positionTitle: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  locationType: {
    type: String,
    enum: ["remote", "hybrid", "onsite"],
  },
  applicationDeadline: {
    type: Date,
    required: true,
  },
  
  // Details
  description: {
    type: String,
    required: true,
  },
  requirements: [
    {
      type: String,
    },
  ],
  applicationLink: {
    type: String,
  },
  salaryRange: {
    min: {
      type: Number,
    },
    max: {
      type: Number,
    },
    currency: {
      type: String,
      default: "USD",
    },
  },
  
  // Metadata
  tags: [
    {
      type: String,
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  
  // Social features
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      commentType: {
        type: String,
        enum: ["tip", "advice", "culture", "general"],
        default: "general",
      },
      likes: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          },
        },
      ],
      unlikes: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          },
        },
      ],
      reactions: {
        helpful: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          },
        ],
        thanks: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          },
        ],
        insightful: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          },
        ],
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  
  // Statistics
  trackingCount: {
    type: Number,
    default: 0,
  },
  
  date: {
    type: Date,
    default: Date.now,
  },
  edited: {
    type: Boolean,
    default: false,
  },
  editedAt: {
    type: Date,
  },
});

// Indexes for performance
InternshipSchema.index({ company: 1 });
InternshipSchema.index({ applicationDeadline: 1 });
InternshipSchema.index({ isActive: 1 });
InternshipSchema.index({ company: 1, isActive: 1 });
InternshipSchema.index({ applicationDeadline: 1, isActive: 1 });

module.exports = Internship = mongoose.model("internship", InternshipSchema);
