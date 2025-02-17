const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [{ text: { type: String, required: true } }],
    expirationTime: { type: Date, required: false }, // Chỉnh sửa phần này nếu cần
    settings: {
      pinChat: { type: Boolean, default: false },
      multipleOptions: { type: Boolean, default: true },
      canAddOptions: { type: Boolean, default: true },
      anonymous: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const Poll = mongoose.model("Poll", PollSchema);

module.exports = Poll;
