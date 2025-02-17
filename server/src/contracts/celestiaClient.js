const axios = require("axios");

// Node Celestia testnet Arabica 11
const CELESTIA_NODE_URL = "https://rpc.celestia-arabica-11.com";
const WALLET_ADDRESS = "celestia1ea5c4jqwqqrns0h445kvygyted75pkvtla2udh"; // Thay bằng địa chỉ ví của bạn
const WALLET_PRIVATE_KEY = "vhune"; // Private key ví test

async function broadcastBlobTransaction(data) {
  try {
    const response = await axios.post(
      `${CELESTIA_NODE_URL}/broadcast_tx_commit`,
      {
        tx: {
          from: WALLET_ADDRESS,
          data: Buffer.from(data).toString("base64"), // Encode dữ liệu đặt cược
          gas: "200000",
        },
        private_key: WALLET_PRIVATE_KEY,
      }
    );

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data.result.hash; // Trả về TX Hash từ Celestia
  } catch (error) {
    console.error("Lỗi gửi giao dịch:", error);
    throw error;
  }
}

module.exports = { broadcastBlobTransaction };
