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
    <div
      v-if="searchedUser"
      class="searched-user"
      @click="selectUser(searchedUser)"
    >
      <img
        :src="'/avatar-trang-4.jpg'"
        :alt="searchedUser.fullName"
        class="searched-user-avatar"
      />
      <p class="searched-user-name">{{ searchedUser.fullName }}</p>
    </div>

    <!-- Active Users -->
    <div class="active-users">
      <!-- <div class="active-user" v-for="user in activeUsers" :key="user.name">
        <img :src="user.image" :alt="user.name" />
        <div class="online-status"></div>
      </div> -->
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
import { useAuthStore } from "../stores/auth";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      searchQuery: "",
      searchedUser: null, // Lưu thông tin user tìm thấy
      loading: false, // Trạng thái loading khi tìm kiếm
      activeUsers: [],
      chats: JSON.parse(localStorage.getItem("recentChats")) || [],
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

        if (this.searchedUser) {
          this.addToRecentChats(this.searchedUser);
        }
      } catch (error) {
        console.error("User not found", error);
        this.searchedUser = null;
      }
    },
    addToRecentChats(user) {
      const newChat = {
        name: user.fullName,
        message: "Recently searched",
        time: new Date().toLocaleDateString(),
        color: "#fbbf24",
        initial: user.fullName.charAt(0).toUpperCase(),
      };
      // Remove any existing chat with the same name
      this.chats = this.chats.filter((chat) => chat.name !== user.fullName);
      // Add the new chat to the beginning of the array
      this.chats.unshift(newChat);
      // Save to local storage
      localStorage.setItem("recentChats", JSON.stringify(this.chats));
    },
    selectUser(user) {
      const authStore = useAuthStore();
      authStore.setSelectedUserWalletAddress(user.walletAddress);
      console.log(
        "Selected User Wallet Address:",
        authStore.selectedUserWalletAddress
      ); // Debug log
      console.log("My Wallet Address:", authStore.walletAddress); // Debug log
      this.$emit("user-selected", user);
    },
  },
});
</script>

<style scoped>
.chat-container {
  width: 100%;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.search-bar {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  outline: none;
  font-size: 16px;
}

.searched-user {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.searched-user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.searched-user-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.active-users {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.active-user {
  position: relative;
}

.active-user img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #4caf50;
}

.online-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: #4caf50;
  border-radius: 50%;
  border: 2px solid #fff;
}

.chat-list {
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.chat-item:last-child {
  border-bottom: none;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-weight: bold;
  margin-right: 10px;
}

.chat-info {
  flex-grow: 1;
}

.chat-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.chat-message {
  font-size: 14px;
  color: #666;
}

.chat-time {
  font-size: 12px;
  color: #999;
}
</style>
