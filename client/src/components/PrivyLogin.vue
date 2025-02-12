<template>
  <div class="container-privy">
    <button @click="openModal">Login with Google</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router"; // Import Vue Router
import { createCapsuleModalConnector } from "../connectors/capsule-modal-connector";
import { capsuleClient } from "../services/capsule";

const router = useRouter(); // Khởi tạo router
const modalConnector = ref<any>(null);

onMounted(() => {
  const container = document.createElement("div");
  document.body.appendChild(container);

  modalConnector.value = createCapsuleModalConnector(container, {
    capsule: capsuleClient,
    appName: "Capsule in Vue + Vite",
    onSuccess: (user) => {
      console.log("Đăng nhập thành công:", user);
      // router.push("/home");
    },
    onClose: () => {
      modalConnector.value?.close();
    },
  });
});

onUnmounted(() => {
  modalConnector.value?.unmount();
});

const openModal = () => {
  modalConnector.value?.open();
};
</script>

<style scoped>
/* CSS giữ nguyên */
</style>
