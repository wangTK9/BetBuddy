<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>{{ receiver && receiver.length > 20 ? receiver.substring(0, 20) + "..." : receiver || "Người dùng" }}</h2>
      <div class="icons">
        <i class="fas fa-phone icon"></i>
        <i class="fas fa-video icon"></i>
        <i class="fas fa-user icon"></i>
        <i class="fas fa-ellipsis-h icon"></i>
      </div>
    </div>

<<<<<<< HEAD
    <div class="chat-messages">
      <div v-for="msg in messages" :key="msg._id" :class="msg.sender === userId ? 'sent' : 'received'">
        <div v-if="searchedUser" class="searched-user" @click="selectUser(searchedUser)">
          <img :src="'/avatar-trang-4.jpg'" :alt="searchedUser.fullName" class="searched-user-avatar" />
        </div>
=======
    <div class="chat-messages" ref="chatMessages">
      <div
        v-for="msg in messages"
        :key="msg._id"
        :class="msg.sender === userId ? 'sent' : 'received'"
      >
>>>>>>> 58a8c1939a641553595ee77d270c7fde3beff5bd
        <p>{{ msg.message }}</p>
      </div>
    </div>

    <div class="chat-input">
<<<<<<< HEAD
      <input v-model="message" placeholder="Nhập tin nhắn..." @keyup.enter="sendMessage" />
      <i class="fas fa-smile icon"></i>
      <i class="fas fa-paperclip icon"></i>
      <button @click="sendMessage">Gửi</button>
=======
      <input
        v-model="message"
        placeholder="Nhập tin nhắn..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage" :disabled="isSending">Gửi</button>
>>>>>>> 58a8c1939a641553595ee77d270c7fde3beff5bd
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
<<<<<<< HEAD
    async searchUser() {
      if (!this.searchQuery) {
        this.searchedUser = null;
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/api/user/search?email=${this.searchQuery}`);
        this.searchedUser = response.data.length > 0 ? response.data[0] : null;
      } catch (error) {
        console.error("User not found", error);
        this.searchedUser = null;
      }
    },
    selectUser(user) {
      this.$emit("user-selected", user);
    },
=======
    scrollToBottom() {
      this.$nextTick(() => {
        const chatMessages = this.$refs.chatMessages;
        if (chatMessages) {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      });
    },

>>>>>>> 58a8c1939a641553595ee77d270c7fde3beff5bd
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
        const response = await axios.post(
          `${this.backendUrl}/messages`,
          newMsg
        );
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
<<<<<<< HEAD
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

=======
  width: 300px;
  height: 400px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  background: #fff;
  display: flex;
  flex-direction: column;
}

>>>>>>> 58a8c1939a641553595ee77d270c7fde3beff5bd
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
<<<<<<< HEAD
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
=======
  margin-bottom: 10px;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  border-bottom: 1px solid #ddd;
>>>>>>> 58a8c1939a641553595ee77d270c7fde3beff5bd
}

.sent {
  margin-bottom: 2px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  animation: slideIn 0.3s ease-in-out;
}

<<<<<<< HEAD
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

=======
>>>>>>> 58a8c1939a641553595ee77d270c7fde3beff5bd
.received {
  margin-bottom: 2px;
  display: flex;
  align-items: flex-end;
  animation: slideIn 0.3s ease-in-out;
  justify-content: flex-start;
}

<<<<<<< HEAD
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

=======
>>>>>>> 58a8c1939a641553595ee77d270c7fde3beff5bd
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 58a8c1939a641553595ee77d270c7fde3beff5bd
}
</style>
