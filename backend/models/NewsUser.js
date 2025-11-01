const mongoose = require('mongoose');

const userSchema = new  mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type: String,
         required: true
    },
    profilePic: {
      type: String,
      default:
        "https://cdn-icons-png.flaticon.com/512/847/847969.png",
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NewsUser",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NewsUser",
      },
    ],
    role: {
      type: String,
      default: "user",
    },
},{timestamps : true});

module.exports =  mongoose.model("NewsUser",userSchema);