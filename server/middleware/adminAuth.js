const User = require("../models/User");

/**
 * Middleware to check if user is an admin
 * Must be used after auth middleware
 */
module.exports = async function (req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admin privileges required." });
    }

    // Attach user info to request for convenience
    req.adminUser = user;
    next();
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
