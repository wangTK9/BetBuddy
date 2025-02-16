const express = require("express");
const {
  getMessages,
  sendMessage,
} = require("../controllers/messageController");

const router = express.Router();

router.get("/:sender/:receiver", getMessages); // Lấy tin nhắn
router.post("/", sendMessage); // Gửi tin nhắn

module.exports = router;
