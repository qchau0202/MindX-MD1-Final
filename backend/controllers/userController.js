const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const bcrypt = require("bcryptjs");

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
    const {
      email,
      password,
      name,
      phone,
      address,
      role,
      provider_status,
      avatar,
      enrolled,
      course_id,
      provider_info,
    } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Thiếu các trường bắt buộc: email, password, role",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email đã được sử dụng",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      email,
      password: hashedPassword,
      name,
      phone,
      address,
      role,
      provider_status:
        role === "provider" ? provider_status || "pending" : "pending",
      avatar: avatar || null,
      enrolled: enrolled || false,
      course_id: course_id || [],
      provider_info: provider_info || {
        course_count: 0,
        total_students: 0,
        social_links: {},
      },
      created_at: new Date(),
    };

    const newUser = new User(userData);
    const savedUser = await newUser.save();
    return res.status(201).json({ success: true, data: savedUser });
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }
    return res.status(500).json({
      success: false,
      message: "Lỗi khi tạo user: " + error.message,
    });
  }
};

// Đăng ký khóa học
const enrollCourse = async (req, res) => {
  try {
    const user = req.user;
    const { course_id } = req.body;

    console.log("Enroll request:", { user, course_id }); // Debug

    // Kiểm tra đăng nhập
    if (!user || !user.id) {
      return res.status(401).json({
        success: false,
        message: "Phiên đăng nhập không hợp lệ",
      });
    }

    // Kiểm tra user tồn tại
    const userData = await User.findById(user.id);
    console.log("User found:", userData);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // Kiểm tra khóa học tồn tại
    const course = await Course.findById(course_id);
    console.log("Course found:", course);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Khóa học không tồn tại",
      });
    }

    // Kiểm tra đã đăng ký chưa
    const existingEnrollment = await Enrollment.findOne({
      customer_id: user.id,
      course_id,
    });
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đăng ký khóa học này",
      });
    }

    // Tạo bản ghi Enrollment
    const enrollment = new Enrollment({
      customer_id: user.id,
      course_id,
    });
    await enrollment.save();

    // Cập nhật Course
    course.enrolled_students = (course.enrolled_students || 0) + 1;
    await course.save();

    // Cập nhật total_students của provider
    const provider = await User.findById(course.provider_id);
    if (provider && provider.role === "provider") {
      provider.provider_info.total_students =
        (provider.provider_info.total_students || 0) + 1;
      await provider.save();
    }

    return res.status(200).json({
      success: true,
      message: "Đăng ký khóa học thành công",
      data: { user: userData, course, enrollment },
    });
  } catch (error) {
    console.error("Error enrolling course:", error);
    return res.status(500).json({
      success: false,
      message: `Lỗi khi đăng ký khóa học: ${error.message}`,
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  enrollCourse,
};
