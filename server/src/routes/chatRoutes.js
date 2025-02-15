const express = require("express");
const { saveMessage, getMessages } = require("../controllers/chatController");

const router = express.Router();

// Route để lưu tin nhắn
router.post("/send", saveMessage);

// Route để lấy danh sách tin nhắn
router.get("/messages", getMessages);

module.exports = router;
