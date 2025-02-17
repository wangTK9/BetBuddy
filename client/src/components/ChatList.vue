<template>
  <div class="chat-container">
    <div class="card">
      <div class="card-header">
        <h2>Chats</h2>
        <i class="fas fa-user-plus add-member-icon" @click="openAddMemberModal"></i>
      </div>

      <!-- Modal Add Member -->
      <!-- Modal -->
      <div v-if="showAddMemberModal" class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h2>Add Member</h2>
            <button @click="closeAddMemberModal">✖</button>
          </div>
          <div class="modal-body">
            <input v-model="newMemberEmail" type="email" placeholder="Enter name" />
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="closeAddMemberModal">Close</button>
            <button class="btn-save" @click="addMember">OK</button>
          </div>
        </div>
      </div>

      <div class="search-box">
        <input type="text" placeholder="Search messages or users" v-model="searchQuery" @input="searchUser" />
        <i class="fas fa-search"></i>
      </div>
      <div v-if="searchedUser" class="searched-user" @click="selectUser(searchedUser)">
        <img :src="'/avatar-trang-4.jpg'" :alt="searchedUser.fullName" class="searched-user-avatar" />
        <p class="searched-user-name">{{ searchedUser.fullName }}</p>
      </div>
      <div class="active-users">
        <h2>Active Users</h2>
        <div class="user-list">
          <div class="user" v-for="user in activeUsers" :key="user.name">
            <div class="avatar">{{ user.initial }}</div>
            <div class="name">{{ user.name }}</div>
          </div>
        </div>
      </div>
      <div class="recent-title">
        <h2>Recent</h2>
      </div>
      <div class="recent-item">
        <div class="chat-list">
          <div class="chat-item" v-for="chat in filteredChats" :key="chat.name">
            <div class="chat-avatar" :style="{ backgroundColor: chat.color }">{{ chat.initial }}</div>
            <div class="chat-info">
              <p class="chat-name">{{ chat.name }}</p>
              <p class="chat-message">{{ chat.message }}</p>
            </div>
            <span class="chat-time">{{ chat.time }}</span>
            <div class="icons">
              <i class="fas fa-comment-dots"></i>
              <i class="fas fa-phone"></i>
              <i class="fas fa-video"></i>
            </div>
          </div>
        </div>
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
      searchedUser: null,
      activeUsers: [
        { name: "Alice", initial: "A" },
        { name: "Bob", initial: "B" },
        { name: "Charlie", initial: "C" }
      ],
      chats: JSON.parse(localStorage.getItem("recentChats")) || [],
      showAddMemberModal: false,
      newMemberEmail: "",
      newMemberName: "", // Thêm state để nhập tên thành viên
    };
  },
  computed: {
    filteredChats() {
      return this.chats.filter(chat => chat.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }
  },
  methods: {
    async searchUser() {
      if (!this.searchQuery) {
        this.searchedUser = null;
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/api/user/search?email=${this.searchQuery}`);
        this.searchedUser = response.data.length > 0 ? response.data[0] : null;
      } catch (error) {
        console.error("User not found", error);
        this.searchedUser = null;
      }
    },
    selectUser(user) {
      this.$emit("user-selected", user);
    },
    openAddMemberModal() {
      this.showAddMemberModal = true;
    },
    closeAddMemberModal() {
      this.showAddMemberModal = false;
      this.newMemberEmail = "";
      this.newMemberName = "";
    },
    async addMember() {
      if (this.newMemberEmail.trim() === "" || this.newMemberName.trim() === "") {
        alert("Vui lòng nhập đầy đủ tên và email!");
        return;
      }

      try {
        const response = await axios.post("http://localhost:5000/api/chat/addMember", {
          email: this.newMemberEmail
        });

        if (response.data.success) {
          this.activeUsers.push({
            name: this.newMemberName,
            initial: this.newMemberName.charAt(0).toUpperCase()
          });
          alert("Thành viên đã được thêm!");
        } else {
          alert("Không thể thêm thành viên. Hãy kiểm tra lại!");
        }
      } catch (error) {
        console.error("Lỗi khi thêm thành viên:", error);
        alert("Đã xảy ra lỗi!");
      }

      this.closeAddMemberModal();
    }
  }
};
</script>


<style scoped>
.chat-container {
  display: flex;
  min-height: 100vh;
  width: 470px;
  background-color: #f3f4f6;
  padding: 16px;
}

.card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  padding: 24px;
  width: 100%;
  max-width: 470px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  color: #7c3aed;
  font-size: 24px;
}

.card-header i {
  color: #7c3aed;
  font-size: 24px;
}

/* Hiệu ứng xuất hiện modal */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Overlay nền mờ khi mở modal */
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  z-index: 1000;
}

/* Modal */
.modal {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 700px;
  height: 200px;
  animation: fadeIn 0.3s ease-out;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.modal-header h2 {
  font-size: 22px;
  color: #7c3aed;
  font-weight: bold;
  margin: 0;
}

.modal-header button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: po  inter;
  color: #888;
}

.modal-header button:hover {
  color: #333;
}

/* Input field */
.modal-body input {
  width: 630px;
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  transition: border 0.3s;
}

.modal-body input:focus {
  border: 1px solid #5b73e8;
  outline: none;
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-footer button {
  padding: 8px 15px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-cancel {
  background: none;
  color: #7c3aed;
}

.btn-cancel:hover {
  text-decoration: underline;
}

.btn-save {
  background: #7c3aed;
  color: #fff;
}

.btn-save:hover {
  background: #3d5ad6;
}


.search-box {
  margin-bottom: 16px;
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 1px solid #d1d5db;
  border-radius: 25px;
  padding: 8px 16px;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 10px;
  background: transparent;
}

.search-box input::placeholder {
  color: #9ca3af;
}

.search-box i {
  color: #7c3aed;
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s;
}

.search-box:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.search-box input:focus {
  border: none;
  outline: none;
  box-shadow: 0 0 5px rgba(124, 58, 237, 0.5);
}

.searched-user {
  display: flex;
  align-items: center;
  background: #f9fafb;
  padding: 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.searched-user:hover {
  background: #ede9fe;
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.searched-user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
  border: 2px solid #7c3aed;
}

.searched-user-name {
  font-size: 16px;
  font-weight: 600;
  color: #4b5563;
}


.active-users {
  margin-bottom: 16px;
}

.active-users h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #7c3aed;
}

.active-users .user-list {
  display: flex;
  overflow-x: auto;
  gap: 16px;
}

.active-users .user {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 1s ease-in-out;
}

.active-users .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #7c3aed;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  position: relative;
  transition: transform 0.3s;
}

.active-users .avatar:hover {
  transform: scale(1.1);
}

.active-users .avatar::after {
  content: '';
  width: 10px;
  height: 10px;
  background-color: #34d399;
  border: 2px solid white;
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  right: 0;
}

.active-users .name {
  font-weight: 600;
  color: #4b5563;
  margin-top: 4px;
  font-size: 14px;
}

/* 
.user-list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
}

.user {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  background-color: #7c3aed;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
} */

.recent-title {
  font-size: 18px;
  margin-bottom: 8px;
  color: #7c3aed;
}

.recent-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
  transition: transform 0.3s, box-shadow 0.3s;
  animation: fadeIn 1s ease-in-out;
}

.recent-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.recent-item:last-child {
  margin-bottom: 0;
}

.recent-item .chat-list .chat-item .chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #7c3aed !important;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-right: 16px;
  font-size: 18px;
}

.recent-item .chat-info {
  flex: 1;
}

.recent-item .chat-info .chat-name {
  font-weight: 600;
  color: #4b5563;
}

.recent-item .chat-info .chat-time {
  font-size: 12px;
  color: #6b7280;
}

.recent-item .chat-info .chat-message {
  font-size: 14px;
  color: #6b7280;
}

.recent-item .icons {
  display: flex;
  gap: 8px;
  margin-left: 15px;
}

.recent-item .icons i {
  color: #6b7280;
  font-size: 18px;
  transition: color 0.3s;
}

.recent-item .icons i:hover {
  color: #7c3aed;
}

.chat-list {
  margin-top: 16px;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 8px;

}

.chat-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  font-size: 18px;
}

.chat-info {
  flex: 1;
  margin-left: 12px;
}

.chat-name {
  font-weight: bold;
  color: #4b5563;
}

.chat-message {
  font-size: 14px;
  color: #6b7280;
}

.chat-time {
  font-size: 12px;
  color: #9ca3af;
}
</style>
