const Message = require("../models/Message");

// Lấy tin nhắn giữa hai người
exports.getMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.params;
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort("timestamp");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy tin nhắn" });
  }
};

// Lưu tin nhắn mới
exports.sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    const newMessage = await Message.create({ sender, receiver, message });
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi gửi tin nhắn" });
  }
};
