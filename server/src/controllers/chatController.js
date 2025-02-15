const Chat = require("../models/ChatMessage");

// 📨 Lưu tin nhắn vào database
exports.saveMessage = async (req, res) => {
  try {
    const { sender, message } = req.body;
    const newMessage = new Chat({ sender, message });
    await newMessage.save();
    res.status(201).json({ success: true, message: "Tin nhắn đã được lưu" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📩 Lấy tất cả tin nhắn từ database
exports.getMessages = async (req, res) => {
  try {
    const messages = await Chat.find().sort({ timestamp: 1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
