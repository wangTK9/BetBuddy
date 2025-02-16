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
      backendUrl: "http://localhost:5000",
      isSending: false,
    };
  },
  async created() {
    this.socket = io(this.backendUrl);

    this.socket.on("connect", () => {
      console.log("✅ WebSocket đã kết nối:", this.socket.id);
    });

    this.socket.on("disconnect", () => {
      console.log("❌ WebSocket bị mất kết nối!");
    });

    this.socket.on("receiveMessage", (msg) => {
      console.log("Nhận tin nhắn qua socket:", msg);
      const messageExists = this.messages.some((m) => m._id === msg._id);
      if (!messageExists) {
        this.messages = [...this.messages, msg];
        this.$nextTick(this.scrollToBottom);
      }
    });

    await this.loadMessages();
  },

  methods: {
    scrollToBottom() {
      this.$nextTick(() => {
        const chatMessages = this.$refs.chatMessages;
        if (chatMessages) {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      });
    },

    async loadMessages() {
      try {
        const res = await axios.get(
          `${this.backendUrl}/messages/${this.userId}/${this.receiver}`
        );
        this.messages = res.data;
        console.log("📜 Tin nhắn đã tải:", this.messages);
        this.$nextTick(this.scrollToBottom);
      } catch (error) {
        console.error("Lỗi tải tin nhắn:", error);
      }
    },

    async sendMessage() {
      if (!this.message.trim() || this.isSending) return;
      this.isSending = true;

      const newMsg = {
        sender: this.userId,
        receiver: this.receiver,
        message: this.message.trim(),
      };

      try {
        const response = await axios.post(`${this.backendUrl}/messages`, newMsg);
        newMsg._id = response.data._id;
        console.log("📤 Gửi tin nhắn:", newMsg);

        this.socket.emit("sendMessage", newMsg);
        this.messages = [...this.messages, newMsg];
        this.message = "";
        this.$nextTick(this.scrollToBottom);
      } catch (error) {
        console.error("❌ Lỗi gửi tin nhắn:", error);
      } finally {
        this.isSending = false;
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
