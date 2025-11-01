const User = require("../models/NewsUser");
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });
exports.upload = upload;


exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "name profilePic")
      .populate("following", "name profilePic");

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ msg: "Server error", err });
  }
};


exports.followUser = async (req, res) => {
  try {
    const currentUserId = req.body.userId;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId)
      return res.status(400).json({ msg: "You cannot follow yourself" });

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser)
      return res.status(404).json({ msg: "User not found" });

    if (!targetUser.followers.includes(currentUserId)) {
      targetUser.followers.push(currentUserId);
      currentUser.following.push(targetUserId);
      await targetUser.save();
      await currentUser.save();
      res.json({ msg: "User followed successfully" });
    } else {
      res.status(400).json({ msg: "Already following this user" });
    }
  } catch (err) {
    console.error("Follow user error:", err);
    res.status(500).json({ msg: "Server error", err });
  }
};


exports.unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.body.userId;
    const targetUserId = req.params.id;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser)
      return res.status(404).json({ msg: "User not found" });

    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId
    );
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );

    await targetUser.save();
    await currentUser.save();

    res.json({ msg: "User unfollowed successfully" });
  } catch (err) {
    console.error("Unfollow user error:", err);
    res.status(500).json({ msg: "Server error", err });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If a new profile picture is uploaded, save its relative path
    if (req.file) {
      updates.profilePic = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};
