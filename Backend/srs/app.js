const express = require("express");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/payments", paymentRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

module.exports = app;
