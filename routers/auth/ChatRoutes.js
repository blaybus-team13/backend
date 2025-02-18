const express = require("express");
const router = express.Router();
const Chat = require("../../models/Chat");

// chatStart
router.post("/chatStart", (req, res) => {
  const { carerId, centerId, seniorId, initiator } = req.body;
  const newChat = new Chat({
    chatId: Date.now().toString(),
    carerId,
    centerId,
    seniorId,
    initiator,
    status: "active",
    proposal: {
      proId: Date.now().toString(),
    },
  });
  newChat
    .save()
    .then((chat) =>
      res.status(201).json({ message: "채팅방을 성공적으로 생성함" })
    )
    .catch((err) => res.status(500).json({ message: err.message }));
});

// read
// 진행 중 & 종료된 대화 구분
router.get("/list/:status", (req, res) => {
  const { status } = req.params;
  if (status !== "active" && status !== "closed") {
    return res.status(400).json({ message: "잘못된 상태값" });
  }

  Chat.find({ status })
    .then((chats) =>
      res.json({ message: "채팅 목록을 성공적으로 조회함", chats })
    )
    .catch((err) => res.status(500).json({ message: err.message }));
});

router.get("/:chatId", (req, res) => {
  Chat.findOne({ chatId: req.params.chatId })
    .then((chat) => {
      if (!chat) {
        return res.status(404).json({ message: "채팅방을 찾을 수 없음" });
      }
      res.json({ message: "채팅방을 성공적으로 조회함", chat });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
});

// update (진행 -> 종료)
router.patch("/:chatId/status", (req, res) => {
  const { status } = req.body;
  if (status !== "closed") {
    return res.status(400).json({ message: "잘못된 상태값" });
  }

  Chat.findOneAndUpdate(
    { chatId: req.params.chatId },
    { status },
    { new: true }
  )
    .then((chat) => {
      if (!chat) {
        return res.status(404).json({ message: "채팅방을 찾을 수 없음" });
      }
      res.json({ message: "채팅방 상태를 성공적으로 업데이트함" });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
});

// proposal update
router.patch("/:chatId/proposal", (req, res) => {
  const { proStatus } = req.body;
  Chat.findOneAndUpdate(
    { chatId: req.params.chatId },
    {
      "proposal.proStatus": proStatus,
      "proposal.proRespondedAt":
        proStatus !== "pending" ? new Date() : undefined,
    },
    { new: true }
  )
    .then((chat) => {
      if (!chat) {
        return res.status(404).json({ message: "채팅방을 찾을 수 없음" });
      }
      res.json({ message: "제안 상태가 성공적으로 업데이트됨" });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
});

// 메시지
router.post("/:chatId/message", async (req, res) => {
  try {
    const { chatId } = req.params;
    const { senderId, content, type } = req.body;

    const chat = await Chat.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({ message: "채팅방을 찾을 수 없음" });
    }

    const newMessage = {
      messageId: Date.now().toString(),
      senderId,
      content,
      type,
      isRead: false,
      createdAt: new Date(),
    };

    chat.messages.push(newMessage);
    await chat.save();

    res.status(201).json({ message: "메시지가 성공적으로 추가됨" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
