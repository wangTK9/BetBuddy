<template>
  <div class="content_main_header_profile">
    <div class="container_profile-user">
      <div class="account-container">
        <div v-if="user" class="account-card">
          <div class="select_main-profile">
            <h2>My Profile</h2>
            <div class="profile-right">
              <span class="menu-icon" @click="toggleMenu">⋮</span>
              <transition name="fade">
                <div v-if="showMenu" class="dropdown">
                  <button @click="editProfile">Chỉnh sửa</button>
                  <button @click="logout">Đăng xuất</button>
                </div>
              </transition>
            </div>
          </div>

          <div class="select_main-profile-image">
            <div class="select_main-image-top">
              <img
                :src="user.profileImage || 'https://i.pravatar.cc/100'"
                alt="Avatar"
                class="profile-avatar"
              />
              <p class="user-name">{{ user.fullName || "Chưa cập nhật" }}</p>
              <div class="status-dot" :class="{ online: user.isOnline, offline: !user.isOnline }"></div>
            </div>
          </div>

          <div class="select_main-profile-bio">
            <p class="content-bio">
              <strong></strong> {{ user.bio || "Chưa cập nhật" }}
            </p>
          </div>

          <!-- Dropdown About -->
          <div class="parent-container">
            <button class="dropdown-btn flex items-center justify-between w-full px-4 py-2 border rounded-lg" @click="toggleAbout">
              <div class="flex items-center">
                <i class="fas fa-user mr-2"></i> About
              </div>
              <i :class="showAbout ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
            </button>
          </div>
          <transition name="slide">
            <div v-if="showAbout" class="dropdown-content">
              <div class="account-info">
                <p>Họ và tên: <br> <strong>{{ user.fullName || "Chưa cập nhật" }} </strong> </p>
                <p>Ngày sinh: <br> <strong>  {{ user.birthDate || "Chưa cập nhật" }} </strong> </p>
                <p>Email: <br> <strong>  {{ user.email || "Chưa cập nhật" }} </strong> </p>

                <p v-if="showWallet">
                  <strong>Wallet Address:</strong>
                  <span class="wallet">{{ user.walletAddress || "Chưa cập nhật" }}</span>
                </p>

                <button @click="toggleWalletVisibility">
                  {{ showWallet ? "Ẩn địa chỉ ví" : "Hiển thị địa chỉ ví" }}
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>

  <!-- Form Edit - Hiển thị ở giữa màn hình -->
  <div v-if="isEditing" class="modal">
  <div class="modal-content">
    <h3>Chỉnh sửa thông tin</h3>

    <div class="input-group">
      <label>Họ và tên:</label>
      <input placeholder="Họ và tên" v-model="editUser.fullName" type="text" />
      <span v-if="validationErrors.fullName" class="error-icon">!</span>
    </div>

    <div class="input-group">
      <label>Ngày sinh:</label>
      <input placeholder="Date" v-model="editUser.birthDate" type="date" />
      <span v-if="validationErrors.birthDate" class="error-icon">!</span>
    </div>

    <div class="input-group">
      <label>Email:</label>
      <input placeholder="Email" v-model="editUser.email" type="email" />
      <span v-if="validationErrors.email" class="error-icon">!</span>
    </div>

    <div class="input-group">
      <label>Bio:</label>
      <input placeholder="Bio" v-model="editUser.bio" type="text" />
      <span v-if="validationErrors.bio" class="error-icon">!</span>
    </div>

    <div class="btn-group">
      <button class="save-btn" @click="updateUser">Lưu</button>
      <button class="cancel-btn" @click="toggleEdit">Hủy</button>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import '@fortawesome/fontawesome-free/css/all.css';

const authStore = useAuthStore();
const walletAddress = computed(() => authStore.walletAddress);
const user = ref(null);
const isEditing = ref(false);
const showMenu = ref(false);
const showAbout = ref(false);
const showWallet = ref(false);
const editUser = ref({ fullName: "", birthDate: "", email: "", bio: "" });
const validationErrors = ref({});

const fetchUser = async () => {
  if (!walletAddress.value) return;
  try {
    const response = await axios.get("http://localhost:5000/api/user/users");
    user.value = response.data.find((u) => u.walletAddress === walletAddress.value) || null;
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
  }
};

watch(walletAddress, fetchUser, { immediate: true });

const toggleMenu = () => (showMenu.value = !showMenu.value);
const toggleAbout = () => (showAbout.value = !showAbout.value);
const toggleWalletVisibility = () => (showWallet.value = !showWallet.value);

const editProfile = () => {
  showMenu.value = false;
  toggleEdit();
};

const logout = () => alert("Đã đăng xuất!");

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  editUser.value = { fullName: "", birthDate: "", email: "", bio: "" };
  validationErrors.value = {}; // Reset lỗi khi mở form
};

const updateUser = async () => {
  validationErrors.value = {}; // Xóa lỗi trước khi kiểm tra

  if (!editUser.value.fullName.trim()) {
    validationErrors.value.fullName = "Vui lòng nhập họ và tên!";
  }
  if (!editUser.value.birthDate) {
    validationErrors.value.birthDate = "Vui lòng chọn ngày sinh!";
  }
  if (!editUser.value.email.trim()) {
    validationErrors.value.email = "Vui lòng nhập email!";
  }
  if (!editUser.value.bio.trim()) {
    validationErrors.value.bio = "Vui lòng nhập bio!";
  }

  if (Object.keys(validationErrors.value).length > 0) {
    return;
  }

  try {
    await axios.put(
      `http://localhost:5000/api/user/update/${user.value.walletAddress}`,
      editUser.value,
      { headers: { "Content-Type": "application/json" } }
    );
    fetchUser();
    isEditing.value = false;
  } catch (error) {
    console.error("Lỗi khi cập nhật user:", error);
  }
};
</script>


<style scoped>

.content_main_header_profile {
  position: relative;
  max-width: 470px;
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}

.container_profile-user {
  margin-top: 10px;
  position: relative;
  border-radius: 12px;
  overflow-y: auto;
  background: #f9f9f9;
  margin-top: 25px;
  left: 50%;
  transform: translate(-50%, -5%);
  padding: 10px;
}

.select_main-profile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #ddd;
  background: #f5f7fb;
  font-size: 16px;
  color: #7c3aed;
}

.select_main-profile-image {
  display: flex;
  margin-top: 16px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 160px;
  background: #f7f7ff;
}

.select_main-profile-bio {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100px;
  background: #f9f9f9;
  padding: 10px;
  text-align: center;
}

.select-main-bio-top {
  max-width: 100%;
  width: 400px;
  height: auto;
  border-radius: 8px;
  position: relative;
}

.content-bio {
  text-align: center;
  max-width: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  color: #666;
  
}

.profile-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #bcadd6;
}

.user-name {
  margin-top: 8px;
  font-size: 18px;
  font-weight: bold;
  color: black;
  text-align: center;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: 18px;
  display: inline-block;
  text-align: center;
}

.online {
  background-color: #4caf50;
}

.online::after {
  content: " Online";
  margin-left: 6px;
  font-size: 14px;
  color: #4caf50;
}

.offline {
  background-color: #f44336;
}

.offline::after {
  content: " Offline";
  margin-left: 6px;
  font-size: 14px;
  color: #f44336;
}

.account-info {
  width: 90%;
  margin: 20px auto;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(224, 224, 224, 0.1);
}

.account-info p {
  font-size: 14px;
  margin-bottom: 10px;
  color: #333;
}

.account-info strong {
  font-weight: bold;
  color: #555;
}

.dropdown-btn {
  background-color: #007BFF;
  color: white;
  width: 100%;
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.dropdown-btn button:hover {
  background-color: #005fa3;
  transform: scale(1.05);
}

.dropdown-btn button:focus {
  outline: none;
}

.modal-content {
  background: white;
  padding: 10px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ */
  margin-top: 10px;
  transition: max-height 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error {
  color: red;
  font-size: 14px;
}

/* Nút toggle ví */
button {
  background-color: #007BFF;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

.wallet {
  /* Chỉnh sửa phần địa chỉ ví */
  color: #007BFF; /* Màu địa chỉ ví */
  font-weight: 600;
  word-wrap: break-word; /* Đảm bảo địa chỉ ví xuống dòng khi cần thiết */
  white-space: normal; /* Cho phép nội dung xuống dòng nếu quá dài */
  overflow-wrap: break-word; /* Đảm bảo từ dài không bị tràn ra ngoài */
  word-break: break-all; /* Cắt chữ nếu quá dài */
  display: block; /* Đảm bảo nó chiếm hết chiều rộng */
  max-width: 100%; /* Giới hạn chiều rộng */

}


</style>
