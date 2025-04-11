const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");

// Route GET: Lấy danh sách user
userRouter.get("/", userController.getAllUsers);

// Route POST: Tạo user mới
userRouter.post("/", userController.createUser);

module.exports = userRouter;
