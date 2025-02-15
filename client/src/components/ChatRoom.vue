<template>
  <div class="chat-container">
    <h2>Chat Room</h2>

    <div class="messages">
      <div
        v-for="msg in messages"
        :key="msg._id"
        :class="{
          sent: msg.sender === userId,
          received: msg.sender !== userId,
        }"
      >
        <p>
          <strong>{{ msg.sender }}:</strong> {{ msg.message }}
        </p>
      </div>
    </div>

    <div class="chat-input">
      <input
        v-model="newMessage"
        placeholder="Type a message..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      userId: "user1", // Tạm thời, thay bằng ID thực tế của người dùng
      receiverId: "user2",
      messages: [],
      newMessage: "",
    };
  },
  mounted() {
    this.$socket.on("receiveMessage", (message) => {
      this.messages.push(message);
    });

    this.loadMessages();
  },
  methods: {
    async loadMessages() {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/${this.userId}/${this.receiverId}`
        );
        this.messages = res.data;
      } catch (error) {
        console.error("❌ Error loading messages:", error);
      }
    },
    sendMessage() {
      if (this.newMessage.trim() === "") return;

      const messageData = {
        sender: this.userId,
        receiver: this.receiverId,
        message: this.newMessage,
      };

      this.$socket.emit("sendMessage", messageData);
      this.newMessage = "";
    },
  },
};
</script>

<style>
.chat-container {
  width: 400px;
  border: 1px solid #ccc;
  padding: 10px;
  background: #f9f9f9;
}
.messages {
  height: 300px;
  overflow-y: auto;
}
.sent {
  text-align: right;
  background: #dcf8c6;
}
.received {
  text-align: left;
  background: #fff;
}
.chat-input {
  display: flex;
  gap: 5px;
}
</style>
