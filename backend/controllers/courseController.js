const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");

// Lấy tất cả courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("categories", "name")
      .populate("provider_id", "name");
    return res.status(200).json({ success: true, data: courses });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

// Lấy khóa học theo ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("categories", "name")
      .populate("provider_id", "name");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Khóa học không tồn tại",
      });
    }
    return res.status(200).json({ success: true, data: course });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

// Tạo course mới
const createCourse = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "provider") {
      return res.status(403).json({
        success: false,
        message: "Chỉ provider được tạo khóa học",
      });
    }

    const {
      title,
      description,
      categories,
      price,
      level,
      number_of_lessons,
      duration,
      capacity,
      location,
    } = req.body;

    // Validation cơ bản
    if (!title || !price || !number_of_lessons || !duration || !location) {
      return res.status(400).json({
        success: false,
        message:
          "Thiếu các trường bắt buộc: title, price, number_of_lessons, duration, location",
      });
    }

    const courseData = {
      provider_id: user._id,
      title,
      description,
      categories,
      price,
      level: level || "All level",
      number_of_lessons,
      duration,
      capacity: capacity || "unlimited",
      location,
      enrolled_students: 0, // Khởi tạo
      rating: null,
    };

    const course = new Course(courseData);
    const saved = await course.save();

    // Cập nhật course_count của provider
    await User.findByIdAndUpdate(user._id, {
      $inc: { "provider_info.course_count": 1 },
    });

    const populated = await Course.findById(saved._id)
      .populate("categories", "name")
      .populate("provider_id", "name");
    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }
    return res.status(500).json({
      success: false,
      message: "Lỗi khi tạo course: " + error.message,
    });
  }
};

// Cập nhật khóa học
const updateCourse = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "provider") {
      return res.status(403).json({
        success: false,
        message: "Chỉ provider được cập nhật khóa học",
      });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Khóa học không tồn tại",
      });
    }

    if (course.provider_id.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền cập nhật khóa học này",
      });
    }

    const {
      title,
      description,
      categories,
      price,
      level,
      number_of_lessons,
      duration,
      capacity,
      location,
      enrolled_students,
    } = req.body;

    const updatedData = {
      title: title || course.title,
      description: description !== undefined ? description : course.description,
      categories: categories || course.categories,
      price: price !== undefined ? price : course.price,
      level: level || course.level,
      number_of_lessons: number_of_lessons || course.number_of_lessons,
      duration: duration || course.duration,
      capacity: capacity !== undefined ? capacity : course.capacity,
      location: location || course.location,
      enrolled_students:
        enrolled_students !== undefined
          ? enrolled_students
          : course.enrolled_students,
      updated_at: Date.now(),
    };

    const updated = await Course.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    })
      .populate("categories", "name")
      .populate("provider_id", "name");

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }
    return res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật course: " + error.message,
    });
  }
};

// Lấy số lượng khóa học theo danh mục
const getCategoryCounts = async (req, res) => {
  try {
    const counts = await Course.aggregate([
      { $unwind: "$categories" },
      {
        $group: {
          _id: "$categories",
          courseCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "Categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: "$category._id",
          name: "$category.name",
          courseCount: 1,
        },
      },
    ]);
    return res.status(200).json({ success: true, data: counts });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi server: " + error.message,
    });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  getCategoryCounts,
};
