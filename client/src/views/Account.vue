<template>
  <div v-if="user">
    <h2>Thông tin tài khoản</h2>
    <p><strong>Họ và tên:</strong> {{ user.fullName || "Chưa cập nhật" }}</p>
    <p><strong>Ngày sinh:</strong> {{ user.birthDate || "Chưa cập nhật" }}</p>
    <p><strong>Email:</strong> {{ user.email || "Chưa cập nhật" }}</p>
    <p><strong>Wallet Address:</strong> {{ user.walletAddress }}</p>
  </div>
  <div v-else>
    <p>Đang tải dữ liệu...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const walletAddress = computed(() => authStore.walletAddress);
const user = ref(null);

const fetchUser = async () => {
  console.log("Wallet Address từ Pinia:", walletAddress.value); // Kiểm tra giá trị

  if (!walletAddress.value) {
    console.error("Không có wallet address.");
    return;
  }

  try {
    const response = await axios.get("http://localhost:5000/api/user/users");
    console.log("Dữ liệu nhận được từ API:", response.data);

    // Tìm user có walletAddress trùng khớp
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

// Gọi API khi component được mount
onMounted(fetchUser);
</script>
