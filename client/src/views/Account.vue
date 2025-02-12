<template>
  <div class="container-header-profile">
    <div class="account-container">
      <div v-if="user" class="account-card">
        <h2>Thông tin tài khoản</h2>
        <div v-if="!isEditing" class="account-info">
          <p>
            <strong>Họ và tên:</strong> {{ user.fullName || "Chưa cập nhật" }}
          </p>
          <p>
            <strong>Ngày sinh:</strong> {{ user.birthDate || "Chưa cập nhật" }}
          </p>
          <p><strong>Email:</strong> {{ user.email || "Chưa cập nhật" }}</p>
          <p>
            <strong>Wallet Address:</strong>
            <span class="wallet">{{
              user.walletAddress || "Chưa cập nhật"
            }}</span>
          </p>
          <button class="edit-btn" @click="toggleEdit">Chỉnh sửa</button>
        </div>

        <div v-else class="edit-form">
          <label>Họ và tên:</label>
          <input v-model="editUser.fullName" type="text" />

          <label>Ngày sinh:</label>
          <input v-model="editUser.birthDate" type="date" />

          <label>Email:</label>
          <input v-model="editUser.email" type="email" />

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
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const walletAddress = computed(() => authStore.walletAddress);
const user = ref(null);
const isEditing = ref(false);
const editUser = ref({
  fullName: "",
  birthDate: "",
  email: "",
});

// Lấy dữ liệu người dùng từ backend
const fetchUser = async () => {
  if (!walletAddress.value) {
    console.error("Không có wallet address.");
    return;
  }

  try {
    const response = await axios.get("http://localhost:5000/api/user/users");
    const foundUser = response.data.find(
      (u) => u.walletAddress === walletAddress.value
    );

    if (foundUser) {
      user.value = foundUser;
    } else {
      console.warn("Không tìm thấy user với địa chỉ ví:", walletAddress.value);
    }
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu:", error);
  }
};

// Mở/đóng form chỉnh sửa
const toggleEdit = () => {
  if (isEditing.value) {
    isEditing.value = false;
  } else {
    // Copy thông tin cũ vào form chỉnh sửa
    editUser.value = { ...user.value };
    isEditing.value = true;
  }
};

// Cập nhật thông tin người dùng
const updateUser = async () => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/user/update/${user.value.walletAddress}`,
      editUser.value,
      {
        headers: {
          "Content-Type": "application/json", // Đảm bảo header chính xác
        },
      }
    );
    console.log("Phản hồi API cập nhật:", response.data);

    // Cập nhật thông tin người dùng sau khi thành công
    user.value = { ...editUser.value };
    isEditing.value = false; // Đóng form chỉnh sửa
  } catch (error) {
    console.error("Lỗi khi cập nhật user:", error);
  }
};

// Tải dữ liệu khi component được mount
onMounted(fetchUser);
</script>

<style scoped>
.container-header-profile {
  width: 500px;
  height: 700px;
  background-color: red;
}
</style>
