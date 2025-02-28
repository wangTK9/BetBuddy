<template>
  <div class="container">
    <div class="login-container">
      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress" :style="{ width: progressPercentage }"></div>
        </div>
        <div class="steps">
          <div v-for="n in 4" :key="n" class="step" :class="{ active: step >= n }">
            {{ n }}
          </div>
        </div>
      </div>

      <!-- Step 1 -->
      <div v-if="step === 1" class="step-container">
        <h2>Step 1: Enter your name</h2>
        <input type="text" v-model="user.fullName" placeholder="Enter your name" />
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p> <!-- Display error message -->
        <button @click="nextStep">Continue</button>
      </div>

      <!-- Step 2 -->
      <div v-else-if="step === 2" class="step-container">
        <h2>Step 2: Select your birth date</h2>
        <input type="date" v-model="user.birthDate" />
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p> <!-- Display error message -->
        <button @click="nextStep">Continue</button>
      </div>

      <!-- Step 3 -->
      <div v-else-if="step === 3" class="step-container">
        <h2>Step 3: Log in to your wallet</h2>
        <LeapLogin />
        <PrivyLogin />
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p> <!-- Display error message -->
        <button @click="nextStep">Continue</button>
      </div>

      <!-- Step 4 -->
      <div v-else-if="step === 4" class="step-container">
        <h2>Step 4: Login</h2>
        <input type="email" v-model="user.email" placeholder="Enter your email" />
        <button class="login-btn" @click="login">🔑 Login</button>
      </div>
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
  bio: "",
});

const errorMessage = ref(""); // Error message variable

// Compute progress bar percentage
const progressPercentage = computed(() => `${(step.value - 1) * 33.33}%`);

// Move to the next step & validate input data
const nextStep = () => {
  if (step.value === 1 && !user.value.fullName.trim()) {
    errorMessage.value = "Please enter your name!"; // Update error message
    return;
  }
  if (step.value === 2 && !user.value.birthDate) {
    errorMessage.value = "Please select your birth date!"; // Error when birth date is not selected
    return;
  }
  errorMessage.value = ""; // Clear error message when the user inputs valid data
  step.value++;
};

// Send data to the server
const login = async () => {
  console.log("📌 Data before sending:", JSON.stringify(user.value, null, 2));

  try {
    const response = await fetch("http://localhost:5000/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user.value),
    });

    const result = await response.json();
    if (response.ok) {
      console.log("✅ Registration successful:", result);
      alert("Registration successful!");
      router.push("/home");
    } else {
      console.error("❌ Registration error:", result);
      alert(result.message || "Error during registration.");
    }
  } catch (error) {
    console.error("❌ Server connection error:", error);
    alert("Cannot connect to the server.");
  }
};
</script>


<style scoped>
@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

body,
html {
  height: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #98dfa5;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;

  background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);
}

/* Container chính */
.login-container {
  text-align: center;
  width: 450px;
  margin: auto;
  padding: 20px;
  /* background: #fff; */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: slideIn 0.5s ease-out;
}

.login-container:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
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
  background: #7c3aed;
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
  background: #7c3aed;
  color: white;
}

/* Căn giữa các bước */
.step-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  width: 100%;
}

/* Input */
input {
  width: 100%;
  padding: 12px 6px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  margin-bottom: 24px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(194, 151, 214, 0.2);
  outline: none;
}

/* Nút bấm */
button {
  width: 100%;
  background-color: #7c3aed;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease;
  position: relative;
  overflow: hidden;
}

button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300%;
  height: 300%;
  background: rgba(255, 255, 255, 0.15);
  transform: translate(-50%, -50%) rotate(45deg);
  transition: width 0.3s ease, height 0.3s ease;
}

button:hover::before {
  width: 0;
  height: 0;
}

button:hover {
  background-color: #7c3aed;
  transform: translateY(-2px);
}

button:active {
  background-color: #7c3aed;
  transform: translateY(0);
}

/* Nút đăng nhập */
.login-btn {
  background: #7c3aed;
  color: white;
}

.login-btn:hover {
  background: #7c3aed;
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 5px;
}
</style>
