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


const users = {}; // Lưu danh sách người dùng đang online (userId -> socketId)

io.on("connection", (socket) => {
  console.log(`⚡️ A user connected: ${socket.id}`);

  // Khi người dùng kết nối, lưu socketId
  socket.on("join", (userId) => {
    console.log(`User ${userId} is trying to join.`);
    users[userId] = socket.id;
    console.log("👥 Online users:", users); // Kiểm tra danh sách người dùng trực tuyến
  });

  // Nhận tin nhắn từ client
  socket.on("sendMessage", async ({ sender, receiver, message }) => {
    try {
      // Giả sử bạn đã có mã để lưu tin nhắn vào cơ sở dữ liệu
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

  // Xử lý ngắt kết nối
  socket.on("disconnect", () => {
    console.log("A user disconnected, checking user list...");

    // Xóa người dùng khỏi danh sách khi mất kết nối
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log(`${userId} has disconnected`);
        break;
      }
    }

    console.log("👥 Online users:", users); // Kiểm tra lại danh sách người dùng
  });
});


// Khởi động server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
