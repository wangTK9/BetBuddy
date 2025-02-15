const express = require("express");
const userController = require("../controllers/userController"); // Import userController

const router = express.Router();

router.post("/register", userController.registerUser);
router.get("/users", userController.getAllUsers);
router.put("/update/:walletAddress", userController.updateUser); // Route cập nhật user
router.get("/search", userController.searchUserByEmail); // 🔍 Route tìm kiếm user theo email

module.exports = router;
