const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// Jab koi '/signup' par POST request karega, to registerUser chalega
router.post('/signup', registerUser);
// Jab koi '/login' par POST request karega, to loginUser chalega
router.post('/login', loginUser);

module.exports = router;