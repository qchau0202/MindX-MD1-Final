const Lesson = require("../models/Lesson");
const { body, validationResult } = require("express-validator");

// Get all lessons
const getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find().populate("course_id", "title");
    return res.status(200).json({ success: true, data: lessons });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error: " + error.message,
    });
  }
};

// Create new lesson
const createLesson = [
  body("course_id")
    .notEmpty()
    .withMessage("Course ID is required")
    .isMongoId()
    .withMessage("Course ID is not valid"),
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string"),
  body("video_url").optional().isURL().withMessage("Video URL is not valid"),
  body("content").optional().isString().withMessage("Content must be a string"),
  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Order must be a non-negative integer"),

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
        message: "Error creating lesson: " + error.message,
      });
    }
  },
];

module.exports = {
  getAllLessons,
  createLesson,
};
