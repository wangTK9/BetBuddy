<template>
  <div class="container_poll-main">
    <div class="poll-container" :class="{ expanded: settingsOpen }">
      <div class="poll-content">
        <h2>Create Poll</h2>
        <textarea v-model="question" placeholder="Enter poll question" maxlength="200"></textarea>
        <div class="char-count">{{ charCount }}/200</div>

        <input class="link_add" placeholder="Reference link"> <pre>
        </pre>

        <div class="options">
          <div class="option-item" v-for="(option, index) in options" :key="index">
            <input type="text" v-model="option.text" :placeholder="'Option ' + (index + 1)" />
            <button v-if="index >= 2" @click="removeOption(index)" class="remove-option">X</button>
          </div>
          <button @click="addOption" id="addOption">+ Add Option</button>
        </div>

        <div class="bottom-bar">
          <div class="left-buttons">
            <button @click="closeForm">Cancel</button>
            <button :disabled="!canCreate" @click="create">Create Poll</button>
          </div>
          <button id="settingsBtn" @click="toggleSettings">⚙️</button>
        </div>
      </div>

      <div class="settings-container" :class="{ open: settingsOpen }">
        <h3>Settings</h3>
        <label id="header-setting">Poll Expiration Time</label>
        <input type="datetime-local" :value="formattedExpirationTime" @input="updateExpirationTime" />

        <div class="hr_content"><hr /></div>
        <label id="header-setting">Advanced Settings</label>
        <label>
          <span>Pin to top of chat</span>
          <label class="toggle-switch">
            <input type="checkbox" v-model="pinChat" />
            <span class="slider"></span>
          </label>
        </label>
        <label>
          <span>Allow multiple choices</span>
          <label class="toggle-switch">
            <input type="checkbox" v-model="multipleOptions" checked />
            <span class="slider"></span>
          </label>
        </label>
        <label>
          <span>Allow adding options</span>
          <label class="toggle-switch">
            <input type="checkbox" v-model="canAddOptions" />
            <span class="slider"></span>
          </label>
        </label>
        <div class="hr_content"><hr /></div>
        <label id="header-setting">Anonymous Voting</label>
        <label>
          <span>Hide voter identities</span>
          <label class="toggle-switch">
            <input type="checkbox" v-model="anonymous" />
            <span class="slider"></span>
          </label>
        </label>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
      question: "",
      options: [{ text: "" }, { text: "" }],
      settingsOpen: false,
      pinChat: false,
      multipleOptions: true,
      canAddOptions: true,
      anonymous: false,
      expirationTime: null,
    };
  },
  computed: {
    charCount() {
      return this.question.length;
    },
    canCreate() {
      return (
        this.question.trim().length > 0 &&
        this.options.every((option) => option.text.trim().length > 0)
      );
    },
    formattedExpirationTime() {
      if (!this.expirationTime) return "";
      const date = new Date(this.expirationTime);
      return date.toISOString().slice(0, 16);
    },
  },
  methods: {
    closeForm() {
      console.log("Đóng form");
      this.$emit("close");  // Emit event về parent để đóng popup
    },
    addOption() {
      if (this.options.length < 3) {
        this.options.push({ text: "" });
      }
    },
    removeOption(index) {
      if (this.options.length > 2) {
        this.options.splice(index, 1);
      }
    },
    updateExpirationTime(event) {
      this.expirationTime = event.target.value ? new Date(event.target.value).toISOString() : null;
    },
    create() {
      if (!this.canCreate) return;

      const payload = {
        question: this.question,
        options: this.options.map((opt) => ({ text: opt.text.trim() })),
        expirationTime: this.expirationTime,
        settings: {
          pinChat: this.pinChat,
          multipleOptions: this.multipleOptions,
          canAddOptions: this.canAddOptions,
          anonymous: this.anonymous,
        },
      };

      console.log("📌 Gửi dữ liệu:", payload);

      axios
        .post("http://localhost:5000/api/poll", payload)
        .then((response) => {
          console.log("✅ Bình chọn đã gửi thành công:", response.data);
          this.$emit("poll-created", response.data);
          this.closeForm(); // Đóng form sau khi tạo thành công
        })
        .catch((error) => {
          console.error("❌ Lỗi khi gửi bình chọn:", error);
        });
    },
    toggleSettings() {
      this.settingsOpen = !this.settingsOpen;
    },
  },
};
</script>



<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

/* .container_poll-main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
} */

.poll-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  width: 500px;
  transition: width 0.3s ease;
  overflow: hidden;
  position: relative;
  border: 1px solid #ddd;
}

.poll-container.expanded {
  width: 680px;
}

.poll-content {
  flex: 1;
}

h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

textarea {
  width: 100%;
  height: 80px;
  resize: none;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  font-size: 14px;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: gray;
  margin-bottom: 10px;
}

.options {
  margin-bottom: 10px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.option-item input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  font-size: 14px;
}
.link_add{
 flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  font-size: 14px;
}
.remove-option {
  color: rgb(9, 9, 9);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  display: block; /* Ensure the remove button is displayed */
}

.remove-option:hover {
  background: #ffffff;
}

#addOption {
  background: #007bff;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;
  text-align: center;
}

#addOption:hover {
  background: #0056b3;
}

.bottom-bar {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  align-items: center;
}

.bottom-bar button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

#settingsBtn {
  background: #eee;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: transform 0.3s ease;
}

#settingsBtn:hover {
  transform: rotate(90deg);
}

#cancel {
  background: #f44336;
  color: white;
}

#create {
  background: #007bff;
  color: white;
}

/* Settings Panel */
.settings-container {
  width: 0;
  overflow: hidden;
  transition: width 0.3s ease;
  padding: 0;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
}

.settings-container.open {
  margin-left: 5px;
  margin-bottom: 10px;
  width: 240px;
  padding: 15px;
}

.settings-container h3 {
  margin-top: 0;
  font-size: 16px;
  text-align: center;
  margin-bottom: 10px;
}

.settings-container label {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 10px;
}

.settings-container input[type="checkbox"] {
  transform: scale(1.2);
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 20px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 10px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  border-radius: 50px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #007bff;
}

input:checked + .slider:before {
  transform: translateX(14px);
}

/* Dấu X để đóng form */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  color: #333;
  cursor: pointer;
}

.close-btn:hover {
  color: red;
}

.bottom-bar {
  display: flex;
  justify-content: space-between; /* Chia đều giữa các phần tử */
  align-items: center;
  margin-top: 50px;
}

.bottom-bar .left-buttons {
  display: flex;
  gap: 10px; /* Khoảng cách giữa các nút Hủy và Tạo bình chọn */
}

.bottom-bar button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

#settingsBtn {
  background: #eee;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: transform 0.3s ease;
}

#settingsBtn:hover {
  transform: rotate(90deg);
}

#cancel {
  background: #f44336;
  color: white;
}

#create {
  background: #007bff;
  color: white;
}

#datetime {
  width: 100%;
  height: 30px;
}

.flatpickr-input {
  width: 100%;
  height: 30px;
  border-radius: 5px;
}

#datetime::-webkit-calendar-picker-indicator {
  display: none; /* Ẩn biểu tượng lịch mặc định */
}

#datetime {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 2px solid #ccc;
  border-radius: 8px;
  margin-bottom: 15px;
  outline: none;
  transition: border-color 0.3s ease;
}

.hr_content {
  top: 20px;
  width: 100%;
  height: 20px;
}

#header-setting {
  color: black;
  font-weight: 700;
}
</style>
