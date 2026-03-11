const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
    amount: { type: Number, required: true },
    txRef: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["PENDING", "HELD_IN_ESCROW", "RELEASED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
