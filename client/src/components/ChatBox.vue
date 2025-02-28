<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>
        {{
          receiver && receiver.length > 20
            ? receiver.substring(0, 20) + "..."
            : receiver || "Người dùng"
        }}
      </h2>
      <div class="icons">
        <i class="fas fa-phone icon"></i>
        <i class="fas fa-video icon"></i>
        <i class="fas fa-user icon"></i>
        <i class="fas fa-ellipsis-h icon"></i>
      </div>
    </div>

    <div class="chat-messages">
      <div
        v-for="msg in messages"
        :key="msg._id"
        :class="msg.sender === userId ? 'sent' : 'received'"
      >
        <div v-if="searchedUser" class="searched-user" @click="selectUser(searchedUser)">
          <img
            :src="'/avatar-trang-4.jpg'"
            :alt="searchedUser.fullName"
            class="searched-user-avatar"
          />
        </div>
        <p>{{ msg.message }}</p>
      </div>
    </div>

    <div class="chat-input">
      <input
        v-model="message"
        placeholder="Nhập tin nhắn..."
        @keyup.enter="sendMessage"
      />
      <i class="fas fa-smile icon"></i>
      <i class="fas fa-paperclip icon"></i>
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
      searchedUser: null,
      searchQuery: "",
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
    async searchUser() {
      if (!this.searchQuery) {
        this.searchedUser = null;
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:5000/api/user/search?email=${this.searchQuery}`
        );
        this.searchedUser = response.data.length > 0 ? response.data[0] : null;
      } catch (error) {
        console.error("User not found", error);
        this.searchedUser = null;
      }
    },
    selectUser(user) {
      this.$emit("user-selected", user);
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
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
  margin: 0;
  width: 100%;
  max-width: 700px;
  height: 600px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.chat-header {
  display: flex;
  width: 700px;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  color: #7c3aed;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 2px solid #7c3aed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chat-header h2 {
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 10px;
}

.chat-header .icons {
  display: flex;
  align-items: center;
}

.chat-header .icons .icon {
  font-size: 20px;
  color: #7c3aed;
  margin-left: 10px;
  cursor: pointer;
  transition: color 0.3s;
}

.chat-header .icons .icon:hover {
  color: #6b2fcf;
}

.chat-messages {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  width: 700px;
  background-color: #f9f9f9;
}

.sent {
  margin-bottom: 2px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  animation: slideIn 0.3s ease-in-out;
}

.sent p {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 14px;
  line-height: 1.4;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #7c3aed;
  color: #fff;
  border-bottom-right-radius: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.received {
  margin-bottom: 2px;
  display: flex;
  align-items: flex-end;
  animation: slideIn 0.3s ease-in-out;
  justify-content: flex-start;
}

.received p {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 14px;
  line-height: 1.4;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #ffccf9;
  color: #000;
  border-bottom-left-radius: 0;
}

.chat-input {
  display: flex;
  width: 700px;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #ccc;
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.chat-input input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 14px;
  margin-right: 10px;
  transition: border-color 0.3s;
}

.chat-input input:focus {
  border-color: #7c3aed;
  outline: none;
}

.chat-input button {
  padding: 10px 20px;
  background-color: #7c3aed;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
  transition: background-color 0.3s;
}

.chat-input button:hover {
  background-color: #6b2fcf;
}

.chat-input .icon {
  font-size: 20px;
  color: #7c3aed;
  margin-right: 10px;
  cursor: pointer;
  transition: color 0.3s;
}

.chat-input .icon:hover {
  color: #6b2fcf;
}
</style>
