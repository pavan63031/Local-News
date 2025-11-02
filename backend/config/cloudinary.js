// config/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "local-news",        // Cloudinary folder
      resource_type: "auto",       // images & videos
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

module.exports = { cloudinary, storage };
