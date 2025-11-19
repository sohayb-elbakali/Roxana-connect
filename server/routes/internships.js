const express = require("express");
const router = express.Router();
const { auth } = require("../utils");
const { check, validationResult } = require("express-validator");
const { parseInternshipFilters } = require("../middleware/filterMiddleware");
const User = require("../models/User");
const Internship = require("../models/Internship");
const ApplicationTracking = require("../models/ApplicationTracking");

/*
CRUD Endpoints:
1. POST /api/internships - Create internship
2. GET /api/internships - Get all internships with filters
3. GET /api/internships/:id - Get single internship
4. PUT /api/internships/:id - Update internship
5. DELETE /api/internships/:id - Delete internship
*/

// @route   POST /api/internships
// @desc    Create a new internship opportunity
// @access  Private
router.post(
  "/",
  auth,
  [
    check("company", "Company name is required").notEmpty(),
    check("positionTitle", "Position title is required").notEmpty(),
    check("applicationDeadline", "Application deadline is required").notEmpty(),
    check("description", "Description is required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      // Check if user has permission to post internships
      // Only admins and users with level 2 or 3 can post (Level 1 is view-only)
      if (user.role !== 'admin' && (!user.level || user.level === 1)) {
        return res.status(403).json({ 
          msg: "Access denied. Only users with Level 2 or Level 3 can post internships." 
        });
      }

      // Validate deadline is not in the past
      const deadline = new Date(req.body.applicationDeadline);
      if (deadline < new Date()) {
        return res.status(400).json({ 
          errors: [{ msg: "Application deadline cannot be in the past" }] 
        });
      }

      // Validate application link format if provided
      if (req.body.applicationLink) {
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!urlPattern.test(req.body.applicationLink)) {
          return res.status(400).json({ 
            errors: [{ msg: "Invalid application link URL format" }] 
          });
        }
      }

      const newInternship = new Internship({
        user: req.user.id,
        company: req.body.company,
        positionTitle: req.body.positionTitle,
        location: req.body.location,
        locationType: req.body.locationType,
        applicationDeadline: req.body.applicationDeadline,
        description: req.body.description,
        requirements: req.body.requirements || [],
        applicationLink: req.body.applicationLink,
        salaryRange: req.body.salaryRange,
        tags: req.body.tags || [],
        isActive: true,
        trackingCount: 0,
      });

      const internship = await newInternship.save();
      
      // Populate user info and add name field
      const populatedInternship = await Internship.findById(internship._id)
        .populate("user", ["name", "avatar"]);
      
      const internshipObj = populatedInternship.toObject();
      internshipObj.name = populatedInternship.user?.name || user.name;
      
      res.json(internshipObj);
    } catch (err) {
      return res.status(500).send("Server Error: " + err.message);
    }
  }
);

// @route   GET /api/internships
// @desc    Get all internships with optional filters
// @access  Private
router.get("/", auth, parseInternshipFilters, async (req, res) => {
  try {
    const Profile = require("../models/Profile");
    
    // Use filters and sort options from middleware
    const internships = await Internship.find(req.filters)
      .select("-__v")
      .populate("user", "name avatar")
      .sort(req.sortOption);
    
    // Add name field and populate profiles with avatars
    const internshipsWithProfiles = await Promise.all(
      internships.map(async (internship) => {
        const internshipObj = internship.toObject();
        internshipObj.name = internship.user?.name || "Unknown User";
        
        // Get profile avatar
        const profile = await Profile.findOne({ user: internship.user?._id || internship.user }).select("avatar");
        internshipObj.userProfile = profile;
        
        return internshipObj;
      })
    );
    
    res.json(internshipsWithProfiles);
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
});

// @route   GET /api/internships/company/:name
// @desc    Get all internships by company name
// @access  Private
router.get("/company/:name", auth, async (req, res) => {
  try {
    const companyName = req.params.name;

    // Find all internships matching the company name (case-insensitive)
    const internships = await Internship.find({
      company: { $regex: companyName, $options: "i" }
    })
    .populate("user", ["name", "avatar"])
    .sort({ applicationDeadline: 1 }); // Sort by earliest deadline first

    // Add name field to each internship for easier access
    const internshipsWithName = internships.map(internship => {
      const internshipObj = internship.toObject();
      internshipObj.name = internship.user?.name || "Unknown User";
      return internshipObj;
    });

    res.json(internshipsWithName);
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
});

// @route   GET /api/internships/:id
// @desc    Get single internship by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const Profile = require("../models/Profile");
    
    const internship = await Internship.findById(req.params.id)
      .select("-__v")
      .populate("user", "name avatar");

    if (!internship) {
      return res.status(404).json({ msg: "Internship not found" });
    }

    // Add name field and profile with avatar
    const internshipObj = internship.toObject();
    internshipObj.name = internship.user?.name || "Unknown User";
    
    // Get profile avatar
    const profile = await Profile.findOne({ user: internship.user?._id || internship.user }).select("avatar");
    internshipObj.userProfile = profile;
    
    // Populate comment user profiles
    if (internshipObj.comments && internshipObj.comments.length > 0) {
      internshipObj.comments = await Promise.all(
        internshipObj.comments.map(async (comment) => {
          const commentProfile = await Profile.findOne({ user: comment.user }).select("avatar");
          return {
            ...comment,
            userProfile: commentProfile
          };
        })
      );
    }

    res.json(internshipObj);
  } catch (err) {
    // Check if error is due to invalid ObjectId format
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Internship not found" });
    }
    
    res.status(500).send("Server Error: " + err.message);
  }
});

// @route   PUT /api/internships/:id
// @desc    Update an internship
// @access  Private
router.put(
  "/:id",
  auth,
  [
    check("company", "Company name is required").optional().notEmpty(),
    check("positionTitle", "Position title is required").optional().notEmpty(),
    check("location", "Location cannot be empty if provided").optional().notEmpty(),
    check("applicationDeadline", "Application deadline is required").optional().notEmpty(),
    check("description", "Description is required").optional().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const internship = await Internship.findById(req.params.id);

      if (!internship) {
        return res.status(404).json({ msg: "Internship not found" });
      }

      // Check authorization - only owner can update
      if (internship.user.toString() !== req.user.id) {
        return res.status(403).json({ msg: "User is not authorized to update this internship" });
      }

      // Validate deadline if provided (allow existing deadlines to remain unchanged)
      if (req.body.applicationDeadline) {
        const deadline = new Date(req.body.applicationDeadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        deadline.setHours(0, 0, 0, 0);
        
        // Only validate if deadline is being changed and is in the past
        const originalDeadline = new Date(internship.applicationDeadline);
        originalDeadline.setHours(0, 0, 0, 0);
        
        if (deadline.getTime() !== originalDeadline.getTime() && deadline < today) {
          return res.status(400).json({ 
            errors: [{ msg: "New application deadline cannot be in the past" }] 
          });
        }
      }

      // Validate application link format if provided
      if (req.body.applicationLink) {
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!urlPattern.test(req.body.applicationLink)) {
          return res.status(400).json({ 
            errors: [{ msg: "Invalid application link URL format" }] 
          });
        }
      }

      // Update fields
      const updateFields = {};
      if (req.body.company) updateFields.company = req.body.company;
      if (req.body.positionTitle) updateFields.positionTitle = req.body.positionTitle;
      if (req.body.location) updateFields.location = req.body.location;
      if (req.body.locationType) updateFields.locationType = req.body.locationType;
      if (req.body.applicationDeadline) updateFields.applicationDeadline = req.body.applicationDeadline;
      if (req.body.description) updateFields.description = req.body.description;
      if (req.body.requirements !== undefined) updateFields.requirements = req.body.requirements;
      if (req.body.applicationLink !== undefined) updateFields.applicationLink = req.body.applicationLink;
      if (req.body.salaryRange !== undefined) updateFields.salaryRange = req.body.salaryRange;
      if (req.body.tags !== undefined) updateFields.tags = req.body.tags;
      if (req.body.isActive !== undefined) updateFields.isActive = req.body.isActive;

      const updatedInternship = await Internship.findByIdAndUpdate(
        req.params.id,
        { $set: updateFields },
        { new: true }
      ).populate("user", ["name", "avatar"]);

      // Add name field for easier access
      const internshipObj = updatedInternship.toObject();
      internshipObj.name = updatedInternship.user?.name || "Unknown User";

      res.json(internshipObj);
    } catch (err) {
      // Check if error is due to invalid ObjectId format
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Internship not found" });
      }
      
      res.status(500).send("Server Error: " + err.message);
    }
  }
);

// @route   DELETE /api/internships/:id
// @desc    Delete an internship
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ msg: "Internship not found" });
    }

    // Check authorization - only owner can delete
    if (internship.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "User is not authorized to delete this internship" });
    }

    await Internship.findByIdAndDelete(req.params.id);

    res.json({ msg: "Internship removed" });
  } catch (err) {
    // Check if error is due to invalid ObjectId format
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Internship not found" });
    }
    
    res.status(500).send("Server Error: " + err.message);
  }
});

// @route   GET /api/internships/:id/tracking-statuses
// @desc    Get tracking statuses for all commenters on an internship
// @access  Private
router.get("/:id/tracking-statuses", auth, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ msg: "Internship not found" });
    }

    // Get unique user IDs from comments
    const commenterIds = [...new Set(internship.comments.map(c => c.user.toString()))];

    // Fetch tracking records for these users
    const trackingRecords = await ApplicationTracking.find({
      internship: req.params.id,
      user: { $in: commenterIds }
    }).select("user status");

    // Create a map of userId -> status
    const statusMap = {};
    trackingRecords.forEach(record => {
      statusMap[record.user.toString()] = record.status;
    });

    res.json(statusMap);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Internship not found" });
    }
    
    res.status(500).send("Server Error: " + err.message);
  }
});

// @route   POST /api/internships/:id/comment
// @desc    Add comment to internship
// @access  Private
router.post(
  "/:id/comment",
  auth,
  [
    check("text", "Comment text is required").notEmpty(),
    check("commentType", "Comment type is required").isIn(["tip", "advice", "culture", "general"]),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const internship = await Internship.findById(req.params.id);

      if (!internship) {
        return res.status(404).json({ msg: "Internship not found" });
      }

      const newComment = {
        text: req.body.text,
        name: user.name,
        user: req.user.id,
        commentType: req.body.commentType || "general",
        reactions: {
          helpful: [],
          thanks: [],
          insightful: []
        }
      };

      internship.comments.unshift(newComment);
      await internship.save();
      
      res.json(internship.comments);
    } catch (err) {
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Internship not found" });
      }
      
      res.status(500).send("Server Error: " + err.message);
    }
  }
);

// @route   PUT /api/internships/:id/comment/:commentId/react
// @desc    React to a comment (helpful, thanks, insightful)
// @access  Private
router.put("/:id/comment/:commentId/react", auth, async (req, res) => {
  try {
    const { reactionType } = req.body;
    
    if (!["helpful", "thanks", "insightful"].includes(reactionType)) {
      return res.status(400).json({ msg: "Invalid reaction type" });
    }

    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ msg: "Internship not found" });
    }

    const comment = internship.comments.find(
      (comment) => comment.id === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    // Initialize reactions object if it doesn't exist
    if (!comment.reactions) {
      comment.reactions = {
        helpful: [],
        thanks: [],
        insightful: []
      };
    }

    // Check if user has already reacted with this type
    const reactionIndex = comment.reactions[reactionType].findIndex(
      (userId) => userId.toString() === req.user.id
    );

    if (reactionIndex > -1) {
      // Remove reaction
      comment.reactions[reactionType].splice(reactionIndex, 1);
    } else {
      // Add reaction
      comment.reactions[reactionType].push(req.user.id);
    }

    await internship.save();
    res.json(internship.comments);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Internship not found" });
    }
    
    res.status(500).send("Server Error");
  }
});

// @route   DELETE /api/internships/:id/comment/:commentId
// @desc    Delete comment from internship
// @access  Private
router.delete("/:id/comment/:commentId", auth, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ msg: "Internship not found" });
    }

    const comment = internship.comments.find(
      (comment) => comment.id === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    // Check authorization - only comment owner can delete
    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "User is not authorized to delete this comment" });
    }

    internship.comments = internship.comments.filter(
      (comment) => comment.id !== req.params.commentId
    );

    await internship.save();
    res.json(internship.comments);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Internship not found" });
    }
    
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/internships/:id/comment/:commentId/like
// @desc    Like a comment on internship
// @access  Private
router.put("/:id/comment/:commentId/like", auth, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ msg: "Internship not found" });
    }

    const comment = internship.comments.find(
      (comment) => comment.id === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    // Initialize likes and unlikes arrays if they don't exist
    if (!comment.likes) comment.likes = [];
    if (!comment.unlikes) comment.unlikes = [];

    // Check if user has already liked the comment
    const alreadyLiked = comment.likes.some((like) => like.user.toString() === req.user.id);

    if (alreadyLiked) {
      // Remove the like (toggle off)
      comment.likes = comment.likes.filter(
        (like) => like.user.toString() !== req.user.id
      );
    } else {
      // Remove from unlikes if user had unliked it
      comment.unlikes = comment.unlikes.filter(
        (unlike) => unlike.user.toString() !== req.user.id
      );

      // Add to likes
      comment.likes.unshift({ user: req.user.id });
    }

    await internship.save();

    return res.json(internship.comments);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Internship not found" });
    }
    
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/internships/:id/comment/:commentId/unlike
// @desc    Unlike a comment on internship
// @access  Private
router.put("/:id/comment/:commentId/unlike", auth, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ msg: "Internship not found" });
    }

    const comment = internship.comments.find(
      (comment) => comment.id === req.params.commentId
    );

    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    // Initialize likes and unlikes arrays if they don't exist
    if (!comment.likes) comment.likes = [];
    if (!comment.unlikes) comment.unlikes = [];

    // Check if user has already unliked the comment
    const alreadyUnliked = comment.unlikes.some((unlike) => unlike.user.toString() === req.user.id);

    if (alreadyUnliked) {
      // Remove the unlike (toggle off)
      comment.unlikes = comment.unlikes.filter(
        (unlike) => unlike.user.toString() !== req.user.id
      );
    } else {
      // Remove from likes if user had liked it
      comment.likes = comment.likes.filter(
        (like) => like.user.toString() !== req.user.id
      );

      // Add to unlikes
      comment.unlikes.unshift({ user: req.user.id });
    }

    await internship.save();

    return res.json(internship.comments);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Internship not found" });
    }
    
    res.status(500).send("Server Error");
  }
});

// @route   PUT /api/internships/:id/like
// @desc    Like/unlike an internship (interested feature)
// @access  Private
router.put("/:id/like", auth, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ msg: "Internship not found" });
    }

    // Check if user has already liked
    const likeIndex = internship.likes.findIndex(
      (like) => like.user.toString() === req.user.id
    );

    if (likeIndex > -1) {
      // Unlike - remove the like
      internship.likes.splice(likeIndex, 1);
    } else {
      // Like - add the like
      internship.likes.unshift({ user: req.user.id });
    }

    await internship.save();
    res.json(internship.likes);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Internship not found" });
    }
    
    res.status(500).send("Server Error: " + err.message);
  }
});

// @route   GET /api/internships/:id/tracking-users
// @desc    Get list of users tracking this internship
// @access  Private
router.get("/:id/tracking-users", auth, async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ msg: "Internship not found" });
    }

    // Find all users tracking this internship
    const trackingRecords = await ApplicationTracking.find({
      internship: req.params.id
    })
      .populate("user", "name")
      .select("user status");

    // Format the response
    const trackingUsers = trackingRecords.map(record => ({
      userId: record.user._id,
      name: record.user.name,
      status: record.status
    }));

    res.json(trackingUsers);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Internship not found" });
    }
    
    res.status(500).send("Server Error: " + err.message);
  }
});

module.exports = router;
