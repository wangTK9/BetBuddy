const fs = require("fs");
const { transferWithFee } = require("../utils/transfer"); // Giả lập việc chuyển phí

const placeBet = async (req, res) => {
  try {
    const { user, goal, prediction, amount } = req.body;

    // Giả lập chuyển phí (1 USD)
    const fee = 1;
    const transferResult = await transferWithFee(fee);

    if (transferResult && transferResult.status === "success") {
      // Lưu thông tin cược vào file (hoặc MongoDB nếu thực tế)
      const bet = {
        user,
        goal,
        prediction,
        amount,
        timestamp: new Date().toISOString(),
      };

      const bets = JSON.parse(fs.readFileSync("bets.json", "utf8") || "[]");
      bets.push(bet);
      fs.writeFileSync("bets.json", JSON.stringify(bets, null, 2), "utf8");

      res.status(200).json({
        success: true,
        message: "Bet placed successfully!",
        betDetails: bet,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Failed to transfer fee." });
    }
  } catch (error) {
    console.error("Error placing bet:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = {
  placeBet,
};
