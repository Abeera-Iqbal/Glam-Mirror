const express = require('express');
const cors = require('cors');
const path = require('path');
const postRoutes = require("./routes/postRoutes");
require('dotenv').config();
const connectDB = require('./config/db');

// 1. Database Connect
connectDB();

// 2. SABSE PEHLE APP BANAO
const app = express();
const PORT = 5000;

// 3. Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

// 4. ROUTES DEFINE KARO (Yahan 'wardrobe' missing tha)
app.use("/api/posts", postRoutes); 
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes')); // Image Upload k liye
app.use('/api/ai', require('./routes/aiRoutes'));

// 🔥 YEH LINE ADD KI HAI (Wardrobe Feature k liye Zaroori)
app.use('/api/wardrobe', require('./routes/wardrobeRoutes')); 

// 5. Upload Folder Public karo (Taake images nazar ayen)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. Test Route
app.get('/', (req, res) => {
    res.send("API is running...");
});

// 7. Server Start karo
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});