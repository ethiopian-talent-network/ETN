// src/server.js
require("dotenv").config();
const http = require("http");
const app = require("./app"); // must exist at app.js
const connectDB = require("./config/db"); // must exist
const { Server } = require("socket.io");

// Connect to Database
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Setup WebSockets
const io = new Server(server, { cors: { origin: "*" } });
io.on("connection", (socket) => {
  console.log("⚡ A user connected via Socket.io");

  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
