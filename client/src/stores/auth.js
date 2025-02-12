import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    walletAddress: null,
  }),
  actions: {
    login(walletAddress) {
      this.isAuthenticated = true;
      this.walletAddress = walletAddress;
    },
    logout() {
      this.isAuthenticated = false;
      this.walletAddress = null;
    },
  },
  // Bật tính năng persist, lưu toàn bộ state vào localStorage
  persist: true,
});
