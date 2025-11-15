const express = require("express");
const { auth, upload } = require("../utils/index.js");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const normalizeUrl = require("normalize-url");
const Profile = require("../models/Profile.js");
const User = require("../models/User.js");
const Post = require("../models/Post.js");
const Internship = require("../models/Internship.js");
const ApplicationTracking = require("../models/ApplicationTracking.js");

/*
1.  POST /profiles
2.  GET /profiles/me
3.  GET /profiles
4.  GET /profiles/user/:user_id
5.  DELETE /profiles
6.  POST /profiles/upload
7.  PUT /profiles/experience
8.  DELETE /profiles/experience/:exp_id
9.  PUT /profiles/education
10. DELETE /profiles/education/:edu_id
11. GET /profiles/user/:user_id/internship-stats
12. PUT /profiles/internship-preferences
*/

router.post(
  "/",
  auth,
  check("status", "Status is required").notEmpty(),
  check("skills", "Skills is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    /*
    {
"company": “ARAMEX”,
“status”: “Junior Developer”,
“skills”: [”HTML, CSS, PHP, JAVASCRIPT”],
“website”: ”https://www.mywebsite.com“,
“location”:”Dubai”,
“bio”:”I am a software engineer and studied in the Arabic university”,
“github”:””,
“twitter”:””,
“youtube”:””
}
    */

    const {
      website,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      github,
      ...rest
    } = req.body;

    const profile = {
      user: req.user.id,
      website:
        website && website !== ""
          ? normalizeUrl(website, { forceHttps: true })
          : "",
      skills: Array.isArray(skills)
        ? skills
        : skills.split(",").map((skill) => skill.trim()),
      ...rest,
    };

    const socialFields = {
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      github,
    };
    for (let key in socialFields) {
      const value = socialFields[key];
      if (value && value != "") {
        socialFields[key] = normalizeUrl(value, { forceHttps: true });
      }
    }

    profile.social = socialFields;

    try {
      let profileObject = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profile },
        { new: true, upsert: true }
      ).populate("user", ["name"]);
      return res.json(profileObject);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
);

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const profiles = await Profile.find()
      .select("-__v")
      .populate("user", "name");
    res.json(profiles);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("/user/:user_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    })
    .select("-__v")
    .populate("user", "name");

    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There is no profile for the given user" });
    }

    res.json(profile);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.delete("/", auth, async (req, res) => {
  // Remove posts, profile, user

  try {
    // Delete posts first
    await Post.deleteMany({ user: req.user.id });

    // Delete profile
    await Profile.findOneAndDelete({
      user: req.user.id,
    });

    // Delete user
    await User.findOneAndDelete({ _id: req.user.id });

    res.json({ msg: "User information is deleted successfully" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.post("/upload", auth, async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        res.status(500).send(`Server Error: ${err}`);
      } else {
        try {
          res.status(200).send(req.user.id);
        } catch (err) {
          res.status(500).send(`Server Error: ${err}`);
        }
      }
    });
  } catch (err) {
    res.status(500).send(`Server Error: ${err}`);
  }
});

router.put(
  "/experience",
  auth,
  check("title", "Title is required").notEmpty(),
  check("company", "Company is required").notEmpty(),
  check("from", "From date is required and needs to be from the past")
    .notEmpty()
    .custom((value, { req }) => {
      return req.body.to ? value < req.body.to : true;
    }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(req.body);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      return res.status(500).send("Server error adding experience");
    }
  }
);

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    profile.experience = profile.experience.filter((exp) => {
      return exp._id.toString() !== req.params.exp_id;
    });

    await profile.save();
    return res.json(profile);
  } catch (err) {
    return res.status(500).send("Server error deleting experience");
  }
});

router.put(
  "/education",
  auth,
  check("school", "School is required").notEmpty(),
  check("degree", "Degree is required").notEmpty(),
  check("fieldofstudy", "Field of study is required").notEmpty(),
  check("from", "From date is required and needs to be from the past")
    .notEmpty()
    .custom((value, { req }) => {
      return req.body.to ? value < req.body.to : true;
    }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(req.body);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      return res.status(500).send("Server error adding education");
    }
  }
);

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    profile.education = profile.education.filter((edu) => {
      return edu._id.toString() !== req.params.edu_id;
    });

    await profile.save();
    return res.json(profile);
  } catch (err) {
    return res.status(500).send("Server error deleting education");
  }
});

// @route   GET /profiles/user/:user_id/internship-stats
// @desc    Get internship statistics for a user
// @access  Private
router.get("/user/:user_id/internship-stats", auth, async (req, res) => {
  try {
    const userId = req.params.user_id;

    // Get internships posted by user
    const postedInternships = await Internship.find({ user: userId })
      .select("company positionTitle applicationDeadline isActive")
      .sort({ date: -1 });

    // Get tracking statistics for user
    const trackingRecords = await ApplicationTracking.find({ user: userId })
      .populate("internship", "company positionTitle applicationDeadline")
      .sort({ updatedAt: -1 });

    // Calculate statistics
    const stats = {
      total: trackingRecords.length,
      not_applied: 0,
      applied: 0,
      interviewing: 0,
      offer_received: 0,
      rejected: 0,
      accepted: 0,
      declined: 0,
    };

    trackingRecords.forEach((record) => {
      if (stats[record.status] !== undefined) {
        stats[record.status]++;
      }
    });

    // Get offers and acceptances for display
    const offersAndAcceptances = trackingRecords
      .filter((record) => 
        record.status === "offer_received" || record.status === "accepted"
      )
      .map((record) => ({
        company: record.internship?.company,
        position: record.internship?.positionTitle,
        status: record.status,
        date: record.updatedAt,
      }));

    res.json({
      postedInternships,
      trackingStats: stats,
      trackedInternships: trackingRecords.slice(0, 5), // Recent 5
      offersAndAcceptances,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// @route   PUT /profiles/internship-preferences
// @desc    Update user's internship preferences (target companies and roles)
// @access  Private
router.put("/internship-preferences", auth, async (req, res) => {
  try {
    const { targetCompanies, targetRoles } = req.body;

    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    // Add internship preferences to profile
    if (targetCompanies !== undefined) {
      profile.targetCompanies = targetCompanies;
    }
    if (targetRoles !== undefined) {
      profile.targetRoles = targetRoles;
    }

    await profile.save();
    return res.json(profile);
  } catch (err) {
    return res.status(500).send("Server error updating preferences");
  }
});

module.exports = router;
