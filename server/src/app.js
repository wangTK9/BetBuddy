const express = require("express");
<<<<<<< HEAD
const http = require("http"); // Module HTTP
const { Server } = require("socket.io"); // Import socket.io
=======
const http = require("http");
const { Server } = require("socket.io");
>>>>>>> 1a548b596430f772e0e1b7e72b1baad99c8ab057
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
<<<<<<< HEAD
const pollRoutes = require("./routes/pollRoutes"); // ✅ Sửa lỗi chính tả

const Message = require("./models/Message");
const Poll = require("./models/Poll");
=======
const Message = require("./models/Message");
>>>>>>> 1a548b596430f772e0e1b7e72b1baad99c8ab057

dotenv.config();

const app = express();
<<<<<<< HEAD
const server = http.createServer(app); // Tạo server HTTP

=======
const server = http.createServer(app);
>>>>>>> 1a548b596430f772e0e1b7e72b1baad99c8ab057
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
app.use("/api/messages", messageRoutes);
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
