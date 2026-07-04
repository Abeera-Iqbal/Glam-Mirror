const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// 1. Create Post (User photo battle mein bhejega)
router.post("/create", async (req, res) => {
  try {
    const { userId, username, image, caption } = req.body;
    
    const newPost = new Post({
      userId,
      username,
      image,
      caption
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get All Posts (Arena mein dikhane ke liye)
router.get("/all", async (req, res) => {
  try {
    // Hum posts ko 'Newest First' sort karenge (-1)
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Like / Unlike Logic (Heart Button)
router.put("/like/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body; // Jo banda like kar raha hai

    const post = await Post.findById(postId);

    // Check: Kya user pehle like kar chuka hai?
    if (post.likes.includes(userId)) {
      // Agar haan, to UNLIKE kardo (Like wapas lelo)
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json({ message: "Post Unliked" });
    } else {
      // Agar nahi, to LIKE kardo
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json({ message: "Post Liked" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;