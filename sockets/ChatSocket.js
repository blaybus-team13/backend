const socketIo = require("socket.io");
const Chat = require("../models/Chat");

function setupChatSocket(server) {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on(
      "joinRoom",
      async ({ chatId, participantType, participantId }) => {
        const chat = await Chat.findOne({ chatId });
        if (!chat) {
          socket.emit("error", { message: "채팅없음" });
          return;
        }

        if (
          (participantType === "carer" && participantId !== chat.carerId) ||
          (participantType === "center" && participantId !== chat.centerId)
        ) {
          socket.emit("error", {
            message: "요양보호사, 센터 둘 다 아닌 참가자가 join함",
          });
          return;
        }

        socket.join(chatId);
        console.log(
          `${participantType} ${participantId} joined chat ${chatId}`
        );
      }
    );

    socket.on("sendMessage", async ({ chatId, senderId, content, type }) => {
      const chat = await Chat.findOne({ chatId });
      if (!chat) {
        socket.emit("error", { message: "채팅없음" });
        return;
      }

      const senderType = senderId === chat.carerId ? "carer" : "center";
      const newMessage = {
        messageId: Date.now().toString(),
        senderId,
        content,
        type: type || "chat",
        isRead: false,
        createdAt: new Date(),
      };

      chat.messages.push(newMessage);
      await chat.save();

      io.to(chatId).emit("newMessage", { ...newMessage, senderType });
    });

    socket.on("markAsRead", async ({ chatId, messageIds, readerId }) => {
      const chat = await Chat.findOne({ chatId });
      if (!chat) {
        socket.emit("error", { message: "채팅없음" });
        return;
      }

      chat.messages.forEach((msg) => {
        if (messageIds.includes(msg.messageId) && msg.senderId !== readerId) {
          msg.isRead = true;
        }
      });

      await chat.save();
      io.to(chatId).emit("messagesRead", { messageIds, readerId });
    });

    socket.on("sendProposal", async ({ chatId, proId }) => {
      const chat = await Chat.findOne({ chatId });
      if (!chat) {
        socket.emit("error", { message: "채팅없음" });
        return;
      }

      chat.proposal = {
        proId,
        proStatus: "pending",
        proCreatedAt: new Date(),
      };

      await chat.save();
      io.to(chatId).emit("newProposal", chat.proposal);
    });

    socket.on("respondToProposal", async ({ chatId, response }) => {
      const chat = await Chat.findOne({ chatId });
      if (!chat) {
        socket.emit("error", { message: "채팅없음" });
        return;
      }

      chat.proposal.proStatus = response;
      chat.proposal.proRespondedAt = new Date();

      await chat.save();
      io.to(chatId).emit("proposalResponse", chat.proposal);
    });

    socket.on("endChat", async ({ chatId }) => {
      const chat = await Chat.findOne({ chatId });
      if (!chat) {
        socket.emit("error", { message: "채팅없음" });
        return;
      }

      chat.status = "closed";
      await chat.save();
      io.to(chatId).emit("chatEnded", { chatId });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
}

module.exports = setupChatSocket;
