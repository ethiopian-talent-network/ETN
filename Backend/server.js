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
const Message = require("./srs/models/Message");

io.on("connection", (socket) => {
  console.log("⚡ A user connected via Socket.io");

  // User joins their personal room
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("sendMessage", async (data) => {
    const { sender, receiver, text } = data;
    try {
       // Save to DB
       const newMessage = await Message.create({ sender, receiver, text });
       
       // Emit to receiver's room and sender's room
       io.to(receiver).emit("receiveMessage", newMessage);
       io.to(sender).emit("receiveMessage", newMessage);
    } catch (err) {
       console.error("Socket emit error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
