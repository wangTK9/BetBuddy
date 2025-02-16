<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>Chat với {{ receiver }}</h2>
    </div>

    <div class="chat-messages" ref="chatMessages">
      <div
        v-for="msg in messages"
        :key="msg._id"
        :class="msg.sender === userId ? 'sent' : 'received'"
      >
        <p>{{ msg.message }}</p>
      </div>
    </div>

    <div class="chat-input">
      <input
        v-model="message"
        placeholder="Nhập tin nhắn..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage" :disabled="isSending">Gửi</button>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import axios from "axios";

export default {
  props: ["userId", "receiver"],
  data() {
    return {
      message: "",
      messages: [],
      socket: null,
      backendUrl: "http://localhost:5000", // Cập nhật URL của backend
      isSending: false,
    };
  },
  async created() {
  this.socket = io(this.backendUrl);

  // Xác nhận kết nối thành công với server WebSocket
  this.socket.on("connect", () => {
    console.log("Connected to socket server with id:", this.socket.id);
  });

  // Gửi userId lên server khi kết nối
  this.socket.emit("join", this.userId);

  // Nhận tin nhắn theo thời gian thực
  this.socket.on("receiveMessage", (msg) => {
    // Kiểm tra tin nhắn hợp lệ (sender và receiver đúng)
    if (
      (msg.sender === this.receiver && msg.receiver === this.userId) ||
      (msg.sender === this.userId && msg.receiver === this.receiver)
    ) {
      // Tránh việc nhận tin nhắn trùng lặp
      if (!this.messages.find(m => m._id === msg._id)) {
        this.messages.push(msg); // Thêm tin nhắn vào danh sách
        this.$nextTick(this.scrollToBottom); // Cuộn đến cuối khi nhận tin nhắn mới
      }
    }
  });

  // Tải các tin nhắn cũ
  await this.loadMessages();
},

    methods: {
    async loadMessages() {
      try {
        const res = await axios.get(
          `${this.backendUrl}/messages/${this.userId}/${this.receiver}`
        );
        this.messages = res.data;
        this.$nextTick(() => {
          this.scrollToBottom(); // Cuộn đến cuối khi tải tin nhắn
        });
      } catch (error) {
        console.error("Lỗi tải tin nhắn:", error);
      }
    },
    async sendMessage() {
      if (!this.message.trim() || this.isSending) return;

      this.isSending = true; // Đánh dấu là đang gửi tin nhắn

      const newMsg = {
        sender: this.userId,
        receiver: this.receiver,
        message: this.message.trim(),
      };

      try {
        // Gửi tin nhắn vào backend (Lưu vào database)
        await axios.post(`${this.backendUrl}/messages`, newMsg);

        // Gửi tin nhắn qua socket cho người nhận
        this.socket.emit("sendMessage", newMsg);

        // Thêm tin nhắn vào danh sách và làm trống ô nhập
        this.messages.push(newMsg);
        this.message = ""; // Reset input
        this.$nextTick(() => {
          this.scrollToBottom(); // Cuộn xuống cuối khi gửi tin nhắn
        });
      } catch (error) {
        console.error("Lỗi gửi tin nhắn:", error);
      } finally {
        this.isSending = false; // Đánh dấu là đã gửi xong
      }
    },
  },
};
</script>

<style>
.chat-container {
  width: 300px;
  height: 400px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.chat-header {
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.sent {
  text-align: right;
  color: blue;
}

.received {
  text-align: left;
  color: green;
}

.chat-input {
  display: flex;
  gap: 5px;
}

.chat-input input {
  flex: 1;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.chat-input button {
  padding: 5px;
  border: 1px solid #ddd;
  background-color: #0071c2;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.chat-input button:hover {
  background-color: #005a99;
}
</style>
