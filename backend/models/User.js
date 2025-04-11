const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String },
  phone: { type: String },
  address: { type: String },
  role: {
    type: String,
    enum: ["admin", "customer", "provider"],
    required: true,
  },
  // Nếu là provider, ta có thêm trạng thái đăng ký provider
  provider_status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema, "Users");
