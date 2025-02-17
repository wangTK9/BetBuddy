<template>
  <ChatBox
    v-if="receiver"
    :userId="userId"
    :receiver="receiver"
    @sendMessage="handleSendMessage"
  />
</template>

<script>
import ChatBox from "../components/ChatBox.vue";
import { useAuthStore } from "../stores/auth";

export default {
  components: { ChatBox },
  data() {
    return {
      receiver: "",
      messages: [], // Lưu trữ tin nhắn đã gửi
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    userId() {
      return this.authStore.walletAddress; // Giả sử đây là ID người dùng
    },
  },
  watch: {
    "authStore.selectedUserWalletAddress": {
      immediate: true,
      handler(newReceiver) {
        this.receiver = newReceiver;
      },
    },
  },
  methods: {
    handleSendMessage({ sender, receiver, message }) {
      // Kiểm tra xem tin nhắn đã gửi trước đó chưa
      const messageExists = this.messages.some(
        (msg) => msg.message === message && msg.receiver === receiver
      );

      if (messageExists) {
        console.log("Tin nhắn đã gửi trước đó, không gửi lại.");
        return; // Nếu đã gửi tin nhắn này rồi, không gửi lại
      }

      // Gửi tin nhắn qua Socket.io
      this.$socket.emit("sendMessage", { sender, receiver, message });

      // Thêm tin nhắn vào danh sách đã gửi
      this.messages.push({ sender, receiver, message });
    },
  },
};
</script>
