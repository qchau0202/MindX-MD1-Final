// const mongoose = require("mongoose");

// const LessonSchema = new mongoose.Schema({
//   course_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Course",
//     required: true,
//   },
//   title: { type: String, required: true },
//   video_url: { type: String },
//   content: { type: String },
//   order: { type: Number },
//   created_at: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Lesson", LessonSchema, "Lessons");

const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Course ID là bắt buộc"],
  },
  title: {
    type: String,
    required: [true, "Tiêu đề là bắt buộc"],
  },
  video_url: {
    type: String,
    validate: {
      validator: function (v) {
        if (!v) return true; // Cho phép rỗng
        return /^(https?:\/\/).+\..+/.test(v); // Kiểm tra URL cơ bản
      },
      message: "Video URL không hợp lệ",
    },
  },
  content: {
    type: String,
  },
  order: {
    type: Number,
    default: 0, // Thêm mặc định để sắp xếp
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now, // Thêm để theo dõi cập nhật
  },
});

// Middleware kiểm tra course_id (tùy chọn)
// LessonSchema.pre("save", async function (next) {
//   const Course = mongoose.model("Course");
//   const courseExists = await Course.exists({ _id: this.course_id });
//   if (!courseExists) {
//     return next(new Error("Course ID không tồn tại"));
//   }
//   next();
// });

// Thêm index
LessonSchema.index({ course_id: 1 });

module.exports = mongoose.model("Lesson", LessonSchema, "Lessons");