const User = require("../models/User");

// Lấy tất cả user
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error retrieving users:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

// Tạo user mới
const createUser = async (req, res) => {
  try {
    // Bạn có thể kiểm tra các trường cần thiết trong req.body nếu muốn
    const userData = req.body;
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    return res.status(201).json({ success: true, data: savedUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi tạo user: " + error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
};