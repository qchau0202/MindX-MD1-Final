const express = require("express");
const lessonRouter = express.Router();
const lessonController = require("../controllers/lessonController");

// Routes cho lessons
lessonRouter.get("/", lessonController.getAllLessons); // Lấy tất cả lessons
lessonRouter.post("/", lessonController.createLesson); // Tạo lesson mới

module.exports = lessonRouter;
