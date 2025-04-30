const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// CRUD
userRouter.get("/enrollments", auth, userController.getEnrollments);
userRouter.post("/enroll", auth, userController.enrollCourse);
userRouter.post("/unenroll", auth, userController.unenrollCourse);
userRouter.get(
  "/",
  auth,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Chỉ admin được phép truy cập danh sách người dùng",
      });
    }
    next();
  },
  userController.getAllUsers
);

userRouter.get(
  "/:id",
  auth,
  (req, res, next) => {
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền truy cập thông tin người dùng này",
      });
    }
    next();
  },
  userController.getUserById
);

userRouter.post(
  "/",
  auth,
  (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Chỉ admin được phép tạo người dùng mới",
      });
    }
    next();
  },
  userController.createUser
);

module.exports = userRouter;