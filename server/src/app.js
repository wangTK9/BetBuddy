const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const chatRoutes = require("./routes/chatRoutes.js");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const betRoutes = require("./routes/betRoutes");
const pollRoutes = require("./routes/pollRoutes"); // ✅ Sửa lỗi chính tả
const Message = require("./models/Message");
const Poll = require("./models/Poll");
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

app.use("/api/user", userRoutes);
app.use("/messages", messageRoutes);
app.use("/api", betRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/poll", pollRoutes);
io.on("connection", (socket) => {
  console.log(`⚡️ Client connected: ${socket.id}`);

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

      io.emit("receiveMessage", savedMessage); // Gửi tin nhắn đến tất cả client
      console.log("📩 Tin nhắn gửi đến tất cả client:", savedMessage);
    } catch (error) {
      console.error("❌ Lỗi khi lưu tin nhắn:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client ngắt kết nối: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
