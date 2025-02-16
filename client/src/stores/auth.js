import { defineStore } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    walletAddress: null,
    selectedUserWalletAddress: null, // Đổi tên để rõ ràng hơn
  }),
  actions: {
    login(walletAddress) {
      this.isAuthenticated = true;
      this.walletAddress = walletAddress;
    },
    logout() {
      this.isAuthenticated = false;
      this.walletAddress = null;
      this.selectedUserWalletAddress = null;
    },
    setSelectedUserWalletAddress(walletAddress) {
      this.selectedUserWalletAddress = walletAddress;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: "auth",
        storage: localStorage,
      },
    ],
  },
});
