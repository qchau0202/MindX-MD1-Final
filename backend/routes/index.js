const express = require("express");
const router = express.Router();

// Import các routes con
const userRoutes = require("./users");
const courseRoutes = require("./courses");
const enrollmentRoutes = require("./enrollments");
const lessonRoutes = require("./lessons");

// Root route cho /api
router.get("/", (req, res) => {
  res.send("EduPress Backend is Running");
});

// Sử dụng các routes con
router.use("/users", userRoutes); // Các tuyến đường cho users sẽ bắt đầu bằng /api/users
router.use("/courses", courseRoutes); // Các tuyến đường cho courses sẽ bắt đầu bằng /api/courses
router.use("/enrollments", enrollmentRoutes); // Các tuyến đường cho enrollments sẽ bắt đầu bằng /api/enrollments
router.use("/lessons", lessonRoutes); // Các tuyến đường cho lessons sẽ bắt đầu bằng /api/lessons


module.exports = router;
