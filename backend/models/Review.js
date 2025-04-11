const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: { type: Number, required: true }, // Ví dụ: từ 1 đến 5
  comment: { type: String },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", ReviewSchema, "Reviews");
