<template>
  <div class="container">
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
.container {
  text-align: center;
  margin-top: 50px;
}
button {
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #6ad99c;
  cursor: pointer;
  transition: 0.3s;
  font-size: 14px;
}
button:hover {
  background: #5ac089;
}
</style>
