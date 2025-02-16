const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');

// Tạo bình chọn mới
router.post('/create', pollController.createPoll);

// Lấy tất cả các bình chọn
router.get('/polls', pollController.getPolls);

// Lấy một bình chọn theo ID
router.get('/poll/:id', pollController.getPollById);

module.exports = router;
