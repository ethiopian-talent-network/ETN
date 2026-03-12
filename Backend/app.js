const express = require("express");
const cors = require("cors");

// Import Routes
const authRoutes = require("./srs/routes/authRoutes");
const aiRoutes = require("./srs/routes/aiRoutes");
const jobRoutes = require("./srs/routes/jobRoutes");
const userRoutes = require("./srs/routes/userRoutes");
const networkRoutes = require("./srs/routes/networkRoutes");
const messageRoutes = require("./srs/routes/messageRoutes");
// const paymentRoutes = require("./srs/routes/paymentRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/network", networkRoutes);
app.use("/api/messages", messageRoutes);
// app.use("/api/payments", paymentRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

console.log("authRoutes:", authRoutes);               
console.log("aiRoutes:", aiRoutes);

module.exports = app;
