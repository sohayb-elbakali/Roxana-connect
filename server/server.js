const cors = require("cors");
const express = require("express");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db.js");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", require("./routes/users.js"));
app.use("/api/profiles", require("./routes/profiles.js"));
app.use("/api/posts", require("./routes/posts.js"));

connectDB();

// Custom middleware to serve profile images with fallback
app.get("/images/:userId", (req, res) => {
  const userId = req.params.userId;
  const imagePath = path.join(__dirname, "public", "images", userId);
  const defaultImagePath = path.join(__dirname, "public", "default.png");

  // Check if user's profile image exists
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If user's image doesn't exist, serve the default image
      res.sendFile(defaultImagePath);
    } else {
      // If user's image exists, serve it
      res.sendFile(imagePath);
    }
  });
});

app.use(express.static(__dirname + '/public'))

app.get("/", (req, res) => res.send("Server is working correctly"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
