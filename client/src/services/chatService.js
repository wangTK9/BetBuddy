import axios from "axios";

const API_URL = "http://localhost:5000/api/chat";

class ChatService {
  static async sendMessage(chatId, senderId, text) {
    return axios.post(`${API_URL}/send`, { chatId, senderId, text });
  }

  static async getMessages(chatId) {
    return axios.get(`${API_URL}/${chatId}`);
  }
}

export default ChatService;
