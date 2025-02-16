const express = require("express");
const http = require("http"); // Module HTTP
const { Server } = require("socket.io"); // Import socket.io
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const pollRoutes = require("./routes/pollRoutes"); // ✅ Sửa lỗi chính tả

const Message = require("./models/Message");
const Poll = require("./models/Poll");

mongoose.set("strictQuery", false);
dotenv.config();

const app = express();
const server = http.createServer(app); // Tạo server HTTP

const io = new Server(server, {
  cors: {
    origin: "*",
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
app.use("/api/messages", messageRoutes);
app.use("/api/poll", pollRoutes);

const users = {}; // Lưu danh sách người dùng đang online (userId -> socketId)

io.on("connection", (socket) => {
  console.log(`⚡️ A user connected: ${socket.id}`);
  socket.on("sendMessage", (msg) => {
    console.log("📩 Server nhận tin nhắn:", msg);
    io.emit("receiveMessage", msg); // Gửi tin nhắn cho tất cả client
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client ngắt kết nối: ${socket.id}`);
  });
  // Khi người dùng kết nối, lưu socketId
  socket.on("join", (userId) => {
    console.log(`User ${userId} joined.`);
    console.log(`👥 User ${userId} đã vào phòng chat.`);
    users[userId] = socket.id;
    console.log("👥 Online users:", users);
  });

  // Nhận tin nhắn từ client
  socket.on("sendMessage", async ({ sender, receiver, message }) => {
    try {
      const newMessage = new Message({ sender, receiver, message });
      await newMessage.save();

      const savedMessage = {
        _id: newMessage._id,
        sender,
        receiver,
        message,
        timestamp: newMessage.createdAt,
      };

      const receiverSocketId = users[receiver];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", savedMessage);
      } else {
        console.log(`User ${receiver} is offline, message stored in DB.`);
      }
    } catch (error) {
      console.error("❌ Error saving message:", error);
    }
  });

  // Xử lý ngắt kết nối
  socket.on("disconnect", () => {
    console.log("A user disconnected.");

    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log(`${userId} has disconnected`);
        break;
      }
    }

    console.log("👥 Online users:", users);
  });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
