const express = require("express");
const lessonRouter = express.Router();
const lessonController = require("../controllers/lessonController");

// CRUD
lessonRouter.get("/", lessonController.getAllLessons);
lessonRouter.post("/", lessonController.createLesson);

module.exports = lessonRouter;
