<template>
  <div>
    <h1>Chat</h1>
    <label>Người nhận: </label>
    <input v-model="receiver" placeholder="Nhập ID người nhận" />

    <ChatBox v-if="receiver" :userId="userId" :receiver="receiver" />
  </div>
</template>

<script>
import ChatBox from "../components/ChatBox.vue";
import { useAuthStore } from "../stores/auth";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
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
      const id = this.authStore.walletAddress; // Giả sử walletAddress là userId của bạn
      console.log("User Wallet Address:", id); // Debug log
      return id;
    },
  },
  watch: {
    "authStore.selectedUserWalletAddress": {
      immediate: true,
      handler(newSelectedUserWalletAddress) {
        this.receiver = newSelectedUserWalletAddress;
        console.log("Receiver Wallet Address:", this.receiver); // Debug log
      },
    },
  },
  mounted() {
    this.receiver = this.authStore.selectedUserWalletAddress;
    console.log("Receiver Wallet Address on mount:", this.receiver); // Debug log
  },
});
</script>
