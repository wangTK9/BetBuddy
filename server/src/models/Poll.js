const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{
    text: { type: String, required: true },
    votes: { type: Number, default: 0 },
  }],
  settings: {
    pinChat: { type: Boolean, default: false },
    multipleOptions: { type: Boolean, default: true },
    canAddOptions: { type: Boolean, default: true },
    anonymous: { type: Boolean, default: false },
    expirationTime: { type: Date, required: true },
  },
}, { timestamps: true });

const Poll = mongoose.model('Poll', pollSchema);
module.exports = Poll;
