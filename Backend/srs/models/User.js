const mongoose = require("mongoose");

const baseOptions = {
  discriminatorKey: "role",
  collection: "users",
  timestamps: true,
};

// Base User Schema
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    languagePref: { type: String, enum: ["en", "amh", "orm"], default: "en" },
  },
  baseOptions
);

const User = mongoose.model("User", UserSchema);

// Talent Schema (Extends User)
const TalentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  skills: [{ type: String }],
  portfolioUrl: String,
  tokenBalance: { type: Number, default: 5 }, // ETN Token Economy
  profileVector: { type: [Number] }, // Storing AI embeddings
});
const Talent = User.discriminator("Talent", TalentSchema);

// Employer Schema (Extends User)
const EmployerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  taxId: { type: String, required: true },
  industry: String,
});
const Employer = User.discriminator("Employer", EmployerSchema);

module.exports = { User, Talent, Employer };
