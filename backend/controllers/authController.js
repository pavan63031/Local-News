const bcrypt = require("bcryptjs");
const User = require("../models/NewsUser");
const { generateToken } = require("../utils/generateToken");
const {validationResult} = require('express-validator');

exports.register = async (req, res) => {
  const errors = validationResult(req);
   if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, email, password, location } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, and password" });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashed,
      location: location || "Unknown",
    });

    const token = generateToken(user);
    res.cookie("token", token,{
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
   const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password, location } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Provide email and password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Wrong password" });

    if (location) {
      user.location = location;
      await user.save();
    }

    const token = generateToken(user);
    res.cookie("token", token);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
