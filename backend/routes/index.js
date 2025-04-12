const express = require("express");
const router = express.Router();

// Import các routes con
const usersRouter = require("./usersRouter");
const coursesRouter = require("./coursesRouter");
const enrollmentsRouter = require("./enrollmentsRouter");
const lessonsRouter = require("./lessonsRouter");
const authRouter =  require("./authRouter");

// Root route cho /api
router.get("/", (req, res) => {
  res.send("EduPress Backend is Running");
});

// Sử dụng các routes con
router.use("/users", usersRouter); // Các tuyến đường cho users sẽ bắt đầu bằng /api/users
router.use("/courses", coursesRouter); // Các tuyến đường cho courses sẽ bắt đầu bằng /api/courses
router.use("/enrollments", enrollmentsRouter); // Các tuyến đường cho enrollments sẽ bắt đầu bằng /api/enrollments
router.use("/lessons", lessonsRouter); // Các tuyến đường cho lessons sẽ bắt đầu bằng /api/lessons
router.use("/auth", authRouter); // Các tuyến đường cho auth sẽ bắt đầu bằng /api/auth

module.exports = router;
