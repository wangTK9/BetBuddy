const User = require("../models/User");

exports.registerUser = async (req, res) => {
  try {
    const { walletAddress, fullName, birthDate, email } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: "Wallet address is required" });
    }

    let user = await User.findOne({ walletAddress });

    if (!user) {
      user = new User({
        walletAddress,
        fullName,
        birthDate,
        email,
      });
      await user.save();
    } else {
      // Cập nhật thông tin nếu user đã tồn tại
      user.fullName = fullName || user.fullName;
      user.birthDate = birthDate || user.birthDate;
      user.email = email || user.email;
      await user.save();
    }

    res.status(200).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
