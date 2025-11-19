const express = require("express");
const { auth } = require("../utils/index.js");
const uploadMiddleware = require("../config/multer");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// @route   POST /api/upload/profile-image
// @desc    Upload profile image to Cloudinary
// @access  Private
router.post("/profile-image", auth, uploadMiddleware.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    res.json({
      message: "Upload successful",
      url: req.file.path,
      publicId: req.file.filename
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ msg: "Server error uploading image" });
  }
});

// @route   DELETE /api/upload/profile-image/:publicId
// @desc    Delete profile image from Cloudinary
// @access  Private
router.delete("/profile-image/:publicId", auth, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === "ok") {
      res.json({ message: "Image deleted successfully" });
    } else {
      res.status(404).json({ msg: "Image not found" });
    }
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ msg: "Server error deleting image" });
  }
});

module.exports = router;
