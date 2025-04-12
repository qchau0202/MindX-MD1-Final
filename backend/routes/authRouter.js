const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// POST /api/auth/register
authRouter.post("/register", authController.register);

// POST /api/auth/login
authRouter.post("/login", authController.login);

// GET /api/auth/me
authRouter.get("/me", auth, authController.getCurrentUser);

module.exports = authRouter;
