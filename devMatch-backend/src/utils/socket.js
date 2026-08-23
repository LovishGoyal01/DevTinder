const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  const id1 = String(userId);
  const id2 = String(targetUserId);
  return crypto.createHash("sha256").update([id1, id2].sort().join("_")).digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: ["http://localhost:5173", process.env.Frontend_URL],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      if (!userId || !targetUserId) return;

      const roomId = getSecretRoomId(userId, targetUserId);

      // Leave all previous rooms except socket.id to prevent cross-room leaks
      const activeRooms = Array.from(socket.rooms);
      for (const room of activeRooms) {
        if (room !== socket.id) {
          socket.leave(room);
        }
      }
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text }) => {
      if (!userId || !targetUserId || !text || !text.trim()) return;

      try {
        const roomId = getSecretRoomId(userId, targetUserId);

        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId], $size: 2 },
        });

        if (!chat) {
          chat = new Chat({ participants: [userId, targetUserId], messages: [] });
        }

        const trimmedText = text.trim();
        chat.messages.push({ senderId: userId, text: trimmedText });

        await chat.save();

        const savedMessage = chat.messages[chat.messages.length - 1];

        io.to(roomId).emit("messageReceived", {
          _id: savedMessage ? savedMessage._id : undefined,
          senderId: userId,
          targetUserId: targetUserId,
          firstName,
          lastName,
          text: trimmedText,
          createdAt: savedMessage ? savedMessage.createdAt : new Date(),
        });
      } catch (error) {
        console.error("ERROR in sendMessage socket:", error.message);
      }
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;