/**
 * Video signaling server
 * Handles WebRTC offers, answers, and ICE candidates
 */

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

const rooms = {}; // { roomId: [ socketIds ] }

io.on("connection", (socket) => {
  console.log("Video signaling connected:", socket.id);

  /** Join a room */
  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId].push(socket.id);

    // Notify existing participants
    socket.to(roomId).emit("userJoined", { userId: socket.id });
    console.log(`${socket.id} joined video room ${roomId}`);
  });

  /** Forward offer */
  socket.on("offer", ({ to, offer }) => {
    io.to(to).emit("offer", { from: socket.id, offer });
  });

  /** Forward answer */
  socket.on("answer", ({ to, answer }) => {
    io.to(to).emit("answer", { from: socket.id, answer });
  });

  /** Forward ICE candidates */
  socket.on("iceCandidate", ({ to, candidate }) => {
    io.to(to).emit("iceCandidate", { from: socket.id, candidate });
  });

  /** Leave room */
  socket.on("leaveRoom", ({ roomId }) => {
    socket.leave(roomId);
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
      socket.to(roomId).emit("userLeft", { userId: socket.id });
    }
  });

  socket.on("disconnect", () => {
    console.log("Video signaling disconnected:", socket.id);
    for (const roomId in rooms) {
      if (rooms[roomId].includes(socket.id)) {
        rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
        socket.to(roomId).emit("userLeft", { userId: socket.id });
      }
    }
  });
});

const PORT = process.env.PORT || 6000;
server.listen(PORT, () => console.log(`🎥 Video signaling server running on port ${PORT}`));
