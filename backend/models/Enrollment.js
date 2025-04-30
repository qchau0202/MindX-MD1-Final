const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Customer ID là bắt buộc"],
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: [true, "Course ID là bắt buộc"],
  },
  enrollment_date: {
    type: Date,
    default: Date.now,
  },
  enrolled_status: {
    type: Boolean,
    default: true,
  },
  unenrollment_date: {
    type: Date,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Cập nhật khi lưu để tự động đặt updated_at
EnrollmentSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

EnrollmentSchema.index({ customer_id: 1, course_id: 1 }, { unique: true });
EnrollmentSchema.index({ customer_id: 1 });
EnrollmentSchema.index({ course_id: 1 });
EnrollmentSchema.index({ customer_id: 1, course_id: 1, enrolled_status: 1 });

module.exports = mongoose.model("Enrollment", EnrollmentSchema, "Enrollments");
