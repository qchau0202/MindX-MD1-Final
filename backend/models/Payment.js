const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  enrollment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enrollment",
    required: true,
  },
  amount: { type: Number, required: true },
  payment_date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["completed", "pending", "failed"],
    default: "pending",
  },
});

module.exports = mongoose.model("Payment", PaymentSchema, "Payments");
