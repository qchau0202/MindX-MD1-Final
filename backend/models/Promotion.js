const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  name: { type: String },
  description: { type: String },
  start_date: { type: Date },
  end_date: { type: Date },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Promotion", PromotionSchema, "Promotions");
