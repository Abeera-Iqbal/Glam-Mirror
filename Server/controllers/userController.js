const User = require("../models/User");

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public

const registerUser = async (req, res) => {
  try {
    // 1. Frontend se data nikalo
    const { name, email, password } = req.body;
    // 2. Check karo ke user pehle se hai ya nahi
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User is Already Registered" });
    }
    // 4. Naya User banao
    const user = await User.create({
      name,
      email,
      password,
    });
    // 5. Agar ban gya, to success message bhejo
    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        message: "User register successfully!🎉",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Login user
// @route   POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1. Check karo user hai bhi ya nahi?
    const user = await User.findOne({ email });
    console.log("EMAIL:", email);
    console.log("PASSWORD:", password);
    console.log("USER FROM DB:", user);
    // 2. Check karo password match hua?
    // (Abhi hum simple check kar rahe hain, encrypt nahi)
    if (user && user.password.trim() === password.trim()) {
      user.loginCount += 1;
      user.lastLogin = new Date();
//user login count
      await user.save();
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        message: "Login Successful! Welcome back! 🔓",
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { registerUser, loginUser };
