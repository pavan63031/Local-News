const News = require('../models/News');

exports.categories = async (req, res) => {
  const { category } = req.params;
  try {
    const news = await News.find({
      category: { $regex: new RegExp(category, "i") }
    });
    if (news.length === 0) {
      return res.status(404).json({ message: "No news found in this category" });
    }
    res.json(news);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Server error" });
  }
};
