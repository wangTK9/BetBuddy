import { defineStore } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    walletAddress: "celestia14lqsz0sa6gqyn2ryvc7sagd86vs0f982u86ck3" || null,
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
