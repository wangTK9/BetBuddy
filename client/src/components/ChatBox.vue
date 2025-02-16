<template>
  <div class="chat-container">
    <div v-for="msg in messages" :key="msg._id" class="message">
      <span :class="{ 'my-message': msg.sender === userId }">
        {{ msg.message }}
      </span>
    </div>
    <input
      v-model="newMessage"
      @keyup.enter="sendMessage"
      placeholder="Nhập tin nhắn..."
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { io } from "socket.io-client";
import axios from "axios";

export default {
  setup() {
    const socket = io("http://localhost:5000");
    const messages = ref([]);
    const newMessage = ref("");
    const userId = ref("user1"); // Thay bằng ID thật
    const receiver = ref("user2"); // Thay bằng ID người nhận

    // Tham gia phòng chat
    onMounted(async () => {
      socket.emit("join", userId.value);
      const res = await axios.get(
        `http://localhost:5000/messages/${userId.value}/${receiver.value}`
      );
      messages.value = res.data;
    });

    // Lắng nghe tin nhắn mới từ server
    socket.on("receiveMessage", (msg) => {
      if (
        (msg.sender === receiver.value && msg.receiver === userId.value) ||
        (msg.sender === userId.value && msg.receiver === receiver.value)
      ) {
        if (!messages.value.some((m) => m._id === msg._id)) {
          messages.value.push(msg);
        }
      }
    });

    // Gửi tin nhắn
    const sendMessage = () => {
      if (newMessage.value.trim() === "") return;

      const messageData = {
        sender: userId.value,
        receiver: receiver.value,
        message: newMessage.value,
      };

      socket.emit("sendMessage", messageData);
      messages.value.push({ ...messageData, _id: Date.now() }); // Hiển thị ngay trên giao diện
      newMessage.value = "";
    };

    return { messages, newMessage, sendMessage };
  },
};
</script>

<style>
.chat-container {
  width: 300px;
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
}
.message {
  margin: 5px 0;
}
.my-message {
  font-weight: bold;
  color: blue;
}
</style>
