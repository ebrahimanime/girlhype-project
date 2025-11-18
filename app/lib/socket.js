// lib/socket.js
import { Server } from "socket.io";

let io;

export function initIO(server) {
  io = new Server(server, {
    path: "/api/socket",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    socket.on("joinGroup", (groupId) => {
      socket.join(groupId);
      console.log(`📚 Socket ${socket.id} joined group: ${groupId}`);
    });

    socket.on("sendMessage", ({ groupId, message }) => {
      io.to(groupId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}
