// Giả lập việc chuyển phí từ ví Leap (1 USD)
const transferWithFee = async (fee) => {
  try {
    // Địa chỉ ví nhận phí
    const recipientAddress = process.env.FEE_WALLET_ADDRESS;

    console.log(
      `Transferring ${fee} USD to fee wallet at address ${recipientAddress}...`
    );

    // Giả lập giao dịch thành công
    return { status: "success" };
  } catch (error) {
    console.error("Error during transfer:", error);
    return { status: "failure" };
  }
};

module.exports = { transferWithFee };
