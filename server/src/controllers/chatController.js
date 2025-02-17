const ChatService = require("../services/firebaseService");

exports.sendMessage = async (req, res) => {
  try {
    const { chatId, senderId, text } = req.body;
    if (!chatId || !senderId || !text) {
      return res.status(400).json({ error: "Thiếu dữ liệu" });
    }

    await ChatService.sendMessage(chatId, senderId, text);
    return res.status(200).json({ message: "Gửi tin nhắn thành công" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    if (!chatId) {
      return res.status(400).json({ error: "Thiếu chatId" });
    }

    const messages = await ChatService.getMessages(chatId);
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
