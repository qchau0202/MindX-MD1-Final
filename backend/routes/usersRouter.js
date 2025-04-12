const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth"); // Giả định middleware xác thực

// Route GET: Lấy danh sách user
userRouter.get("/", userController.getAllUsers);

// Route POST: Tạo user mới
userRouter.post("/", userController.createUser);

// Route POST: Đăng ký khóa học
userRouter.post("/enroll", auth, userController.enrollCourse);

module.exports = userRouter;
