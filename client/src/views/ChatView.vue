<template>
  <div>
    <h1>Chat</h1>
    <label>Người nhận: </label>
    <input v-model="receiver" placeholder="Nhập ID người nhận" />

    <ChatBox
      v-if="receiver"
      :userId="userId"
      :receiver="receiver"
      @sendMessage="handleSendMessage"
    />
  </div>
</template>

<script>
import ChatBox from "../components/ChatBox.vue";
import { useAuthStore } from "../stores/auth";

export default {
  components: { ChatBox },
  data() {
    return {
      receiver: "",
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
      // Gửi tin nhắn qua Socket.io
      this.$socket.emit("sendMessage", { sender, receiver, message });
    },
  },
};
</script>
