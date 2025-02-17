const express = require("express");
const router = express.Router();
const Poll = require("../models/Poll");

// POST: Tạo Poll mới
router.post("/", async (req, res) => {
  try {
    const { question, options, expirationTime, settings } = req.body;

    // Kiểm tra dữ liệu
    if (!question || !options || options.length === 0) {
      return res.status(400).json({ message: "Thiếu dữ liệu poll!" });
    }

    // Kiểm tra expirationTime (nếu có)
    if (expirationTime && isNaN(Date.parse(expirationTime))) {
      return res
        .status(400)
        .json({ message: "Thời gian hết hạn không hợp lệ!" });
    }

    // Tạo mới Poll
    const newPoll = new Poll({ question, options, expirationTime, settings });
    await newPoll.save();

    // Trả về kết quả
    res.status(201).json(newPoll);
  } catch (error) {
    console.error(":x: Lỗi khi tạo poll:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
