const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  role: {
    type: String,
    enum: ["admin", "customer", "provider"],
    required: true,
  },
  provider_status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  enrolled: {
    type: Boolean,
    default: false,
  },
  course_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  avatar: {
    type: String,
    default: null, // URL ảnh đại diện, mặc định null nếu chưa có
  },
  provider_info: {
    course_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    total_students: {
      type: Number,
      default: 0,
      min: 0,
    },
    social_links: {
      type: {
        facebook: { type: String, default: null },
        twitter: { type: String, default: null },
        linkedin: { type: String, default: null },
        other: { type: String, default: null },
      },
      default: {},
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema, "Users");
