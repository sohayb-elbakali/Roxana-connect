const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const { check, validationResult } = require("express-validator");
const ApplicationTracking = require("../models/ApplicationTracking");
const Internship = require("../models/Internship");

/*
Tracking CRUD Endpoints:
1. POST /api/tracking - Track an internship
2. GET /api/tracking - Get user's tracked internships
3. PUT /api/tracking/:id - Update tracking status
4. DELETE /api/tracking/:id - Stop tracking
5. PUT /api/tracking/:id/notes - Update private notes
6. GET /api/tracking/stats - Get user statistics
*/

// @route   POST /api/tracking
// @desc    Track an internship
// @access  Private
router.post(
  "/",
  auth,
  [
    check("internship", "Internship ID is required").notEmpty(),
    check("status", "Status is required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { internship, status, applicationDate, privateNotes } = req.body;

      // Validate status value
      const validStatuses = [
        "not_applied",
        "applied",
        "interviewing",
        "offer_received",
        "rejected",
        "accepted",
        "declined",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          errors: [{ msg: "Invalid status value" }] 
        });
      }

      // Check if internship exists
      const internshipDoc = await Internship.findById(internship);
      if (!internshipDoc) {
        return res.status(404).json({ msg: "Internship not found" });
      }

      // Check if user is already tracking this internship
      const existingTracking = await ApplicationTracking.findOne({
        user: req.user.id,
        internship: internship,
      });

      if (existingTracking) {
        return res.status(400).json({ 
          errors: [{ msg: "You are already tracking this internship" }] 
        });
      }

      // Validate applicationDate if status is "applied"
      if (status === "applied" && !applicationDate) {
        return res.status(400).json({ 
          errors: [{ msg: "Application date is required when status is 'applied'" }] 
        });
      }

      // Create new tracking record
      const newTracking = new ApplicationTracking({
        user: req.user.id,
        internship: internship,
        status: status,
        applicationDate: applicationDate,
        privateNotes: privateNotes,
        statusHistory: [
          {
            status: status,
            date: Date.now(),
            notes: `Initial tracking with status: ${status}`,
          },
        ],
      });

      const tracking = await newTracking.save();

      // Increment tracking count on internship
      await Internship.findByIdAndUpdate(
        internship,
        { $inc: { trackingCount: 1 } }
      );

      res.json(tracking);
    } catch (err) {
      console.error(err.message);
      
      // Check if error is due to invalid ObjectId format
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Internship not found" });
      }
      
      res.status(500).send("Server Error: " + err.message);
    }
  }
);

// @route   GET /api/tracking
// @desc    Get user's tracked internships
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const trackings = await ApplicationTracking.find({ user: req.user.id })
      .select("-__v")
      .populate("internship", "company positionTitle location applicationDeadline isActive tags")
      .sort({ updatedAt: -1 });

    res.json(trackings);
  } catch (err) {
    res.status(500).send("Server error fetching trackings");
  }
});

// @route   PUT /api/tracking/:id
// @desc    Update tracking status
// @access  Private
router.put(
  "/:id",
  auth,
  [
    check("status", "Status is required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { status, applicationDate, notes } = req.body;

      // Validate status value
      const validStatuses = [
        "not_applied",
        "applied",
        "interviewing",
        "offer_received",
        "rejected",
        "accepted",
        "declined",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          errors: [{ msg: "Invalid status value" }] 
        });
      }

      // Find tracking record
      const tracking = await ApplicationTracking.findById(req.params.id);

      if (!tracking) {
        return res.status(404).json({ msg: "Tracking record not found" });
      }

      // Check authorization - only owner can update
      if (tracking.user.toString() !== req.user.id) {
        return res.status(403).json({ 
          msg: "User is not authorized to update this tracking record" 
        });
      }

      // Validate applicationDate if status is "applied"
      if (status === "applied" && !applicationDate && !tracking.applicationDate) {
        return res.status(400).json({ 
          errors: [{ msg: "Application date is required when status is 'applied'" }] 
        });
      }

      // Update status and add to history
      tracking.status = status;
      if (applicationDate) {
        tracking.applicationDate = applicationDate;
      }
      
      tracking.statusHistory.push({
        status: status,
        date: Date.now(),
        notes: notes || `Status updated to: ${status}`,
      });

      tracking.updatedAt = Date.now();

      await tracking.save();

      // Populate internship data before returning
      await tracking.populate("internship");

      res.json(tracking);
    } catch (err) {
      // Check if error is due to invalid ObjectId format
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Tracking record not found" });
      }
      
      res.status(500).send("Server error updating tracking");
    }
  }
);

// @route   DELETE /api/tracking/:id
// @desc    Stop tracking an internship
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const tracking = await ApplicationTracking.findById(req.params.id);

    if (!tracking) {
      return res.status(404).json({ msg: "Tracking record not found" });
    }

    // Check authorization - only owner can delete
    if (tracking.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        msg: "User is not authorized to delete this tracking record" 
      });
    }

    // Decrement tracking count on internship
    await Internship.findByIdAndUpdate(
      tracking.internship,
      { $inc: { trackingCount: -1 } }
    );

    await ApplicationTracking.findByIdAndDelete(req.params.id);

    res.json({ msg: "Tracking record removed" });
  } catch (err) {
    // Check if error is due to invalid ObjectId format
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Tracking record not found" });
    }
    
    res.status(500).send("Server error deleting tracking");
  }
});

// @route   PUT /api/tracking/:id/notes
// @desc    Update private notes for a tracking record
// @access  Private
router.put("/:id/notes", auth, async (req, res) => {
  try {
    const { privateNotes } = req.body;

    // Find tracking record
    const tracking = await ApplicationTracking.findById(req.params.id);

    if (!tracking) {
      return res.status(404).json({ msg: "Tracking record not found" });
    }

    // Check authorization - only owner can update
    if (tracking.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        msg: "User is not authorized to update this tracking record" 
      });
    }

    // Update private notes
    tracking.privateNotes = privateNotes;
    tracking.updatedAt = Date.now();

    await tracking.save();

    // Populate internship data before returning
    await tracking.populate("internship");

    res.json(tracking);
  } catch (err) {
    // Check if error is due to invalid ObjectId format
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Tracking record not found" });
    }
    
    res.status(500).send("Server error updating notes");
  }
});

// @route   GET /api/tracking/stats
// @desc    Get user's application statistics
// @access  Private
router.get("/stats", auth, async (req, res) => {
  try {
    // Get all tracking records for the user
    const trackings = await ApplicationTracking.find({ user: req.user.id });

    // Calculate statistics
    const stats = {
      total: trackings.length,
      applied: 0,
      interviewing: 0,
      offers: 0,
      rejected: 0,
      not_applied: 0,
      accepted: 0,
      declined: 0,
    };

    // Count each status
    trackings.forEach((tracking) => {
      const status = tracking.status;
      if (status === "applied") {
        stats.applied++;
      } else if (status === "interviewing") {
        stats.interviewing++;
      } else if (status === "offer_received") {
        stats.offers++;
      } else if (status === "rejected") {
        stats.rejected++;
      } else if (status === "not_applied") {
        stats.not_applied++;
      } else if (status === "accepted") {
        stats.accepted++;
      } else if (status === "declined") {
        stats.declined++;
      }
    });

    res.json(stats);
  } catch (err) {
    res.status(500).send("Server error fetching stats");
  }
});

// @route   GET /api/tracking/insights/:internshipId
// @desc    Get anonymous insights for an internship (NO personal data)
// @access  Public
router.get("/insights/:internshipId", async (req, res) => {
  try {
    const { internshipId } = req.params;

    // Get all tracking records for this internship (NO user data)
    const trackings = await ApplicationTracking.find({ 
      internship: internshipId 
    }).select("status createdAt"); // Only get status and date, NO user info

    // Calculate anonymous statistics
    const insights = {
      totalTracking: trackings.length,
      saved: 0, // Only saved (not_applied status)
      applied: 0, // Actually applied
      interviewing: 0,
      offers: 0,
      recentActivity: 0, // Activity in last 7 days
    };

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Count statuses and recent activity (all anonymous)
    trackings.forEach((tracking) => {
      if (tracking.status === "not_applied") insights.saved++;
      if (tracking.status === "applied") insights.applied++;
      if (tracking.status === "interviewing") insights.interviewing++;
      if (tracking.status === "offer_received" || tracking.status === "accepted") insights.offers++;
      if (new Date(tracking.createdAt) > sevenDaysAgo) insights.recentActivity++;
    });

    // Calculate interest level (anonymous)
    let interestLevel = "Low";
    if (insights.totalTracking >= 20) {
      interestLevel = "High";
    } else if (insights.totalTracking >= 10) {
      interestLevel = "Medium";
    }

    // Add interest level and application rate
    insights.interestLevel = interestLevel;
    insights.applicationRate = insights.totalTracking > 0 
      ? Math.round((insights.applied / insights.totalTracking) * 100)
      : 0;

    res.json(insights);
  } catch (err) {
    res.status(500).send("Server error fetching insights");
  }
});

module.exports = router;
