const express = require("express");
const router = express.Router();
const { auth } = require("../utils/index.js");
const adminAuth = require("../middleware/adminAuth");
const User = require("../models/User.js");
const Profile = require("../models/Profile.js");

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
Desc: Delete a user (admin only)
Private + Admin
*/
router.delete("/users/:id", [auth, adminAuth], async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({ msg: "You cannot delete yourself" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Delete user's profile if exists
    await Profile.findOneAndDelete({ user: req.params.id });

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
