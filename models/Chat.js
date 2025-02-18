const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true, unique: true },
    carerId: { type: String, required: true },
    centerId: { type: String, required: true },
    seniorId: { type: mongoose.Schema.Types.ObjectId, ref: "Senior" },
    status: { type: String, enum: ["active", "closed"], default: "active" },
    initiator: { type: String, enum: ["carer", "center"], required: true },
    messages: [
      {
        messageId: { type: String, required: true },
        senderId: { type: String, required: true },
        content: { type: String, required: true },
        type: {
          type: String,
          enum: ["chat", "system", "phoneNumberShared"],
          default: "chat",
        },
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    proposal: {
      proId: { type: String, required: true },
      proStatus: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
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
