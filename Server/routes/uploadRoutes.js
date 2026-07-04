const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// 1. Storage Setting: Files kahan aur kis naam se save hongi
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/'); // 'uploads' folder mein daalo
    },
    filename(req, file, cb) {
        // File ka naam unique rakho (taake duplicate na ho)
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// 2. Check: Sirf Images allow honi chahiye
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Only Upload Images!');
    }
}

// 3. Upload Middleware
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// 4. Route: '/api/upload' par image bhejo
router.post('/', upload.single('image'), (req, res) => {
    // 🔥 WINDOWS FIX: Backslash (\) ko Forward slash (/) mein badlo
    // Agar yeh nahi karenge to image ka link ghalat banega
    const imagePath = req.file.path.replace(/\\/g, "/");
    
    res.send(`/${imagePath}`);
});

module.exports = router; 