<template>
  <div class="chat-container">
    <!-- Header -->
    <div class="header">
      <span>Chats</span>
      <span>👤</span>
    </div>

    <!-- Search Bar -->
    <input
      type="text"
      class="search-bar"
      placeholder="Search messages or users"
      v-model="searchQuery"
      @input="searchUser"
    />

    <!-- Hiển thị user tìm thấy -->
    <div v-if="searchedUser" class="searched-user">
      <p><strong>Name:</strong> {{ searchedUser.fullName }}</p>
      <p><strong>Email:</strong> {{ searchedUser.email }}</p>
      <p><strong>Bio:</strong> {{ searchedUser.bio || "No bio available" }}</p>
    </div>

    <!-- Active Users -->
    <div class="active-users">
      <div class="active-user" v-for="user in activeUsers" :key="user.name">
        <img :src="user.image" :alt="user.name" />
        <div class="online-status"></div>
      </div>
    </div>

    <!-- Recent Chats -->
    <h3>Recent</h3>
    <div class="chat-list">
      <div class="chat-item" v-for="chat in filteredChats" :key="chat.name">
        <div class="chat-avatar" :style="{ backgroundColor: chat.color }">
          {{ chat.initial }}
        </div>
        <div class="chat-info">
          <p class="chat-name">{{ chat.name }}</p>
          <p class="chat-message">{{ chat.message }}</p>
        </div>
        <span class="chat-time">{{ chat.time }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchQuery: "",
      searchedUser: null, // Lưu thông tin user tìm thấy
      loading: false, // Trạng thái loading khi tìm kiếm
      activeUsers: [
        {
          name: "Patrick",
          image: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
          name: "Doris",
          image: "https://randomuser.me/api/portraits/women/2.jpg",
        },
      ],
      chats: [
        {
          name: "Albert Rodarte",
          message: "typing...",
          time: "",
          color: "#a78bfa",
          initial: "A",
        },
        {
          name: "Mirta George",
          message: "Yeah everything is fine",
          time: "12/07",
          color: "#60a5fa",
          initial: "M",
        },
      ],
    };
  },
  computed: {
    filteredChats() {
      return this.chats.filter(
        (chat) =>
          chat.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          chat.message.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  watch: {
    searchQuery(newQuery) {
      if (newQuery.trim() === "") {
        this.searchedUser = null;
        return;
      }
      this.searchUser();
    },
  },
  methods: {
    async searchUser() {
      if (!this.searchQuery) {
        this.searchedUser = null;
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:5000/api/user/search?email=${this.searchQuery}`
        );
        console.log("📥 API Response:", response.data); // Debug log
        this.searchedUser = response.data.length > 0 ? response.data[0] : null; // Lấy user đầu tiên
      } catch (error) {
        console.error("User not found", error);
        this.searchedUser = null;
      }
    },
  },
};
</script>

<style scoped>
.chat-container {
  max-width: 400px;
  margin: auto;
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
}
.search-bar {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  outline: none;
}
.searched-user {
  background: #f0f0f0;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
}
</style>
