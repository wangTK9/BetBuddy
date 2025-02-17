<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>Chat với {{ receiver || "Không xác định" }}</h2>
    </div>

    <div class="chat-messages" ref="chatMessages">
      <div
        v-for="msg in messages"
        :key="msg.id"
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
import { database } from "@/services/firebaseConfig.js";
import { ref, push, set, onValue } from "firebase/database";
import { useAuthStore } from "@/stores/auth";

export default {
  props: ["receiver"], // Nhận thông tin người nhận từ component cha
  data() {
    return {
      message: "",
      messages: [],
      isSending: false,
    };
  },
  computed: {
    userId() {
      const authStore = useAuthStore();
      console.log("🔍 User ID:", authStore.walletAddress); // Kiểm tra User ID
      return authStore.walletAddress || null;
    },
    chatRoomId() {
      if (!this.userId || !this.receiver) {
        console.warn("⚠️ chatRoomId không hợp lệ:", this.userId, this.receiver);
        return null;
      }
      const roomId = [this.userId, this.receiver].sort().join("_");
      console.log("📌 Chat Room ID:", roomId);
      return roomId;
    },
  },
  watch: {
    chatRoomId: {
      handler(newChatRoomId) {
        if (newChatRoomId) this.loadMessages();
      },
      immediate: true,
    },
  },
  methods: {
    // 📥 Tải tin nhắn từ Firebase
    loadMessages() {
      if (!this.chatRoomId) return;
      console.log(`📥 Đang tải tin nhắn từ chatRoomId: ${this.chatRoomId}`);

      const messagesRef = ref(database, `chats/${this.chatRoomId}`);
      onValue(messagesRef, (snapshot) => {
        console.log("🔄 Firebase trả về snapshot:", snapshot.val());
        if (snapshot.exists()) {
          this.messages = Object.values(snapshot.val());
          console.log("✅ Tin nhắn đã tải:", this.messages);
        } else {
          this.messages = [];
          console.log("⚠️ Không có tin nhắn nào.");
        }
        this.$nextTick(this.scrollToBottom);
      });
    },

    // 🚀 Gửi tin nhắn lên Firebase
    async sendMessage() {
      if (!this.message.trim() || !this.chatRoomId) {
        console.warn("⚠️ Tin nhắn rỗng hoặc chatRoomId không hợp lệ.");
        return;
      }

      console.log("🚀 Đang gửi tin nhắn...");

      this.isSending = true;
      try {
        const messagesRef = ref(database, `chats/${this.chatRoomId}`);
        const newMessageRef = push(messagesRef);

        const newMessage = {
          id: newMessageRef.key,
          sender: this.userId,
          receiver: this.receiver,
          message: this.message.trim(),
          timestamp: Date.now(),
        };

        await set(newMessageRef, newMessage);
        console.log("✅ Tin nhắn đã gửi thành công:", newMessage);

        this.message = "";
        this.$nextTick(this.scrollToBottom);
      } catch (error) {
        console.error("❌ Lỗi gửi tin nhắn:", error.message, error);
      } finally {
        this.isSending = false;
      }
    },

    // 📜 Cuộn xuống cuối danh sách tin nhắn
    scrollToBottom() {
      this.$nextTick(() => {
        const chatMessages = this.$refs.chatMessages;
        if (chatMessages) {
          chatMessages.scrollTop = chatMessages.scrollHeight;
          console.log("📜 Đã cuộn xuống cuối tin nhắn.");
        }
      });
    },
  },
};
</script>

<style scoped>
.chat-container {
  width: 100%;
  max-width: 500px;
  margin: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}
.chat-header {
  background: #007bff;
  color: white;
  padding: 10px;
  text-align: center;
}
.chat-messages {
  height: 300px;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
}
.sent {
  align-self: flex-end;
  background: #dcf8c6;
  padding: 8px;
  border-radius: 10px;
  margin: 5px;
}
.received {
  align-self: flex-start;
  background: #f1f0f0;
  padding: 8px;
  border-radius: 10px;
  margin: 5px;
}
.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
}
.chat-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.chat-input button {
  margin-left: 5px;
  padding: 8px 15px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}
</style>
