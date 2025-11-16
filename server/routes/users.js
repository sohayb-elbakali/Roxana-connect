const express = require("express");
const { auth } = require("../utils/index.js");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../utils/email.js");

// Get JWT secret from environment
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  return secret;
};

/*
 Get the request body
 Validate the request body
 Check if user exists, if yes, return error
 Encrypt password
 Save data in DB
 Using JWT create token contains user id, return token.
*/

/*
Path: POST /api/users/register
Desc: Registers a new user
Public
*/
router.post(
  "/register",
  check("name", "Name is required").notEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please choose a password with at least 6 characters"
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      
      // Generate verification token
      const verificationToken = jwt.sign(
        { userId: user.id },
        getJwtSecret(),
        { expiresIn: "24h" }
      );
      user.verificationToken = verificationToken;
      
      await user.save();

      // Send verification email (don't wait for it)
      sendVerificationEmail(email, name, verificationToken).catch(err => {
        console.error("Failed to send verification email:", err);
      });

      const payload = {
        user: {
          id: user.id,
        },
      };

      // Generate access token (short-lived)
      const accessToken = jwt.sign(
        payload,
        getJwtSecret(),
        { expiresIn: "15m" }
      );

      // Generate refresh token (long-lived)
      const refreshToken = jwt.sign(
        payload,
        getJwtSecret(),
        { expiresIn: "7d" }
      );

      // Save refresh token to database
      user.refreshToken = refreshToken;
      await user.save();

      res.json({
        token: accessToken,
        refreshToken: refreshToken,
        message: "Registration successful! Please check your email to verify your account."
      });
    } catch (err) {
      res.status(500).send("Server error during registration");
    }
  }
);

/*
Path: POST /api/users/login
Desc: logins an existing user
Public
*/
router.post(
  "/login",
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please choose a password with at least 6 characters"
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      // Generate access token (short-lived)
      const accessToken = jwt.sign(
        payload,
        getJwtSecret(),
        { expiresIn: "15m" }
      );

      // Generate refresh token (long-lived)
      const refreshToken = jwt.sign(
        payload,
        getJwtSecret(),
        { expiresIn: "7d" }
      );

      // Update refresh token in database
      user.refreshToken = refreshToken;
      await user.save();

      res.json({
        token: accessToken,
        refreshToken: refreshToken,
        verified: user.verified
      });
    } catch (err) {
      res.status(500).send("Server error during login");
    }
  }
);

/*
Path: GET /api/users
Desc: Takes a token and returns user information
Private
*/
router.get("/", auth ,async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).send("Server error fetching user");
    }
});

/*
Path: POST /api/users/refresh-token
Desc: Refresh access token using refresh token
Public
*/
router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Refresh token is required" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, getJwtSecret());

    // Find user and verify refresh token matches
    const user = await User.findById(decoded.user.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }

    // Generate new access token
    const payload = {
      user: {
        id: user.id,
      },
    };

    const newAccessToken = jwt.sign(
      payload,
      getJwtSecret(),
      { expiresIn: "15m" }
    );

    res.json({ token: newAccessToken });
  } catch (err) {
    res.status(401).json({ msg: "Invalid or expired refresh token" });
  }
});

/*
Path: GET /api/users/verify-email/:token
Desc: Verify user email
Public
*/
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;

    // Verify token
    const decoded = jwt.verify(token, getJwtSecret());

    // Find user and update verified status
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ msg: "Email already verified" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ msg: "Email verified successfully! You can now login." });
  } catch (err) {
    res.status(400).json({ msg: "Invalid or expired verification token" });
  }
});

/*
Path: POST /api/users/forgot-password
Desc: Request password reset email
Public
*/
router.post(
  "/forgot-password",
  check("email", "Please include a valid email").isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if user exists for security
        return res.json({ msg: "If that email exists, a reset link has been sent." });
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user.id },
        getJwtSecret(),
        { expiresIn: "1h" }
      );

      // Save reset token and expiry
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      // Send password reset email
      await sendPasswordResetEmail(email, user.name, resetToken);

      res.json({ msg: "If that email exists, a reset link has been sent." });
    } catch (err) {
      res.status(500).send("Server error processing password reset");
    }
  }
);

/*
Path: POST /api/users/reset-password/:token
Desc: Reset password with token
Public
*/
router.post(
  "/reset-password/:token",
  check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { token } = req.params;
      const { password } = req.body;

      // Verify token
      const decoded = jwt.verify(token, getJwtSecret());

      // Find user and check token validity
      const user = await User.findById(decoded.userId);
      if (!user || user.resetPasswordToken !== token) {
        return res.status(400).json({ msg: "Invalid or expired reset token" });
      }

      // Check if token has expired
      if (Date.now() > user.resetPasswordExpires) {
        return res.status(400).json({ msg: "Reset token has expired" });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({ msg: "Password reset successful! You can now login with your new password." });
    } catch (err) {
      res.status(400).json({ msg: "Invalid or expired reset token" });
    }
  }
);

/*
Path: POST /api/users/resend-verification
Desc: Resend verification email
Private
*/
router.post("/resend-verification", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ msg: "Email already verified" });
    }

    // Generate new verification token
    const verificationToken = jwt.sign(
      { userId: user.id },
      getJwtSecret(),
      { expiresIn: "24h" }
    );

    user.verificationToken = verificationToken;
    await user.save();

    // Send verification email
    const emailResult = await sendVerificationEmail(user.email, user.name, verificationToken);

    if (emailResult.success) {
      res.json({ 
        message: "Verification email sent successfully! Check your inbox.",
        devMode: emailResult.messageId === 'dev-mode'
      });
    } else {
      res.status(500).json({ message: "Failed to send verification email" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error sending verification email" });
  }
});

/*
Path: PUT /api/users/update-name
Desc: Update user name
Private
*/
router.put(
  "/update-name",
  [
    auth,
    check("name", "Name is required").notEmpty().trim()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      user.name = name;
      await user.save();

      res.json({ msg: "Name updated successfully!", user: { name: user.name, email: user.email, verified: user.verified } });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error updating name");
    }
  }
);

/*
Path: PUT /api/users/update-password
Desc: Update user password
Private
*/
router.put(
  "/update-password",
  [
    auth,
    check("currentPassword", "Current password is required").exists(),
    check("newPassword", "New password must be at least 6 characters").isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Current password is incorrect" });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      res.json({ msg: "Password updated successfully!" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error updating password");
    }
  }
);

module.exports = router;
