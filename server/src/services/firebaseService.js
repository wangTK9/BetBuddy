const { database } = require("../config/firebaseConfig");
const { ref, push, get } = require("firebase/database");

class ChatService {
  static async sendMessage(chatId, senderId, text) {
    const chatRef = ref(database, `chats/${chatId}`);
    await push(chatRef, {
      senderId,
      text,
      timestamp: Date.now(),
    });
  }

  static async getMessages(chatId) {
    const chatRef = ref(database, `chats/${chatId}`);
    const snapshot = await get(chatRef);

    if (snapshot.exists()) {
      return Object.entries(snapshot.val()).map(([id, msg]) => ({
        id,
        ...msg,
      }));
    } else {
      return [];
    }
  }
}

module.exports = ChatService;
