const axios = require("axios");

exports.placeBet = async (walletAddress, amount, prediction) => {
  try {
    // Chuyển đổi dữ liệu sang Base64
    const jsonData = JSON.stringify({ walletAddress, amount, prediction });
    const base64Data = Buffer.from(jsonData).toString("base64");

    console.log("🚀 Gửi giao dịch với dữ liệu Base64:", base64Data);

    const requestData = {
      jsonrpc: "2.0",
      method: "broadcast_tx_sync",
      params: [base64Data], // Xem lại nếu có thay đổi cần thiết
      id: 1,
    };

    const txResponse = await axios.post(
      "https://rpc.celestia-arabica-11.com",
      requestData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log(
      "📡 Response từ Celestia:",
      JSON.stringify(txResponse.data, null, 2)
    );

    if (!txResponse.data.result || !txResponse.data.result.hash) {
      throw new Error("❌ Giao dịch thất bại hoặc không có txhash!");
    }

    return { transactionHash: txResponse.data.result.hash };
  } catch (error) {
    console.error(
      "❌ Lỗi gửi giao dịch:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
