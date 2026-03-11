require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { Server } = require("socket.io");

// Connect to Database
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Setup WebSockets (Socket.io) for Messaging
const io = new Server(server, { cors: { origin: "*" } });
io.on("connection", (socket) => {
  console.log("⚡ A user connected to ETN Network via Socket");

  socket.on("sendMessage", (data) => {
    // Handle peer-to-peer messaging
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 ETN Server running on port ${PORT}`));
