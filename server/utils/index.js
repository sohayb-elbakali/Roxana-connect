const jwt = require("jsonwebtoken");
const config = require("config");
const multer = require("multer");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res
      .status(401)
      .json({ msg: "Token is not available, authorization denied." });
  }

  try {
    jwt.verify(token, config.get("jwtSecret"), (error, decoded) => {
      if (error) {
        return res
          .status(401)
          .json({ msg: "Token is not valid, authorization denied." });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error during authentication" });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}`)
  }
});

const upload = multer({storage: storage}).single("file");

const deadlineUtils = require("./deadlineUtils");

module.exports = { auth, upload, deadlineUtils };
