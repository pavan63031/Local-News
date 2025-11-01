const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortdesc: { type: String, required: true },
  description: { type: String, required: true },
   media:{type :  String}, 
    mediaType: {type :  String}, 
  author: { type: String },
  category: {
    type: String,
    enum: ["Politics", "Sports", "Entertainment", "Technology", "Health", "Other"],
    default: "Other",
  },
  date: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NewsUser' }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'NewsUser' },
      text: String,
      userName: { type: String },
      createdAt: { type: Date, default: Date.now },
    }
  ],
  location: {
    latitude: Number,
    longitude: Number,
    place: String,
  }
}, { timestamps: true });

module.exports = mongoose.model("News", newsSchema);
