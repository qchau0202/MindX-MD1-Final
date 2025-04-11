const Course = require("../models/Course");

// Lấy tất cả courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    return res.status(200).json({ success: true, data: courses });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

// Tạo course mới
const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    const saved = await course.save();
    return res.status(201).json({ success: true, data: saved });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi tạo course: " + error.message,
    });
  }
};

module.exports = {
  getAllCourses,
  createCourse,
};
