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

          <!-- Dropdown About -->
          <div class="parent-container">
            <button
              class="dropdown-btn flex items-center justify-between w-full px-4 py-2 border rounded-lg"
              @click="toggleAbout"
            >
              <div class="flex items-center">
                <i class="fas fa-user mr-2"></i> About
              </div>
              <i
                :class="showAbout ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"
              ></i>
            </button>
          </div>
          <transition name="slide">
            <div v-if="showAbout" class="dropdown-content">
              <div class="account-info">
                <p>
                  Họ và tên: <br />
                  <strong>{{ user.fullName || "Chưa cập nhật" }} </strong>
                </p>
                <p>
                  Ngày sinh: <br />
                  <strong> {{ user.birthDate || "Chưa cập nhật" }} </strong>
                </p>
                <p>
                  Email: <br />
                  <strong> {{ user.email || "Chưa cập nhật" }} </strong>
                </p>

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
        <input
          placeholder="Họ và tên"
          v-model="editUser.fullName"
          type="text"
        />
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
import "@fortawesome/fontawesome-free/css/all.css";

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
    user.value =
      response.data.find((u) => u.walletAddress === walletAddress.value) ||
      null;
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
.data-tab-engine {
}
.content_main_header_profile {
  position: relative;
  max-width: 450px;
}
.container_profile-user {
  position: relative;
  max-width: 90%;
  height: 700px;
  max-height: 700px;
  overflow-y: auto; /* Chỉ cuộn theo chiều dọc */
  /* overscroll-behavior: contain; */
  background: #f5f7fb36 !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -0%);
  z-index: 2;
}

.select_main-profile {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  text-align: start;
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
  color: black;
}

.dropdown {
  width: 100px;
  height: 50px;
  position: absolute;
  top: 30px;
  right: 0;
  background: rgb(251, 251, 251);
  color: black;
  z-index: 10;
}

.dropdown button {
  display: block;
  width: 100%;
  padding: 10px;
  border: none;
  background: rgb(255, 255, 255);
  cursor: pointer;
  text-align: left;
  color: black;
}

.dropdown button:hover {
  background: rgb(78, 75, 74);
}
.account-info {
  width: 80%;
  margin-top: 20px;
  padding: 0px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 1px rgba(224, 224, 224, 0.1);
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
  border: 1px solid #ffffff;
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
  background-color: #f5f7fb;
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
  border: 1px solid #f6f6f6;
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
}

.edit-form input {
  display: block;
  width: 100%;
  margin: 5px 0;
  padding: 5px;
  z-index: 4;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  border: 1px solid #dedfdfa4;
  padding: 15px;
  border-radius: 8px;
  background: #f5f7fb60;
  cursor: pointer;
}

.dropdown-btn i {
  font-size: 16px;
  color: #7b7b7bc5;
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
/* Modal - Hiển thị giữa màn hình và đè lên các thẻ khác */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* Làm mờ nền */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Nội dung modal */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s ease-in-out;
}

/* Hiệu ứng fade in */
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

/* Input */
.modal-content label {
  display: block;
  font-weight: bold;
  text-align: left;
  margin-top: 10px;
}

/* Nhóm nút */
.btn-group {
  margin-top: 15px;
  display: flex;
  justify-content: space-around;
}

/* Nút Lưu */
.save-btn {
  background-color: #007bff;
  color: white;
  padding: 8px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  transition: 0.3s;
}

.save-btn:hover {
  background-color: #0056b3;
}

/* Nút Hủy */
.cancel-btn {
  background-color: #dc3545;
  color: white;
  padding: 8px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  transition: 0.3s;
}

.cancel-btn:hover {
  background-color: #a71d2a;
}
/* Modal - Hiển thị giữa màn hình và đè lên các thẻ khác */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* Làm mờ nền */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Nội dung modal */
.modal-content {
  background: white;
  padding: 25px; /* Tăng padding để form trông thoáng hơn */
  border-radius: 8px;
  width: 450px; /* Tăng kích thước form */
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  top: -70px; /* Nhích form lên trên */
}

/* Hiệu ứng fade in */
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

/* Input */
.modal-content label {
  display: block;
  font-weight: bold;
  text-align: left;
  margin-top: 10px;
}

.modal-content input {
  width: 100%;
  height: 50px;
  margin-top: 5px;
  border: 1px solid #ffffff;
  border-radius: 5px;
  font-size: 14px;
}

/* Nhóm nút */
.btn-group {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end; /* Đẩy nút về bên phải */
  gap: 10px; /* Tạo khoảng cách giữa các nút */
}

/* Nút Lưu */
.save-btn {
  background-color: #007bff;
  color: white;
  padding: 8px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  transition: 0.3s;
}

.save-btn:hover {
  background-color: #0056b3;
}

/* Nút Hủy */
.cancel-btn {
  background-color: #dc3545;
  color: white;
  padding: 8px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
  transition: 0.3s;
}

.cancel-btn:hover {
  background-color: #a71d2a;
}
.error {
  color: red;
  height: 5px;
  font-size: 15px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.error-icon {
  position: absolute;
  right: 10px;
  color: red;
  font-weight: bold;
  font-size: 18px;
}

input.error {
  border: 2px solid red;
}
.input-group {
  position: relative;
  margin-bottom: 15px;
}

.error-icon {
  font-size: 25px;
  position: absolute;
  right: 20px;
  top: 60%;
  transform: translateY(-50%);
  color: red;
  font-weight: bold;
}
</style>
