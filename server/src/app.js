const express = require("express");
const http = require("http"); // Thêm module HTTP
const { Server } = require("socket.io"); // Import socket.io
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const Message = require("./models/Message"); // Import model Message

mongoose.set("strictQuery", false);
dotenv.config();
const app = express();
const server = http.createServer(app); // Tạo server HTTP
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép frontend kết nối
    methods: ["GET", "POST"],
  },
});

// Cấu hình CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type",
  })
);

// Middleware xử lý dữ liệu JSON
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Kết nối MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// API Routes
app.use("/api/user", userRoutes);
app.use("/messages", messageRoutes);

// 🔥 **Xử lý Socket.io để chat theo thời gian thực**
const users = {}; // Lưu user đang online (userId -> socketId)

io.on("connection", (socket) => {
  console.log("⚡️ A user connected:", socket.id);

  // Khi user vào, lưu socketId
  socket.on("join", (userId) => {
    users[userId] = socket.id;
    console.log("👥 Online users:", users);
  });

  // Nhận tin nhắn từ client
  socket.on("sendMessage", async ({ sender, receiver, message }) => {
    try {
      const newMessage = new Message({ sender, receiver, message });
      await newMessage.save();

      // Tìm socket của người nhận
      const receiverSocketId = users[receiver];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", {
          sender,
          receiver,
          message,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error("❌ Error saving message:", error);
    }
  });

  // Khi user rời đi, xóa khỏi danh sách
  socket.on("disconnect", () => {
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
    console.log("❌ A user disconnected:", socket.id);
  });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
