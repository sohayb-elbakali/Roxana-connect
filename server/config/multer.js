// config/multer.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "my_app_uploads",
    resource_type: "auto"
  },
});

const upload = multer({ storage });
module.exports = upload;
