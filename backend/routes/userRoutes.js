const express = require('express');

const router = express.Router();
const {getProfile,followUser,unfollowUser,updateProfile,upload} = require('../controllers/userController');

router.get('/profile/:id',getProfile);
router.post("/follow/:id", followUser);
router.post("/unfollow/:id", unfollowUser);
router.put("/update/:id", upload.single("profilePic"), updateProfile);

module.exports = router;