const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  provider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Provider ID là bắt buộc"],
  },
  title: {
    type: String,
    required: [true, "Tiêu đề là bắt buộc"],
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
    type: mongoose.Schema.Types.Mixed,
    required: [true, "Giá là bắt buộc"],
    validate: {
      validator: function (v) {
        return v === "Free" || (typeof v === "number" && v >= 0);
      },
      message: "Giá phải là 'Free' hoặc số không âm",
    },
  },
  level: {
    type: String,
    default: "All level",
    enum: ["All level", "Beginner", "Intermediate", "Advanced"],
  },
  number_of_lessons: {
    type: Number,
    required: [true, "Số bài học là bắt buộc"],
    min: [1, "Số bài học phải lớn hơn 0"],
  },
  duration: {
    type: String,
    required: [true, "Thời lượng là bắt buộc"],
  },
  capacity: {
    type: mongoose.Schema.Types.Mixed,
    default: "unlimited",
    validate: {
      validator: function (v) {
        return v === "unlimited" || (typeof v === "number" && v > 0);
      },
      message: "Số lượng phải là 'unlimited' hoặc số dương",
    },
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null, // null khi chưa có đánh giá
  },
  location: {
    type: String,
    required: [true, "Địa điểm là bắt buộc"],
  },
  enrolled_students: {
    type: Number,
    default: 0,
    min: 0,
  },
  active_students: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ["draft", "pending", "approved", "rejected"],
    default: "draft",
  },
  image: {
    type: String,
    default: null,
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

// Middleware kiểm tra categories
CourseSchema.pre("save", async function (next) {
  if (this.categories && this.categories.length > 0) {
    const Category = mongoose.model("Category");
    const validCategories = await Category.countDocuments({
      _id: { $in: this.categories },
    });
    if (validCategories !== this.categories.length) {
      return next(new Error("Một hoặc nhiều danh mục không hợp lệ"));
    }
  }
  next();
});

// Tự động cập nhật updated_at
CourseSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updated_at: Date.now() });
  next();
});

// Thêm index
CourseSchema.index({ provider_id: 1 });
CourseSchema.index({ categories: 1 });
CourseSchema.index({ title: "text" }); // Hỗ trợ tìm kiếm

module.exports = mongoose.model("Course", CourseSchema, "Courses");
