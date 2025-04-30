const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error retrieving users:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
}

// Tạo user mới
const createUser = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      phone,
      address,
      role,
      provider_status,
      avatar,
      enrolled,
      course_id,
      provider_info,
    } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Fields are required: email, password, role",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      email,
      password: hashedPassword,
      name,
      phone,
      address,
      role,
      provider_status:
        role === "provider" ? provider_status || "pending" : "pending",
      avatar: avatar || null,
      enrolled: enrolled || false,
      course_id: course_id || [],
      provider_info: provider_info || {
        course_count: 0,
        total_students: 0,
        social_links: {},
      },
      created_at: new Date(),
    };

    const newUser = new User(userData);
    const savedUser = await newUser.save();
    return res.status(201).json({ success: true, data: savedUser });
  } catch (error) {
    console.error("Error creating user:", error);
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
      message: "Error creating user: " + error.message,
    });
  }
};

// Enroll course
const enrollCourse = async (req, res) => {
  try {
    const user = req.user;
    const { course_id } = req.body;

    console.log("Enroll request:", { user, course_id });

    // Check login
    if (!user || !user.id) {
      return res.status(401).json({
        success: false,
        message: "Login session is invalid",
      });
    }

    // Check user data
    const userData = await User.findById(user.id);
    console.log("User found:", userData);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check course existence
    if (!mongoose.Types.ObjectId.isValid(course_id)) {
      return res.status(400).json({
        success: false,
        message: "ID course is invalid",
      });
    }
    const course = await Course.findById(course_id);
    console.log("Course found:", course);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check enrollment existence
    let enrollment = await Enrollment.findOne({
      customer_id: user.id,
      course_id,
    });

    if (enrollment) {
      if (enrollment.enrolled_status) {
        return res.status(400).json({
          success: false,
          message: "You have already enrolled in this course",
        });
      } else {
        enrollment.enrolled_status = true;
        enrollment.enrollment_date = new Date();
        enrollment.unenrollment_date = null;
        await enrollment.save();
        console.log("Enrollment reactivated:", enrollment);
      }
    } else {
      enrollment = new Enrollment({
        customer_id: user.id,
        course_id,
        enrollment_date: new Date(),
        enrolled_status: true,
        unenrollment_date: null,
      });
      await enrollment.save();
      console.log("Enrollment created:", enrollment);
    }
    if (!userData.course_id.includes(course_id)) {
      userData.course_id.push(course_id);
      userData.enrolled = true;
      await userData.save();
      console.log("User updated:", userData);
    }

    course.enrolled_students = (course.enrolled_students || 0) + 1;
    course.active_students = (course.active_students || 0) + 1;
    await course.save();
    console.log("Course updated:", course);

    if (course.provider_id) {
      const provider = await User.findById(course.provider_id);
      if (provider && provider.role === "provider") {
        const providerCourses = await Course.find(
          { provider_id: course.provider_id },
          { _id: 1 }
        );
        const courseIds = providerCourses.map((c) => c._id);
        console.log("Provider courses:", courseIds);

        const distinctStudents = await Enrollment.distinct("customer_id", {
          course_id: { $in: courseIds },
          enrolled_status: true,
        });
        provider.provider_info.total_students = distinctStudents.length;
        provider.provider_info.course_count = providerCourses.length;
        await provider.save();
        console.log("Provider updated:", provider);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Enrolled in course successfully",
      data: { user: userData, course, enrollment },
    });
  } catch (error) {
    console.error("Error enrolling course:", {
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      message: `Error enroll course: ${error.message}`,
    });
  }
};

// Unenroll course
const unenrollCourse = async (req, res) => {
  try {
    const user = req.user;
    const { course_id } = req.body;

    console.log("Unenroll request:", { user, course_id });

    if (!user || !user.id) {
      return res.status(401).json({
        success: false,
        message: "Login session is invalid",
      });
    }

    // Check user existence
    const userData = await User.findById(user.id);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log("User found:", userData._id);

    // Check course existence
    if (!mongoose.Types.ObjectId.isValid(course_id)) {
      return res.status(400).json({
        success: false,
        message: "Course ID is invalid",
      });
    }
    const course = await Course.findById(course_id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    console.log("Course found:", course._id);

    const enrollment = await Enrollment.findOne({
      customer_id: user.id,
      course_id,
      enrolled_status: true,
    });
    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: "You have not enrolled in this course or cancelled before",
      });
    }
    console.log("Enrollment found:", enrollment._id);

    enrollment.enrolled_status = false;
    enrollment.unenrollment_date = new Date();
    await enrollment.save();
    console.log("Enrollment updated:", enrollment);

    userData.course_id = userData.course_id.filter(
      (id) => id.toString() !== course_id.toString()
    );
    userData.enrolled = userData.course_id.length > 0;
    await userData.save();
    console.log("User data updated:", userData);

    course.enrolled_students = Math.max((course.enrolled_students || 0) - 1, 0);
    course.active_students = Math.max((course.active_students || 0) - 1, 0);
    await course.save();
    console.log("Course updated:", course);

    if (course.provider_id) {
      const provider = await User.findById(course.provider_id);
      if (provider && provider.role === "provider") {
        const providerCourses = await Course.find(
          { provider_id: course.provider_id },
          { _id: 1 }
        );
        const courseIds = providerCourses.map((c) => c._id);
        console.log("Provider courses:", courseIds);

        const distinctStudents = await Enrollment.distinct("customer_id", {
          course_id: { $in: courseIds },
          enrolled_status: true,
        });
        console.log("Distinct students:", distinctStudents);

        provider.provider_info.total_students = distinctStudents.length;
        await provider.save();
        console.log("Provider updated:", provider._id);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Unenrolled from course successfully",
    });
  } catch (error) {
    console.error("Error unenrolling course:", {
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      message: `Error unenroll course: ${error.message}`,
    });
  }
};

// Get enrollments
const getEnrollments = async (req, res) => {
  try {
    const user = req.user;
    console.log("req.user in getEnrollments:", user);
    if (!user || !user.id) {
      return res.status(401).json({
        success: false,
        message: "Login session is invalid",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(user.id)) {
      return res.status(400).json({
        success: false,
        message: "User ID is invalid",
      });
    }

    const enrollments = await Enrollment.find({
      customer_id: user.id,
      enrolled_status: true, // Chỉ lấy các bản ghi đang active
    })
      .populate("course_id", "title image")
      .populate("customer_id", "name email");

    if (!enrollments || enrollments.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No enrollments found",
      });
    }

    console.log("Enrollments found:", enrollments);
    return res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    console.error("Error retrieving enrollments:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching data: " + error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getEnrollments,
  createUser,
  enrollCourse,
  unenrollCourse,
};