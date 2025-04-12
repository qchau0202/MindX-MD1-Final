const express = require("express");
const enrollmentRouter = express.Router();
const enrollmentController = require("../controllers/enrollmentController");

// Routes cho enrollments
enrollmentRouter.get("/", enrollmentController.getAllEnrollments); // Lấy tất cả enrollments
enrollmentRouter.post("/", enrollmentController.createEnrollment); // Tạo enrollment mới

module.exports = enrollmentRouter;
