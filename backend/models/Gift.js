const mongoose = require("mongoose");

const GiftSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  description: { type: String },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Gift", GiftSchema, "Gifts");
