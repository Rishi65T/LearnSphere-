import express from "express";
import axios from "axios";

const router = express.Router();

// GET /api/videos/:topic
router.get("/videos/:topic", async (req, res) => {
  try {
    const topic = req.params.topic;
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: topic,
          type: "video",
          maxResults: 10,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );
    // Send back the array of video items
    res.json(response.data.items);
  } catch (error: any) {
    console.error("YouTube fetch error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch videos" });
  }
});

export default router;
