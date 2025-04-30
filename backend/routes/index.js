const express = require("express");
const router = express.Router();

// CRUD
const usersRouter = require("./usersRouter");
const coursesRouter = require("./coursesRouter");
// const enrollmentsRouter = require("./enrollmentsRouter");
const lessonsRouter = require("./lessonsRouter");
const authRouter =  require("./authRouter");

// Root route cho /api
router.get("/", (req, res) => {
  res.send("EduPress Backend is Running");
});

router.use("/users", usersRouter); 
router.use("/courses", coursesRouter); 
// router.use("/enrollments", enrollmentsRouter);
router.use("/lessons", lessonsRouter); 
router.use("/auth", authRouter); 

module.exports = router;
