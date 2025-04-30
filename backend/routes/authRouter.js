const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// CRUD
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/me", auth, authController.getCurrentUser);

module.exports = authRouter;
