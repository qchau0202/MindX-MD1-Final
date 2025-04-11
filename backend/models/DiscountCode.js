const mongoose = require("mongoose");

const DiscountCodeSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  code: { type: String, unique: true, required: true },
  discount_value: { type: Number, required: true }, // Có thể là phần trăm hoặc số tiền giảm
  expiration_date: { type: Date },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DiscountCode", DiscountCodeSchema ,"DiscountCodes");
