<template>
  <!-- <Vote/> -->
  <div class="chat-container">
    <div class="chat-header">
  <div style="display: flex; flex-direction: column;">
    <div style="display: flex; align-items: center;">
      <img class="img_profile" style="height: 40px;"  
        src="https://i.pinimg.com/736x/db/d6/4f/dbd64f8b5f641068c191d01ad49d56c9.jpg" 
        alt="">
      <h2 style="top: 20px;" class="chat-header-title">{{ fullName }}</h2>
    </div>
    
    <div v-if="pinnedMessage || selectedVote" class="content_pin-vote" :class="{ expanded: isExpanded }">
      <div class="header-bar" @click="toggleExpand">
        <span class="pin-text">📌 Đang ghim</span>
        <span class="toggle-btn">
          <span v-if="isExpanded">▲</span>
          <span v-else>▼</span>
        </span>
      </div>

      <div v-if="pinnedMessage" class="pinned-message">
        📌 {{ pinnedMessage }}
        <button class="unpin-btn" @click.stop="unpinMessage">X</button>
      </div>

      <!-- Vote Section -->
      <div v-if="selectedVote" class="vote-summary">
        <p>❎ Selected: <strong>{{ selectedVote }}</strong></p>
        <p>🎲 Bet: <strong>{{ betAmount }} token</strong></p>
        <p>⏳ DayLine <strong>{{ betAmount }} 28/02/2025</strong></p>
      </div>
    </div>



  </div>
  
  <div class="chat_icon">
    <i class="fa-brands fa-searchengin"></i>
    <i class="fa-solid fa-phone"></i>
    <i class="fa-solid fa-video"></i>
    <i style="font-weight: 500;">...</i>
  </div>
</div>

    <div class="chat-messages" ref="chatMessages">
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="[msg.sender === userId ? 'sent' : 'received', msg.sent ? 'sent-acknowledged' : '']"
        class="message-container"
      >
        <p>{{ msg.message }}</p>
        <div class="message-time-container">
          <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
        </div>
      </div>
      <Vote v-if="showVote" @vote-submitted="handleVoteSubmit" />
    </div>

    <div class="chat-input">
      <input v-model="message" placeholder="Enter message..." @keyup.enter="sendMessage" />
      <button @click="togglePollPopup">+</button>
      <button @click="sendMessage" :disabled="isSending">Send</button>
    </div>

    <!-- Popup for Poll Functionality -->
    <div v-if="showPollPopup" class="poll-popup">
      <div class="popup-content">
        <!-- <Poll @close="togglePollPopup" /> -->
        <Poll @close="togglePollPopup" @poll-created="showVote = true" />
      </div>
    </div>
  </div>
</template>



<script>
import { database } from "@/services/firebaseConfig.js";
import { ref, push, set, onValue, remove } from "firebase/database";
import { useAuthStore } from "@/stores/auth";
import Poll from "../components/Poll.vue";
import Vote from "../components/Vote.vue";
import axios from "axios";  // Gọi API



export default {
  components: { Poll, Vote },
  props: ["receiver"],
  data() {
  return {
    message: "",
    messages: [],
    isSending: false,
    showPollPopup: false,
    selectedMessageId: null,
    pinnedMessage: null, // Tin nhắn được ghim
    showVote: false,  // Điều khiển hiển thị Vote
    selectedVote: null, // Lưu lựa chọn đã vote
    betAmount: null,    // Lưu số token cược
    isExpanded: false,
    selectedVote: "",
  };
},

  computed: {
    userId() {
      const authStore = useAuthStore();
      return authStore.walletAddress || null;
    },
    chatRoomId() {
      if (!this.userId || !this.receiver) return null;
      return [this.userId, this.receiver].sort().join("_");
    },
    fullName() {
      return this.receiver?.fullName || "Tuấn Kiệt";
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
  
  created() {
    if (this.receiver?.walletAddress) {
      this.fetchReceiverDetails(this.receiver.walletAddress);
    }
  },
  methods: {
    togglePollPopup() {
      this.showPollPopup = !this.showPollPopup;
    },
    handleVoteSubmit(voteData) {
    console.log("📩 Nhận dữ liệu vote:", voteData);
    this.selectedVote = voteData.choice;
    this.betAmount = voteData.bet;
    this.showVote = false; // Ẩn Vote sau khi chọn xong
  },
    pinMessage(message) {
      this.pinnedMessage = message;
    },
    unpinMessage() {
      this.pinnedMessage = null;
    },
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },

    loadMessages() {
      if (!this.chatRoomId) return;
      const messagesRef = ref(database, `chats/${this.chatRoomId}`);
      onValue(messagesRef, (snapshot) => {
        this.messages = snapshot.exists() ? Object.values(snapshot.val()) : [];
        this.$nextTick(this.scrollToBottom);
      });
    },

    formatTime(timestamp) {
      const date = new Date(timestamp);
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    },

    async sendMessage() {
      if (!this.message.trim() || !this.chatRoomId) return;

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
          sent: false,
        };

        await set(newMessageRef, newMessage);
        this.message = "";
        this.$nextTick(this.scrollToBottom);
        this.updateMessageSentStatus(newMessageRef.key);
      } catch (error) {
        console.error("❌ Lỗi gửi tin nhắn:", error.message);
      } finally {
        this.isSending = false;
      }
    },

    async updateMessageSentStatus(messageId) {
      const messageRef = ref(database, `chats/${this.chatRoomId}/${messageId}`);
      await set(messageRef, { ...this.messages.find(msg => msg.id === messageId), sent: true });
    },

    toggleMessageMenu(messageId) {
      this.selectedMessageId = this.selectedMessageId === messageId ? null : messageId;
    },

    async deleteMessage(messageId) {
      if (!this.chatRoomId) return;

      try {
        const messageRef = ref(database, `chats/${this.chatRoomId}/${messageId}`);
        await remove(messageRef);
        this.selectedMessageId = null;
      } catch (error) {
        console.error("❌ Lỗi xóa tin nhắn:", error.message);
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const chatMessages = this.$refs.chatMessages;
        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
      });
    },

    async fetchReceiverDetails(walletAddress) {
      try {
        const response = await axios.get(`/api/getUserByWalletAddress?walletAddress=${walletAddress}`);
        if (response.data) {
          this.receiver = response.data;
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin người nhận:", error.message);
      }
    },
  },
};
</script>


<style scoped>
.chat-container {
  position: relative;
  width: 100%;
  max-width: 100%;
  margin: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  padding: 20px;
}
.chat-header {
  background: #000000b0;
  color: white;
  padding: 10px;
  text-align: center;
}
.chat-messages {
  height: 530px;
  width: 100%;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sent {
  align-self: flex-end;
  background: #dcf8c6;
  padding: 0px 25px;
  border-radius: 6px;
  max-width: 80%;
  word-wrap: break-word;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
}


.sent.sent-acknowledged::after {
  display: inline-block;  /* Hiển thị dấu tích khi tin nhắn đã được gửi */
}

.received {
  align-self: flex-start;
  background: #f1f1f1;
  padding: 0px 25px;
  border-radius: 6px;
  max-width: 80%;
  word-wrap: break-word;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.chat-input {
  display: flex;
  padding: 15px;
  border-top: 1px solid #ddd;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  border-radius: 8px;
}

.chat-input input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.chat-input input:focus {
  border-color: #007bff;
  box-shadow: inset 0 0 5px rgba(0, 123, 255, 0.5);
}

.chat-input button {
  margin-left: 10px;
  padding: 10px 15px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
}

.chat-input button:disabled {
  background: #ddd;
}

.chat-input button:hover {
  background: #0056b3;
}

.chat-input button:active {
  background: #003f7f;
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
  transition: opacity 0.3s ease;
}

.popup-content {
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.popup-content h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #007bff;
}

/* Thời gian tin nhắn LUÔN hiển thị */
.message-time-container {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  display: block;  /* Luôn hiển thị */
  text-align: right; /* Mặc định căn phải cho người gửi */
}

.received .message-time-container {
  text-align: left; /* Căn trái cho người nhận */
}

/* Loại bỏ hover để hiển thị thời gian */
.sent:hover .message-time-container,
.received:hover .message-time-container {
  display: block;
}

.chat-header {
  display: flex;
  justify-content: space-between; /* Căn đều nội dung */
  align-items: center; /* Căn chỉnh theo chiều dọc */
  background-color: #ffffffd1;
  color: rgb(4, 4, 4);
  padding: 10px 20px;
  border-radius: 8px 8px 0 0;
}

.chat-header-title {
  font-size: 20px;
  margin: 0;
  top: -20px;
  position: relative;
  left: 10px;
}
.img_profile{
  border: 1px solid black;
  border-radius: 50%;
}

.chat-header-icon {
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s ease;
}

/* Thêm hiệu ứng hover cho icon */
.chat-header-icon:hover {
  color: #ddd;
}

.chat_icon i {
  padding: 10px;
}



.content_pin-vote {
  width: 860px;
  max-width: 100%;
  height: 24px; /* Ban đầu thu nhỏ */
  background-color: #676767;
  position: absolute;
  top: 84px;
  z-index: 3;
  border-radius: 10px;
  overflow: hidden;
  transition: height 0.3s ease;
  color: white;
  display: flex;
  flex-direction: column;
}

.content_pin-vote.expanded {
  height: 100px; /* Khi mở rộng */
}

/* Thanh header chứa text và mũi tên */
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  background-color: #676767;

  border-radius: 10px 10px 0 0;
}

/* Chữ "Đang ghim" */
.pin-text {
  font-weight: bold;
  color: #f1c40f;
}

/* Nút toggle */
.toggle-btn {
  font-size: 14px;
  cursor: pointer;
  color: white;
  background: transparent;
  border: none;
}

/* Vote summary */
.vote-summary {
  width: 100%;
  /* background-color: #686767; */
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  /* border: 1px solid #007bff; */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  height: 60px;
  color: #ffffff;
  /* white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; */
  text-align: start;
}


</style>
