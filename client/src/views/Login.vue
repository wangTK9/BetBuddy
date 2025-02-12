<template>
  <div class="login-container">
    <!-- Progress Bar -->
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressPercentage }"></div>
      </div>
      <div class="steps">
        <div
          v-for="n in 4"
          :key="n"
          class="step"
          :class="{ active: step >= n }"
        >
          {{ n }}
        </div>
      </div>
    </div>

    <!-- Bước 1 -->
    <div v-if="step === 1">
      <h2>Bước 1: Nhập tên của bạn</h2>
      <input type="text" v-model="user.fullName" placeholder="Nhập tên" />
      <button @click="nextStep">Tiếp tục</button>
    </div>

    <!-- Bước 2 -->
    <div v-else-if="step === 2">
      <h2>Bước 2: Chọn ngày sinh</h2>
      <input type="date" v-model="user.birthDate" />
      <button @click="nextStep">Tiếp tục</button>
    </div>

    <!-- Bước 3 -->
    <div v-else-if="step === 3">
      <LeapLogin />
      <PrivyLogin />
      <button @click="nextStep">Tiếp tục</button>
    </div>

    <!-- Bước 4 -->
    <div v-else-if="step === 4">
      <h2>Bước 4: Đăng nhập</h2>
      <input type="email" v-model="user.email" placeholder="Nhập email" />
      <button class="login-btn" @click="login">🔑 Đăng nhập</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import LeapLogin from "../components/LeapLogin.vue";
import PrivyLogin from "../components/PrivyLogin.vue";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const step = ref(1);
const user = ref({
  fullName: "",
  birthDate: "",
  walletAddress:
    authStore.walletAddress || localStorage.getItem("walletAddress") || "",
  email: "",
});

// Tính phần trăm progress bar
const progressPercentage = computed(() => `${(step.value - 1) * 33.33}%`);

// Chuyển bước & kiểm tra dữ liệu nhập vào
const nextStep = () => {
  if (step.value === 1 && !user.value.fullName.trim()) {
    alert("Vui lòng nhập tên");
    return;
  }
  if (step.value === 2 && !user.value.birthDate) {
    alert("Vui lòng chọn ngày sinh");
    return;
  }
  step.value++;
};

// Gửi dữ liệu lên server
const login = async () => {
  console.log("📌 Dữ liệu trước khi gửi:", JSON.stringify(user.value, null, 2));

  try {
    const response = await fetch("http://localhost:5000/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user.value),
    });

    const result = await response.json();
    if (response.ok) {
      console.log("✅ Đăng ký thành công:", result);
      alert("Đăng ký thành công!");
      router.push("/home");
    } else {
      console.error("❌ Lỗi đăng ký:", result);
      alert(result.message || "Lỗi khi đăng ký.");
    }
  } catch (error) {
    console.error("❌ Lỗi kết nối server:", error);
    alert("Không thể kết nối tới server.");
  }
};
</script>

<style scoped>
/* Container chính */
.login-container {
  text-align: center;
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Thanh tiến trình */
.progress-container {
  position: relative;
  margin-bottom: 20px;
}
.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}
.progress {
  height: 100%;
  background: #4caf50;
  width: 0%;
  transition: width 0.4s ease-in-out;
}

/* Số bước */
.steps {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.step {
  width: 35px;
  height: 35px;
  background: #ccc;
  border-radius: 50%;
  line-height: 35px;
  text-align: center;
  font-weight: bold;
  transition: 0.3s;
}
.step.active {
  background: #4caf50;
  color: white;
}

/* Input */
input {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px auto;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

/* Nút bấm */
button {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

/* Nút đăng nhập */
.login-btn {
  background: #4caf50;
  color: white;
}
.login-btn:hover {
  background: #45a049;
}
</style>
