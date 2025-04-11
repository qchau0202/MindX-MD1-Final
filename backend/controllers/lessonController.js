const Lesson = require("../models/Lesson");
const { body, validationResult } = require("express-validator");

// Lấy tất cả lessons
const getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find().populate("course_id", "title");
    return res.status(200).json({ success: true, data: lessons });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách bài giảng: " + error.message,
    });
  }
};

// Tạo mới lesson
const createLesson = [
  body("course_id")
    .notEmpty()
    .withMessage("Course ID là bắt buộc")
    .isMongoId()
    .withMessage("Course ID không hợp lệ"),
  body("title")
    .notEmpty()
    .withMessage("Tiêu đề là bắt buộc")
    .isString()
    .withMessage("Tiêu đề phải là chuỗi"),
  body("video_url").optional().isURL().withMessage("Video URL không hợp lệ"),
  body("content").optional().isString().withMessage("Nội dung phải là chuỗi"),
  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Thứ tự phải là số nguyên không âm"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      course_id,
      title,
      video_url = "",
      content = "",
      order = 0,
    } = req.body;

    try {
      const lesson = new Lesson({
        course_id,
        title,
        video_url,
        content,
        order,
      });
      const saved = await lesson.save();

      return res.status(201).json({ success: true, data: saved });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi tạo bài giảng: " + error.message,
      });
    }
  },
];

module.exports = {
  getAllLessons,
  createLesson,
};
