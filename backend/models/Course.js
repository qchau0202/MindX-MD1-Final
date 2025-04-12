const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  provider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  price: {
    type: mongoose.Schema.Types.Mixed, // "Free" hoặc Number
    required: true,
  },
  level: {
    type: String,
    default: "All level",
    enum: ["All level", "Beginner", "Intermediate", "Advanced"],
  },
  number_of_lessons: {
    type: Number,
    required: true,
    min: 1,
  },
  duration: {
    type: String,
    required: true,
  },
  capacity: {
    type: mongoose.Schema.Types.Mixed, // "unlimited" hoặc Number
    default: "unlimited",
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  location: {
    type: String,
    required: true,
  },
  enrolled_students: {
    type: Number,
    default: 0,
    min: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Course", CourseSchema, "Courses");
