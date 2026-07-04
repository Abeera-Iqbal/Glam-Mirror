const express = require("express");
const router = express.Router();
const Wardrobe = require("../models/Wardrobe");

// 1. Add Item (With Occasion)
router.post("/add", async (req, res) => {
  try {
    // occasion bhi body se le rahe hain
    const { userId, image, category, name, type, occasion } = req.body; 
    
    const newItem = new Wardrobe({ userId, image, category, name, type, occasion });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get All Items
router.get("/:userId", async (req, res) => {
  try {
    const items = await Wardrobe.find({ userId: req.params.userId });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Delete Item
router.delete("/delete/:id", async (req, res) => {
  try {
    await Wardrobe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;