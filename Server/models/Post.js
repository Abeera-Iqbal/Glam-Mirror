const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: { type: String, required: true }, // User ka naam (display ke liye)
    image: { type: String, required: true },    // Dress wali photo ka link
    caption: { type: String, default: "" },     // User ka caption (e.g. "My Eid Look")
    
    // Likes: Hum user ki IDs store karenge taake 1 banda 2 baar like na kare
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true } // CreatedAt khud aa jayega
);

module.exports = mongoose.model("Post", postSchema);