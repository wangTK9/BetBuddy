<template>
  <div>
    <button @click="placeBet">🎰 Đặt Cược 10 TIA</button>
    <p v-if="txHash">✅ Thành công! TX Hash: {{ txHash }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      txHash: null,
    };
  },
  methods: {
    async placeBet() {
      try {
        const response = await axios.post("http://localhost:5000/api/bet", {
          walletAddress: "celestia1ea5c4jqwqqrns0h445kvygyted75pkvtla2udh", // Thay YOUR_WALLET_ADDRESS bằng địa chỉ thực
          amount: 10, // Đặt cược 10 TIA
          prediction: "up", // Hoặc giá trị khác phù hợp
        });

        console.log("✅ TX Hash:", response.data.txHash);
      } catch (error) {
        console.error("❌ Lỗi đặt cược:", error);
      }
    },
  },
};
</script>
