const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true, unique: true },
    carerId: { type: String, required: true },
    centerId: { type: String, required: true },
    seniorId: { type: mongoose.Schema.Types.ObjectId, ref: "Senior" },
    status: { type: String, enum: ["진행", "종료"], default: "진행" },
    initiator: { type: String, enum: ["carer", "center"], required: true },
    messages: [
      {
        messageId: { type: String, required: true },
        senderId: { type: String, required: true },
        content: { type: String, required: true },
        type: {
          type: String,
          enum: ["채팅", "시스템", "전화번호공유"],
          default: "채팅",
        },
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    proposal: {
      proId: { type: String, required: true },
      proStatus: {
        type: String,
        enum: ["대기", "수락", "거절"],
        default: "대기",
      },
      proCreatedAt: { type: Date, default: Date.now },
      proRespondedAt: { type: Date },
    },
    roomCreatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
    collection: "chats",
  }
);

module.exports = mongoose.model("Chat", chatSchema);
