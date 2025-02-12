const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    birthDate: { type: String, required: true },
    walletAddress: { type: String, required: true, unique: true },
    email: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
