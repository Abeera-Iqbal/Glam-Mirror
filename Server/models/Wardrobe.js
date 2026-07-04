const mongoose = require("mongoose");

const wardrobeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, required: true },
    
    // 1. Mausam (Sardi/Garmi)
    category: { 
      type: String, 
      required: true, 
      enum: ["Winter", "Summer", "All Season"] 
    },

    // 2. Type (Shirt/Pant)
    type: {
        type: String,
        required: true,
        enum: ["Top", "Bottom", "Shoes"],
        default: "Top"
    },

    // 3. Occasion (Mood/Jagah) - NEW ADDITION ✨
    occasion: {
        type: String,
        required: true,
        enum: ["Casual", "Formal", "Party", "Sport"], // Yeh 4 options honge
        default: "Casual"
    },

    name: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wardrobe", wardrobeSchema);