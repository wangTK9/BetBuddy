<template>
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
            <div
              class="status-dot"
              :class="{ online: user.isOnline, offline: !user.isOnline }"
            ></div>
          </div>
        </div>

        <div class="select_main-profile-bio">
          <p class="content-bio">
            <strong></strong> {{ user.bio || "Chưa cập nhật" }}
          </p>
        </div>

        <!-- Dropdown cho About -->
        <div class="parent-container">
          <button class="dropdown-btn" @click="toggleAbout">
            {{ showAbout ? "Ẩn" : "Hiển thị" }} About
          </button>
        </div>
        <transition name="slide">
          <div v-if="showAbout" class="dropdown-content">
            <!-- User Info -->
            <div class="account-info">
              <p>
                <strong>Họ và tên:</strong>
                {{ user.fullName || "Chưa cập nhật" }}
              </p>
              <p>
                <strong>Ngày sinh:</strong>
                {{ user.birthDate || "Chưa cập nhật" }}
              </p>
              <p><strong>Email:</strong> {{ user.email || "Chưa cập nhật" }}</p>

              <!-- Wallet Address -->
              <p v-if="showWallet">
                <strong>Wallet Address:</strong>
                <span class="wallet">{{
                  user.walletAddress || "Chưa cập nhật"
                }}</span>
              </p>

              <button @click="toggleWalletVisibility">
                {{ showWallet ? "Ẩn địa chỉ ví" : "Hiển thị địa chỉ ví" }}
              </button>
            </div>
          </div>
        </transition>

        <!-- Form Edit (TÁCH RIÊNG RA) -->
        <div v-if="isEditing" class="edit-form">
          <h3>Chỉnh sửa thông tin</h3>
          <label>Họ và tên:</label>
          <input v-model="editUser.fullName" type="text" />

          <label>Ngày sinh:</label>
          <input v-model="editUser.birthDate" type="date" />

          <label>Email:</label>
          <input v-model="editUser.email" type="email" />

          <label>Bio:</label>
          <input v-model="editUser.bio" type="text" />

          <div class="btn-group">
            <button class="save-btn" @click="updateUser">Lưu</button>
            <button class="cancel-btn" @click="toggleEdit">Hủy</button>
          </div>
        </div>
      </div>
      <div v-else class="loading">Đang tải dữ liệu...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const walletAddress = computed(() => authStore.walletAddress);
const user = ref(null);
const isEditing = ref(false);
const showMenu = ref(false);
const showAbout = ref(false);
const showWallet = ref(false);
const editUser = ref({ fullName: "", birthDate: "", email: "", bio: "" });

const fetchUser = async () => {
  if (!walletAddress.value) return;
  try {
    const response = await axios.get("http://localhost:5000/api/user/users");
    user.value =
      response.data.find((u) => u.walletAddress === walletAddress.value) ||
      null;
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
  }
};

watch(walletAddress, fetchUser, { immediate: true });

const toggleMenu = () => (showMenu.value = !showMenu.value);
const toggleAbout = () => {
  showAbout.value = !showAbout.value;
};
const toggleWalletVisibility = () => (showWallet.value = !showWallet.value);

const editProfile = () => {
  showMenu.value = false;
  toggleEdit();
};

const logout = () => alert("Đã đăng xuất!");

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  editUser.value = { ...user.value };
};

const updateUser = async () => {
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
.container_profile-user {
  position: relative;
  width: 500px;
  height: 700px;
  max-height: 700px;
  overflow-y: auto; /* Chỉ cuộn theo chiều dọc */
  overscroll-behavior: contain !important;
  scrollbar-width: thin !important; /* Dành cho Firefox */
  scrollbar-color: #888 transparent; /* Màu thanh cuộn */
  background: #f5f7fb;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -0%);
}

/* Giảm kích thước thanh cuộn trên Chrome, Edge, Safari */
.container_profile-user::-webkit-scrollbar {
  width: 1px !important;  /* Độ rộng thanh cuộn (mặc định 16px, nên giảm nhỏ lại) */
}

.container_profile-user::-webkit-scrollbar-thumb {
  background: #888 !important; /* Màu thanh cuộn */
  border-radius: 10px !important; /* Bo tròn thanh cuộn */
}

.container_profile-user::-webkit-scrollbar-thumb:hover {
  background: #555 !important; /* Màu khi di chuột vào */
}

/* Ẩn hoàn toàn thanh cuộn nếu không cần thiết */
.container_profile-user::-webkit-scrollbar-track {
  background: transparent !important;
}


.select_main-profile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #ddd;
  background: #f9f9f9;
}

.select_main-profile-image {
  display: flex;
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
}
.select-main-bio-top {
  max-width: 100%;
  width: 400px;
  height: 70px;
  border-radius: 5%;
  top: 30%;
  left: 50%;
  transform: translate(-50%, 0%);
  position: absolute;
}
.content-bio {
  text-align: center;
  max-width: 100%;
  height: 70px;

  border-radius: 5%;

  padding: 10px; /* Thêm khoảng cách nội dung */
  box-sizing: border-box; /* Đảm bảo padding không ảnh hưởng đến kích thước tổng thể */
  overflow: hidden; /* Ẩn phần nội dung vượt ra ngoài */
  text-overflow: ellipsis; /* Hiển thị ba chấm nếu nội dung vượt quá */
  white-space: pre-line; /* Ngăn không cho văn bản xuống dòng */
}

.profile-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid black;
  top: 10px;
  position: relative;
}

.user-name {
  position: relative;
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
  color: black;
  text-align: center;
}
/* Trạng thái online/offline */

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  bottom: 15px;
  display: inline-block;
  position: relative;
  text-align: center;
}

.online {
  background-color: #4caf50; /* Xanh lá - Online */
}

.online::after {
  content: " Online"; /* Thêm chữ "Online" */
  margin-left: 20px; /* Khoảng cách giữa trạng thái và chữ */
  margin-top: -5px;
  position: absolute;
  font-size: 14px;
  color: #4caf50; /* Màu chữ phù hợp với trạng thái */
}

.offline {
  background-color: #f44336; /* Đỏ - Offline */
}

.offline::after {
  content: " Offline"; /* Thêm chữ "Offline" */
  margin-left: 8px; /* Khoảng cách giữa trạng thái và chữ */
  margin-top: -5px;
  position: absolute;
  font-size: 14px;
  color: #f44336; /* Màu chữ phù hợp với trạng thái */
}

.profile-right {
  position: relative;
  cursor: pointer;
}

.menu-icon {
  font-size: 24px;
  user-select: none;
}

.dropdown {
  width: 100px;
  height: 50px;
  position: absolute;
  top: 30px;
  right: 0;
  background: rgb(78, 75, 74);
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.dropdown button {
  display: block;
  width: 100%;
  padding: 10px;
  border: none;
  background: rgb(78, 75, 74);
  cursor: pointer;
  text-align: left;
}

.dropdown button:hover {
  background: rgb(78, 75, 74);
}
.account-info {
  width: 80%;
  height: 270px;
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 1px rgba(95, 95, 95, 0.1);
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -5%);
}

.account-info p {
  font-size: 16px;
  margin-bottom: 15px;
  color: #333;
}

.account-info strong {
  font-weight: bold;
  color: #555;
}

.wallet {
  color: #0071c2;
  font-weight: bold;
}

.account-info p:last-child {
  margin-bottom: 0; /* Không có khoảng cách dưới cùng */
}

.account-info p span {
  word-wrap: break-word; /* Đảm bảo địa chỉ ví không bị tràn ra ngoài */
}

.account-info p + p {
  border-top: 1px solid #ddd;
  padding-top: 10px;
  margin-top: 10px;
}
button {
  background-color: #0071c2; /* Màu nền */
  color: white; /* Màu chữ */
  padding: 4px 8px; /* Khoảng cách trong nút (bé hơn nữa) */
  border: none; /* Loại bỏ viền */
  border-radius: 12px; /* Các góc bo tròn nhẹ */
  font-size: 12px; /* Kích thước chữ nhỏ hơn */
  cursor: pointer; /* Con trỏ khi di chuột lên nút */
  transition: background-color 0.3s ease, transform 0.2s ease; /* Hiệu ứng chuyển màu nền và phóng to khi hover */
}

button:hover {
  background-color: #005fa3; /* Màu nền khi hover */
  transform: scale(1.1); /* Tăng nhẹ kích thước nút khi hover */
}

button:focus {
  outline: none; /* Loại bỏ đường viền khi nút được nhấn */
}
.edit-form {
  width: 80%;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;

  margin: 0 auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.edit-form label {
  display: block;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333; /* Màu chữ */
}

.edit-form input {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box; /* Đảm bảo không bị tràn */
}

.edit-form input:focus {
  border-color: #0071c2; /* Màu viền khi focus */
  outline: none; /* Loại bỏ outline mặc định */
}

.btn-group {
  display: flex;
  justify-content: flex-end;
}

.save-btn,
.cancel-btn {
  padding: 8px 16px;
  margin-left: 10px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-btn {
  background-color: #28a745; /* Màu xanh lá cho nút lưu */
  color: white;
}

.save-btn:hover {
  background-color: #218838;
}

.cancel-btn {
  background-color: #dc3545; /* Màu đỏ cho nút hủy */
  color: white;
}

.cancel-btn:hover {
  background-color: #c82333;
}
.dropdown-btn {
  margin: 10px 0;
  padding: 8px 12px;
  background-color: rgb(191, 201, 211);
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.dropdown-btn:hover {
  background-color: rgb(159, 193, 237);
  transform: none;
}

/* Style cho profile */
.account-info,
.edit-form {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
}

.edit-form input {
  display: block;
  width: 100%;
  margin: 5px 0;
  padding: 5px;
}

.btn-group {
  display: flex;
  justify-content: space-between;
}

.save-btn {
  background-color: green;
  color: white;
  padding: 8px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.cancel-btn {
  background-color: red;
  color: white;
  padding: 8px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
.parent-container {
  display: grid;
  place-items: center;
}

.dropdown-btn {
  width: 80%;
  height: 40px;
  background: rgba(118, 121, 123, 0.75);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  text-align: center;
}
.dropdown-content {
  width: 100%;
  overflow: hidden;
  background: #f9f9f9;

  transition: max-height 0.4s ease-in-out;
}

/* Vue Transition */
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.4s ease-in-out, opacity 0.4s;
}

.slide-enter,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
