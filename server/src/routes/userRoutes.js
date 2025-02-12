const express = require("express");
const userController = require("../controllers/userController"); // Import userController

const router = express.Router();

router.post("/register", userController.registerUser);
router.get("/users", userController.getAllUsers);
router.put("/update/:walletAddress", userController.updateUser); // Route cập nhật user

module.exports = router;
