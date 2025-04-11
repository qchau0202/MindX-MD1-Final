const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: { type: String, required: true },
  video_url: { type: String },
  content: { type: String },
  order: { type: Number },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Lesson", LessonSchema, "Lessons");
