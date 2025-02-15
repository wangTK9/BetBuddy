<template>
  <div class="privy-login-container">
    <button @click="openModal">
      Login with Google
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { createCapsuleModalConnector } from "../connectors/capsule-modal-connector";
import { capsuleClient } from "../services/capsule";

const router = useRouter();
const modalConnector = ref<any>(null);

onMounted(() => {
  const container = document.createElement("div");
  document.body.appendChild(container);

  modalConnector.value = createCapsuleModalConnector(container, {
    capsule: capsuleClient,
    appName: "Capsule in Vue + Vite",
    // Ép kiểu để có thể sử dụng onSuccess
    onSuccess: (user: any) => {
      console.log("Đăng nhập thành công:", user);
      if (user && user.email) {
        // Xử lý đăng nhập thành công
        router.push("/home");
      } else {
        console.error("Thông tin người dùng không hợp lệ");
        alert("Đăng nhập không thành công.");
      }
    },
    onClose: () => {
      modalConnector.value?.close();
    },
  } as any); // Ép kiểu CapsuleModalProps nếu cần thiết
});

onUnmounted(() => {
  modalConnector.value?.unmount();
});

const openModal = () => {
  modalConnector.value?.open();
};
</script>

<style scoped>
.privy-login-container {
  width: 100%;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

button {
  width: 100%;
  padding: 12px;
  margin-bottom: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #EA4335; /* Màu xanh đặc trưng của Google */
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button:hover {
  background-color: #c1351d; /* Màu xanh đậm khi hover */
  transform: translateY(-2px);
}

button:active {
  background-color: #c1351d; /* Màu xanh đậm khi click */
  transform: translateY(0);
}

</style>
