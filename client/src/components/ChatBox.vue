<template>
  <div class="chat-container">
    <div ref="chatMessages" class="messages">
      <div v-for="msg in messages" :key="msg._id" class="message">
        <span :class="{ 'my-message': msg.sender === userId }">
          {{ msg.message }}
        </span>
      </div>
    </div>
    <input
      v-model="newMessage"
      @keyup.enter="sendMessage"
      placeholder="Nhập tin nhắn..."
      :disabled="isSending"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { io } from "socket.io-client";
import axios from "axios";

export default {
  props: ["userId", "receiver"],
  setup(props) {
    const backendUrl = "http://localhost:5000";
    const socket = io(backendUrl);
    const messages = ref([]);
    const newMessage = ref("");
    const isSending = ref(false);
    const chatMessages = ref(null);

    // 🚀 Kết nối socket & tải tin nhắn
    onMounted(async () => {
      console.log(
        "✅ ChatBox mounted, userId:",
        props.userId,
        "receiver:",
        props.receiver
      );

      // Xác nhận kết nối thành công
      socket.on("connect", () => {
        console.log("🔗 Connected to socket server, ID:", socket.id);
      });

      // Tham gia phòng chat
      socket.emit("join", props.userId);
      console.log("📢 Joined chat room:", props.userId);

      // Lắng nghe tin nhắn
      socket.on("receiveMessage", (msg) => {
        console.log("📩 Received message:", msg);

        if (
          (msg.sender === props.receiver && msg.receiver === props.userId) ||
          (msg.sender === props.userId && msg.receiver === props.receiver)
        ) {
          addMessage(msg);
        }
      });

      // Tải tin nhắn từ backend
      await loadMessages();
    });

    // 🚀 Tải tin nhắn từ backend
    const loadMessages = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/messages/${props.userId}/${props.receiver}`
        );
        res.data.forEach(addMessage);
        console.log("📜 Loaded messages:", messages.value);
        nextTick(scrollToBottom);
      } catch (error) {
        console.error("❌ Error loading messages:", error);
      }
    };

    // 🚀 Thêm tin nhắn với kiểm tra trùng lặp
    const addMessage = (msg) => {
      if (!messages.value.find((m) => m._id === msg._id)) {
        messages.value.push(msg);
        nextTick(scrollToBottom);
      }
    };

    // 🚀 Gửi tin nhắn
    const sendMessage = async () => {
      if (!newMessage.value.trim() || isSending.value) return;

      isSending.value = true;
      const messageData = {
        sender: props.userId,
        receiver: props.receiver,
        message: newMessage.value.trim(),
      };

      try {
        console.log("🚀 Sending message:", messageData);
        const response = await axios.post(
          `${backendUrl}/messages`,
          messageData
        );
        messageData._id = response.data._id;

        // Gửi tin nhắn qua socket
        socket.emit("sendMessage", messageData);
        console.log("📤 Message sent via socket:", messageData);

        addMessage(messageData);
        newMessage.value = "";
      } catch (error) {
        console.error("❌ Error sending message:", error);
      } finally {
        isSending.value = false;
      }
    };

    // 🚀 Cuộn xuống cuối cùng
    const scrollToBottom = () => {
      if (chatMessages.value) {
        chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
      }
    };

    // 🚀 Dọn dẹp khi thoát khỏi component
    onUnmounted(() => {
      console.log("❌ ChatBox unmounted, cleaning up socket...");
      socket.off("receiveMessage");
      socket.disconnect();
    });

    return { messages, newMessage, sendMessage, isSending, chatMessages };
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
.messages {
  height: 350px;
  overflow-y: auto;
}
.message {
  margin: 5px 0;
}
.my-message {
  font-weight: bold;
  color: blue;
}
</style>
