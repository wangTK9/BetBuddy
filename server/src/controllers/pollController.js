const Poll = require('../models/Poll');

// Tạo bình chọn mới
exports.createPoll = async (req, res) => {
  try {
    const { question, options, settings } = req.body;

    // Kiểm tra dữ liệu hợp lệ
    if (!question || !options || options.length < 2 || !settings.expirationTime) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ. Cần có câu hỏi, ít nhất 2 lựa chọn và thời gian hết hạn.' });
    }

    // Tạo một Poll mới
    const newPoll = new Poll({
      question,
      options,
      settings,
    });

    // Lưu vào MongoDB
    await newPoll.save();

    res.status(201).json({
      message: 'Bình chọn đã được tạo thành công!',
      poll: newPoll,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình tạo bình chọn.' });
  }
};

// Lấy tất cả các bình chọn
exports.getPolls = async (req, res) => {
  try {
    const polls = await Poll.find();
    res.status(200).json(polls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách bình chọn.' });
  }
};

// Lấy một bình chọn theo ID
exports.getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Không tìm thấy bình chọn với ID này.' });
    }
    res.status(200).json(poll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin bình chọn.' });
  }
};
