<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>Chat với {{ receiver.name || "Không xác định" }}</h2>
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
      <button @click="togglePollPopup">+</button>
      <button @click="sendMessage" :disabled="isSending">Gửi</button>
    </div>

    <!-- Popup cho chức năng Poll -->
    <div v-if="showPollPopup" class="poll-popup">
      <div class="popup-content">
        <span class="close" @click="togglePollPopup">x</span>
        <Poll />
      </div>
    </div>
  </div>
</template>

<script>
import { database } from "@/services/firebaseConfig.js";
import { ref, push, set, onValue } from "firebase/database";
import { useAuthStore } from "@/stores/auth";
import Poll from "../components/Poll.vue";

export default {
  components: { Poll },

  props: ["receiver"],
  data() {
    return {
      message: "",
      messages: [],
      isSending: false,
      showPollPopup: false, // Thêm biến để điều khiển trạng thái popup
    };
  },
  computed: {
    userId() {
      const authStore = useAuthStore();
      return authStore.walletAddress || null;
    },
    chatRoomId() {
      if (!this.userId || !this.receiver) {
        return null;
      }
      const roomId = [this.userId, this.receiver].sort().join("_");
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
    togglePollPopup() {
      this.showPollPopup = !this.showPollPopup; // Thay đổi trạng thái hiển thị popup
    },
    loadMessages() {
      if (!this.chatRoomId) return;
      const messagesRef = ref(database, `chats/${this.chatRoomId}`);
      onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
          this.messages = Object.values(snapshot.val());
        } else {
          this.messages = [];
        }
        this.$nextTick(this.scrollToBottom);
      });
    },

    async sendMessage() {
      if (!this.message.trim() || !this.chatRoomId) {
        return;
      }

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
        this.message = "";
        this.$nextTick(this.scrollToBottom);
      } catch (error) {
        console.error("❌ Lỗi gửi tin nhắn:", error.message, error);
      } finally {
        this.isSending = false;
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const chatMessages = this.$refs.chatMessages;
        if (chatMessages) {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      });
    },
  },
};
</script>

<style scoped>
.chat-container {
  width: 100%;
  max-width: 100%;
  margin: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  padding: 20px;
}
.chat-header {
  background: #007bff;
  color: white;
  padding: 10px;
  text-align: center;
}
.chat-messages {
  height: 530px;
  width: 100%;
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

/* Popup styles */
.poll-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
/* .popup-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  text-align: center;
} */
.close {
  position: absolute;
  top: 163px;
  right: 520px;
  font-size: 20px;
  cursor: pointer;
  z-index: 100;
}
</style>
