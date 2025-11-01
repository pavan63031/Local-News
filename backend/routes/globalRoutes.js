const express = require('express');
const router = express.Router();

router.get("/", async (req, res) => {
  const category = req.query.category || "general";
  const apiKey = process.env.NEWS_API_KEY;

  const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apikey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Global news error:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

module.exports = router;
