const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("Auth middleware - Token:", token); // Debug
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Vui lòng cung cấp token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Auth middleware - Decoded:", decoded); // Debug
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware - Error:", error);
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ",
    });
  }
};

module.exports = auth;
