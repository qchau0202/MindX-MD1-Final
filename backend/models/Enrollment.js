const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  enrollment_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Enrollment", EnrollmentSchema, "Enrollments");
