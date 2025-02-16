<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>Chat với {{ receiver }}</h2>
    </div>

    <div class="chat-messages">
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
      <button @click="sendMessage">Gửi</button>
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
      backendUrl: "http://localhost:5000",
    };
  },
  async created() {
    this.socket = io(this.backendUrl);

    this.socket.emit("join", this.userId);

    this.socket.on("receiveMessage", (msg) => {
      if (msg.sender === this.receiver || msg.receiver === this.receiver) {
        this.messages.push(msg);
      }
    });

    await this.loadMessages();
  },
  methods: {
    async loadMessages() {
      try {
        const res = await axios.get(
          `${this.backendUrl}/messages/${this.userId}/${this.receiver}`
        );
        this.messages = res.data;
      } catch (error) {
        console.error("Lỗi tải tin nhắn:", error);
      }
    },
    async sendMessage() {
      if (!this.message.trim()) return;

      const newMsg = {
        sender: this.userId,
        receiver: this.receiver,
        message: this.message.trim(),
      };

      try {
        // Gửi tin nhắn lên server
        await axios.post(`${this.backendUrl}/messages`, newMsg);

        // Cập nhật UI
        this.messages.push(newMsg);
        this.message = "";
      } catch (error) {
        console.error("Lỗi gửi tin nhắn:", error);
      }
    },
  },
};
</script>

<style>
.chat-container {
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  background: #fff;
}
.chat-header {
  text-align: center;
  font-weight: bold;
}
.chat-messages {
  height: 300px;
  overflow-y: auto;
  padding: 10px;
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
}
.chat-input button {
  padding: 5px;
}
</style>
