<template>
  <div class="leap-login-container">
    <button @click="connectWallet">
      {{ authStore.isAuthenticated ? "Connected" : "Login with Leap Wallet" }}
    </button>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useAuthStore } from "../stores/auth";

export default defineComponent({
  setup() {
    const authStore = useAuthStore();

    const connectWallet = async () => {
      if (!window.leap) {
        alert("Please install Leap Wallet extension");
        return;
      }

      const arabicaParams = {
        chainId: "arabica-11",
        chainName: "Arabica devnet",
        rpc: "https://rpc.celestia-arabica-11.com/",
        rest: "https://api.celestia-arabica-11.com/",
      };

      try {
        await window.leap.enable(arabicaParams.chainId);
        const accounts = await window.leap.getKey(arabicaParams.chainId);

        if (!accounts || !accounts.bech32Address) {
          alert("Failed to retrieve wallet address");
          return;
        }

        const walletAddress = accounts.bech32Address;
        console.log("📌 Wallet Address Retrieved:", walletAddress);
        alert(`Connected: ${walletAddress}`);
      } catch (error) {
        console.error("❌ Failed to connect wallet:", error);
        alert("Failed to connect wallet");
      }
    };

    return { authStore, connectWallet };
  },
});
</script>

<style scoped>
.leap-login-container {
  width: 100%;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

button {
  width: 100%;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #34b7f1; /* Màu xanh dương đặc trưng cho Leap Wallet */
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button:hover {
  background-color: #2898c4; /* Màu xanh đậm khi hover */
  transform: translateY(-2px);
}

button:active {
  background-color: #2898c4; /* Màu xanh đậm khi click */
  transform: translateY(0);
}

</style>
