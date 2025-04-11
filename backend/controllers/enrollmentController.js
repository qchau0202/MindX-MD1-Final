const Enrollment = require("../models/Enrollment");
const { body, validationResult } = require("express-validator");

// Lấy tất cả enrollments
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("customer_id", "name email") // ✅ sửa đúng field
      .populate("course_id", "title");

    return res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách đăng ký: " + error.message,
    });
  }
};

// Tạo mới enrollment
const createEnrollment = [
  body("customer_id")
    .notEmpty()
    .withMessage("Customer ID là bắt buộc")
    .isMongoId()
    .withMessage("Customer ID không hợp lệ"),
  body("course_id")
    .notEmpty()
    .withMessage("Course ID là bắt buộc")
    .isMongoId()
    .withMessage("Course ID không hợp lệ"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { customer_id, course_id } = req.body;

    try {
      const existing = await Enrollment.findOne({ customer_id, course_id });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Người dùng đã đăng ký khóa học này",
        });
      }

      const enrollment = new Enrollment({ customer_id, course_id });
      const saved = await enrollment.save();

      return res.status(201).json({ success: true, data: saved });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi tạo đăng ký: " + error.message,
      });
    }
  },
];

module.exports = {
  getAllEnrollments,
  createEnrollment,
};
