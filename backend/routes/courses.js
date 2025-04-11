const express = require("express");
const courseRouter = express.Router();
const courseController = require("../controllers/courseController");

// Route GET: Lấy tất cả courses
courseRouter.get("/", courseController.getAllCourses);

// Route POST: Tạo course mới
courseRouter.post("/", courseController.createCourse);

module.exports = courseRouter;
