const express = require('express');
const News = require('../models/News');
const upload = require('../middleware/upload');

const router = express.Router();
const {getPosts,addPosts,getNewsById,getMyPosts,deletePost,updatePost,likeNews,addComment,getComments} = require('../controllers/newsController');

router.get('/news', getPosts);
router.post("/addNews", upload.single("media"), addPosts);
router.get('/news/:id',getNewsById);
router.get('/news/myposts/:id',getMyPosts);
router.delete('/news/:id',deletePost);
router.put('/editnews/:id', upload.single("media"),updatePost);
router.post('/:id/like',likeNews);
router.post('/:id/comment',addComment);
router.get('/:id/comments',getComments);

router.get("/local", async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) return res.status(400).json({ message: "Location required" });

    const localNews = await News.find({ location }).sort({ createdAt: -1 });
    res.json(localNews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


router.get("/nearby", async (req, res) => {
  try {
    const { lat, lon, radius = 20 } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ message: "Latitude and longitude required" });
    }

    const allNews = await News.find();
    const nearby = allNews.filter((n) => {
      if (!n.location || !n.location.latitude || !n.location.longitude) return false;
      const distance = getDistance(
        parseFloat(lat),
        parseFloat(lon),
        n.location.latitude,
        n.location.longitude
      );
      return distance <= parseFloat(radius);
    });

    res.json(nearby);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;