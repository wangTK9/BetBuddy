const express = require("express");
const { placeBet } = require("../controllers/betController");
const router = express.Router();

// Route để đặt cược
router.post("/place", placeBet);

module.exports = router;
