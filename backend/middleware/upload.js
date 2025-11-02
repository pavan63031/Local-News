
//     const multer = require('multer');
//     const path = require('path');
//     const fs = require('fs');

//     const uploadDir = path.join(process.cwd(), "uploads");
//     if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

//     const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/");
//     },
//     filename: (req, file, cb) => {
//         const uniqueName = Date.now() + "-" + file.originalname;
//         cb(null, uniqueName);
//     },
//     });

  
//     const fileFilter = (req, file, cb) => {
//      const allowed = [
//     "image/jpeg",
//     "image/png",
//     "image/jpg",
//     "image/webp",
//     "video/mp4",
//     "video/mkv",
//     "video/webm",
//     "video/ogg",
//   ];
//     if (allowed.includes(file.mimetype)) cb(null, true);
//     else cb(new Error("Only image files are allowed!"), false);
//     };

    
//     const upload = multer({ storage, fileFilter });

//     module.exports =  upload;


// middleware/upload.js
const multer = require("multer");
const { storage } = require("../config/cloudinary");

// Multer setup using Cloudinary storage
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
});

module.exports = upload;
