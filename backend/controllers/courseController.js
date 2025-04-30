const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, level, search } = req.query;
    const query = {};

    if (category) query.categories = category;
    if (level) query.level = level;
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const courses = await Course.find(query)
      .populate("categories", "name")
      .populate("provider_id", "name")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: courses,
      pagination: { page, limit, total },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("categories", "name")
      .populate("provider_id", "name");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({ success: true, data: course });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// Get courses of provider
const getProviderCourses = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "provider") {
      return res.status(403).json({
        success: false,
        message: "Only providers can access this route",
      });
    }

    const courses = await Course.find({ provider_id: user._id })
      .populate("categories", "name")
      .populate("provider_id", "name");

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// Create new course
const createCourse = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "provider") {
      return res.status(403).json({
        success: false,
        message: "Only providers can create courses",
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
      status,
    } = req.body;

    // Validation
    if (!title || !price || !number_of_lessons || !duration || !location) {
      return res.status(400).json({
        success: false,
        message:
          "Fields are required: title, price, number_of_lessons, duration, location",
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
      enrolled_students: 0,
      rating: null,
      status: status || "draft",
    };

    const course = new Course(courseData);
    const saved = await course.save();

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
      message: "Error creating course: " + error.message,
    });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "provider") {
      return res.status(403).json({
        success: false,
        message: "Only providers can update courses",
      });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.provider_id.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this course",
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
      message: "Error updating course: " + error.message,
    });
  }
};

// Get category counts
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
      message: "Server error: " + error.message,
    });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  getProviderCourses,
  createCourse,
  updateCourse,
  getCategoryCounts,
};