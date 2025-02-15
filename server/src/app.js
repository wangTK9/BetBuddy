const express = require("express");
const http = require("http"); // Thêm module HTTP
const { Server } = require("socket.io"); // Import socket.io
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const Chat = require("./models/ChatMessage"); // Import model Chat để lưu tin nhắn

mongoose.set("strictQuery", false);
dotenv.config();
const app = express();
const server = http.createServer(app); // Tạo server HTTP
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Cho phép frontend kết nối
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
app.use("/api/chat", chatRoutes);

// 🔥 **Xử lý Socket.io để chat theo thời gian thực**
io.on("connection", (socket) => {
  console.log("⚡️ A user connected:", socket.id);

  // Nhận tin nhắn từ client và phát lại cho mọi người
  socket.on("sendMessage", async ({ sender, message }) => {
    const newMessage = new Chat({ sender, message });
    await newMessage.save();

    io.emit("receiveMessage", { sender, message, timestamp: new Date() });
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
