const express = require("express");
const userController = require("../controllers/userController"); // Import userController

const router = express.Router();

router.post("/register", userController.registerUser);
router.get("/users", userController.getAllUsers); // Route lấy tất cả user

module.exports = router;
