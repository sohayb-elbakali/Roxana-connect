const express = require("express");
const router = express.Router();
const { auth } = require("../utils/index.js");
const adminAuth = require("../middleware/adminAuth");
const User = require("../models/User.js");
const Profile = require("../models/Profile.js");
const Post = require("../models/Post.js");
const Internship = require("../models/Internship.js");
const ApplicationTracking = require("../models/ApplicationTracking.js");

/*
Path: GET /api/admin/users
Desc: Get all users with their profiles (admin only)
Private + Admin
*/
router.get("/users", [auth, adminAuth], async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", role = "", level = "", verified = "" } = req.query;
    
    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    if (level) {
      query.level = parseInt(level);
    }
    
    if (verified !== "") {
      query.verified = verified === "true";
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await User.countDocuments(query);

    // Get profiles for users
    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        const profile = await Profile.findOne({ user: user._id }).select("bio location");
        return {
          ...user.toObject(),
          profile: profile || null
        };
      })
    );

    res.json({
      users: usersWithProfiles,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/*
Path: GET /api/admin/stats
Desc: Get admin dashboard statistics
Private + Admin
*/
router.get("/stats", [auth, adminAuth], async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: "admin" });
    const regularUsers = await User.countDocuments({ role: "user" });
    const verifiedUsers = await User.countDocuments({ verified: true });
    
    const level1Users = await User.countDocuments({ level: 1 });
    const level2Users = await User.countDocuments({ level: 2 });
    const level3Users = await User.countDocuments({ level: 3 });

    // Recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({ 
      date: { $gte: thirtyDaysAgo } 
    });

    res.json({
      totalUsers,
      adminUsers,
      regularUsers,
      verifiedUsers,
      level1Users,
      level2Users,
      level3Users,
      recentUsers
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/*
Path: PUT /api/admin/users/:id/role
Desc: Update user role (admin only)
Private + Admin
*/
router.put("/users/:id/role", [auth, adminAuth], async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role. Must be 'user' or 'admin'" });
    }

    // Prevent admin from demoting themselves
    if (req.user.id === req.params.id && role === "user") {
      return res.status(400).json({ msg: "You cannot demote yourself" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.role = role;
    // If promoting to admin, remove level (admins don't have levels)
    if (role === 'admin') {
      user.level = undefined;
    } else if (role === 'user' && !user.level) {
      // If demoting from admin to user, set default level
      user.level = 1;
    }
    await user.save();

    res.json({ 
      msg: `User role updated to ${role}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        level: user.level,
        date: user.date
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/*
Path: PUT /api/admin/users/:id/level
Desc: Update user level (admin only)
Private + Admin
*/
router.put("/users/:id/level", [auth, adminAuth], async (req, res) => {
  try {
    const { level } = req.body;

    if (!level || ![1, 2, 3].includes(level)) {
      return res.status(400).json({ msg: "Invalid level. Must be 1, 2, or 3" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Prevent changing level for admin users
    if (user.role === 'admin') {
      return res.status(400).json({ msg: "Cannot change level for admin users. Admins don't have levels." });
    }

    user.level = level;
    await user.save();

    res.json({ 
      msg: `User level updated to ${level}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        level: user.level,
        date: user.date
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

/*
Path: DELETE /api/admin/users/:id
Desc: Delete a user and all their data (admin only)
Private + Admin
*/
router.delete("/users/:id", [auth, adminAuth], async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({ msg: "You cannot delete yourself" });
    }

    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Comprehensive deletion - same as user self-delete
    // 1. Delete all posts created by user
    await Post.deleteMany({ user: userId });
    
    // 2. Remove user's comments from all posts
    const allPosts = await Post.find({});
    for (const post of allPosts) {
      const originalLength = post.comments.length;
      post.comments = post.comments.filter(comment => comment.user.toString() !== userId);
      if (post.comments.length !== originalLength) {
        await post.save();
      }
    }
    
    // 3. Remove user's likes from all posts
    const postsWithLikes = await Post.find({});
    for (const post of postsWithLikes) {
      const originalLength = post.likes.length;
      post.likes = post.likes.filter(likeUserId => likeUserId.toString() !== userId);
      if (post.likes.length !== originalLength) {
        await post.save();
      }
    }
    
    // 4. Remove user's unlikes from all posts
    const postsWithUnlikes = await Post.find({});
    for (const post of postsWithUnlikes) {
      const originalLength = post.unlikes.length;
      post.unlikes = post.unlikes.filter(unlikeUserId => unlikeUserId.toString() !== userId);
      if (post.unlikes.length !== originalLength) {
        await post.save();
      }
    }
    
    // 5. Delete all internships posted by user
    await Internship.deleteMany({ user: userId });
    
    // 6. Remove user's comments from all internships
    const allInternships = await Internship.find({});
    for (const internship of allInternships) {
      const originalLength = internship.comments.length;
      internship.comments = internship.comments.filter(comment => comment.user.toString() !== userId);
      if (internship.comments.length !== originalLength) {
        await internship.save();
      }
    }
    
    // 7. Remove user's likes from all internships
    const allInternshipsForLikes = await Internship.find({});
    for (const internship of allInternshipsForLikes) {
      const originalLength = internship.likes.length;
      internship.likes = internship.likes.filter(like => like.user.toString() !== userId);
      if (internship.likes.length !== originalLength) {
        await internship.save();
      }
    }
    
    // 8. Delete all application tracking records
    await ApplicationTracking.deleteMany({ user: userId });
    
    // 9. Delete profile
    await Profile.findOneAndDelete({ user: userId });
    
    // 10. Delete user account
    await User.findOneAndDelete({ _id: userId });

    res.json({ msg: "User and all associated data deleted successfully" });
  } catch (err) {
    console.error('Admin delete user error');
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
