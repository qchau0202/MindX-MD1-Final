const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const register = async (req, res) => {
  const { email, password, name, role } = req.body;

  try {
    // Prevent multiple admins
    if (role === "admin") {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        return res
          .status(403)
          .json({ success: false, message: "Admin existed" });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email has been used" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      role,
      provider_status: role === "provider" ? "pending" : undefined,
    });

    const savedUser = await newUser.save();
    return res.status(201).json({ success: true, data: savedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Login error: " + error.message });
  }
};

// Login
const login = async (req, res) => {
  console.log("Login request body:", req.body);
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Account has already existed" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Incorrect password" });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Login error: " + error.message });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not existed",
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error getting current user:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user data: " + error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
