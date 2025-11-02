    const { text } = require('express');
const News = require('../models/News');
    const User = require('../models/NewsUser');
    const path = require("path");


    exports.getPosts = async (req,res) => {
        
        try{
            const news = await News.find().sort({date : -1});
            res.json(news);
        }
        catch(err){
            res.status(500).json({ error: err.message });
        }
    }

  //   exports.addPosts = async (req, res) => {
  // try {
  //   const { title, shortdesc, description, author, category, latitude, longitude, place} = req.body;

  //   if (!req.file) {
  //     return res.status(400).json({ message: "Image file is required" });
  //   }

  //    const filePath = req.file ? `/uploads/${req.file.filename}` : null;
  //   const fileType = req.file ? req.file.mimetype.split("/")[0] : null; 
  //   const newNews = new News({
  //     title,
  //     shortdesc,
  //     description,
  //     author, 
  //     category,
  //     media: filePath,
  //     mediaType: fileType,
  //     location: {
  //       latitude: parseFloat(latitude),
  //       longitude: parseFloat(longitude),
  //       place,
  //     },  
  //   });

//     await newNews.save();

//   return res.status(201).json(newNews);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error while adding news" });
//   }
// };

exports.addPosts = async (req, res) => {
  try {
    const { title, shortdesc, description, author, category, latitude, longitude, place } = req.body;

    let filePath = null;
    let fileType = null;

    // If a file was uploaded, get its Cloudinary URL
    if (req.file) {
      console.log("Uploaded file info:", req.file); // Debug
      filePath = req.file.path || req.file.url;
      fileType = req.file.mimetype ? req.file.mimetype.split("/")[0] : null;
    }
    console.log("Incoming body:", req.body);
console.log("Incoming file:", req.file);
    const newNews = new News({
      title,
      shortdesc,
      description,
      author,
      category,
      media: filePath,
      mediaType: fileType,
      location: {
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        place,
      },
    });

    await newNews.save();
    return res.status(201).json(newNews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error while adding news" });
  }
};

// UPDATE a post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.file) {
      const filePath = req.file.path || req.file.url;
      const fileType = req.file.mimetype ? req.file.mimetype.split("/")[0] : null;
      updateData.media = filePath;
      updateData.mediaType = fileType;
    }

    const updatedNews = await News.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedNews) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json(updatedNews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating news" });
  }
};

    exports.getNewsById = async (req,res) => {
    try{
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).json({ message: "News not found" });
        res.json(news);

    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
    }


    exports.getMyPosts = async (req,res) => {
        try {
            const {id} = req.params;
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found" });
            const news = await News.find({author : user.name});
        res.json(news);

        } catch (err) {
            console.error(err);
        res.status(500).json({ message: "Server error" });
        }
    }

    exports.deletePost = async(req,res) => {
    try {
        const { id } = req.params;
        const deletedPost = await News.findByIdAndDelete(id);

        if (!deletedPost) {
        return res.status(404).json({ message: "Post not found" });
        }

        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
    }

//     exports.updatePost = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, shortdesc, description, category, place } = req.body;

//     const updateData = {
//       title,
//       shortdesc,
//       description,
//       category,
//     };

//     if (place) {
//       updateData["location.place"] = place;
//     }
//     if (req.file) {
//       const filePath = `/uploads/${req.file.filename}`;
//       const fileType = req.file.mimetype.split("/")[0]; 

//       updateData.media = filePath;
//       updateData.mediaType = fileType;
//     }

//     const updatedNews = await News.findByIdAndUpdate(id, updateData, { new: true });

//     if (!updatedNews) {
//       return res.status(404).json({ message: "News not found" });
//     }

//     res.json({ message: "News updated successfully", news: updatedNews });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error while updating news" });
//   }
// };


    exports.likeNews = async (req,res) => {
      try {
    const newsId = req.params.id;
    const userId = req.body.userId;  

    const news = await News.findById(newsId);
    if (!news) return res.status(404).json({ message: "News not found" });

    const alreadyLiked = news.likes.includes(userId);

    if (alreadyLiked) {
      news.likes = news.likes.filter(id => id.toString() !== userId);
    } else {
      news.likes.push(userId);
    }

    await news.save();
    res.json({ success: true, likesCount: news.likes.length, liked: !alreadyLiked });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
    }

 exports.getComments = async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
      .populate("comments.user", "name");

    if (!news) return res.status(404).json({ message: "News not found" });

    res.json(news.comments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching comments", error: err.message });
  }
};


exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, text } = req.body;

    if (!userId || !text) {
      return res.status(400).json({ message: "User ID and text are required" });
    }

    const news = await News.findById(id);
    if (!news) return res.status(404).json({ message: "News not found" });

    const user = await User.findById(userId).select("name");
    if (!user) return res.status(404).json({ message: "User not found" });

    const newComment = {
      user: user._id,
      text,
      userName: user.name, 
    };

    news.comments.push(newComment);
    await news.save();

    const updatedNews = await News.findById(id).populate("comments.user", "name");

    res.status(200).json({
      message: "Comment added successfully",
      comments: updatedNews.comments,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};