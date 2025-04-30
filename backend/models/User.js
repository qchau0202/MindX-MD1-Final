// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     unique: true,
//     required: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   name: {
//     type: String,
//   },
//   phone: {
//     type: String,
//   },
//   address: {
//     type: String,
//   },
//   role: {
//     type: String,
//     enum: ["admin", "customer", "provider"],
//     required: true,
//   },
//   provider_status: {
//     type: String,
//     enum: ["pending", "approved", "rejected"],
//     default: "pending",
//   },
//   enrolled: {
//     type: Boolean,
//     default: false,
//   },
//   course_id: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Course",
//     },
//   ],
//   avatar: {
//     type: String,
//     default: null, // URL ảnh đại diện, mặc định null nếu chưa có
//   },
//   provider_info: {
//     course_count: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//     total_students: {
//       type: Number,
//       default: 0,
//       min: 0,
//     },
//     social_links: {
//       type: {
//         facebook: { type: String, default: null },
//         twitter: { type: String, default: null },
//         linkedin: { type: String, default: null },
//         other: { type: String, default: null },
//       },
//       default: {},
//     },
//   },
//   created_at: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("User", UserSchema, "Users");

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Email là bắt buộc"],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email không hợp lệ"], // Kiểm tra định dạng
  },
  password: {
    type: String,
    required: [true, "Mật khẩu là bắt buộc"],
  },
  name: {
    type: String,
    default: "", // Mặc định rỗng để tránh null
  },
  role: {
    type: String,
    enum: ["admin", "customer", "provider"],
    default: "customer", // Mặc định là customer khi đăng ký
    required: [true, "Vai trò là bắt buộc"],
  },
  phone: {
    type: String,
    match: [/^(\+\d{1,3}[- ]?)?\d{10}$/, "Số điện thoại không hợp lệ"], // Ví dụ: +84 hoặc 10 số
    default: null, // Chỉ áp dụng cho customer/provider
  },
  address: {
    type: String,
    default: null, // Chỉ áp dụng cho customer/provider
  },
  avatar: {
    type: String,
    default: null, // Chỉ áp dụng cho customer/provider
  },
  provider_info: {
    // Chỉ áp dụng cho provider
    course_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    total_students: {
      type: Number,
      default: 0,
      min: 0,
    },
    social_links: {
      type: {
        facebook: { type: String, default: null },
        twitter: { type: String, default: null },
        linkedin: { type: String, default: null },
        other: { type: String, default: null },
      },
      default: {}, // Mặc định rỗng
    },
  },
  provider_status: {
    // Chỉ áp dụng cho provider
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  provider_request_status: {
    // Theo dõi yêu cầu trở thành provider
    type: String,
    enum: ["requested", "denied"],
    default: null, // null nếu chưa yêu cầu
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Thêm logic để bỏ provider_info và provider_status cho admin/customer
UserSchema.pre("save", function (next) {
  if (this.role !== "provider") {
    this.provider_info = undefined;
    this.provider_status = undefined;
  }
  if (this.role !== "customer") {
    this.provider_request_status = undefined; // Chỉ customer có thể yêu cầu
  }
  if (this.role === "admin") {
    this.phone = undefined;
    this.address = undefined;
    this.avatar = undefined; // Admin không cần các field này
  }
  next();
});

// Thêm index
// UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });

module.exports = mongoose.model("User", UserSchema, "Users");
