const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register User
const RegisteUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Create user
    const user = await User.create({ name, email, password });
    res.status(201).json({ token: generateToken(user._id, user.role) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ token: generateToken(user._id, user.role) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser };
