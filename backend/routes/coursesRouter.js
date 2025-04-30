const express = require("express");
const courseRouter = express.Router();
const courseController = require("../controllers/courseController");

// CRUD
courseRouter.get("/", courseController.getAllCourses);
courseRouter.get("/category-counts", courseController.getCategoryCounts);
courseRouter.get("/:id", courseController.getCourseById);
courseRouter.post("/provider/create", courseController.createCourse);
courseRouter.put("/:id", courseController.updateCourse);


module.exports = courseRouter;