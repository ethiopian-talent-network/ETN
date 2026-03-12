const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Employer is a discriminator of User
      required: true,
    },
    skillsRequired: [{ type: String }],
    status: {
      type: String,
      enum: ["Open", "In Progress", "Completed", "Cancelled"],
      default: "Open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
