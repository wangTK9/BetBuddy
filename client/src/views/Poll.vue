<template>
  <div class="container_poll-main">
    <div class="poll-container" :class="{ expanded: settingsOpen }">
      <div class="poll-content">
        <button class="close-btn" @click="closeForm">×</button>
        <h2>Tạo bình chọn</h2>
        <textarea v-model="question" placeholder="Đặt câu hỏi bình chọn" maxlength="200"></textarea>
        <div class="char-count">{{ charCount }}/200</div>

        <div class="options">
          <div class="option-item" v-for="(option, index) in options" :key="index">
            <input type="text" v-model="option.text" :placeholder="'Lựa chọn ' + (index + 1)">
            <button v-if="index >= 2" @click="removeOption(index)" class="remove-option">X</button>
          </div>
          <button @click="addOption" id="addOption">+ Thêm lựa chọn</button>
        </div>

        <div class="bottom-bar">
          <div class="left-buttons">
            <button @click="cancel">Hủy</button>
            <button :disabled="!canCreate" @click="create">Tạo bình chọn</button>
          </div>
          <button id="settingsBtn" @click="toggleSettings">⚙️</button>
        </div>
      </div>

      <div class="settings-container" :class="{ open: settingsOpen }">
        <h3>Cài đặt</h3>
        <label id="header-setting">Thời hạn bình chọn</label>
        <input type="text" ref="datetime" placeholder="Chọn thời gian kết thúc">
        <div class="hr_content">
          <hr>
        </div>
        <label id="header-setting">Thiết lập nâng cao</label>
        <label>
          <span>Ghim lên đầu trò chuyện</span>
          <label class="toggle-switch">
            <input type="checkbox" v-model="pinChat">
            <span class="slider"></span>
          </label>
        </label>
        <label>
          <span>Chọn nhiều phương án</span>
          <label class="toggle-switch">
            <input type="checkbox" v-model="multipleOptions" checked>
            <span class="slider"></span>
          </label>
        </label>
        <label>
          <span>Có thể thêm phương án</span>
          <label class="toggle-switch">
            <input type="checkbox" v-model="canAddOptions">
            <span class="slider"></span>
          </label>
        </label>
        <div class="hr_content">
          <hr>
        </div>
        <label id="header-setting">Bình chọn ẩn danh</label>
        <label>
          <span>Ẩn người bình chọn</span>
          <label class="toggle-switch">
            <input type="checkbox" v-model="anonymous">
            <span class="slider"></span>
          </label>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import axios from 'axios';

export default {
  data() {
    return {
      question: '',
      options: [
        { text: '' },
        { text: '' },
      ],
      settingsOpen: false,
      pinChat: false,
      multipleOptions: true,
      canAddOptions: true,
      anonymous: false,
      expirationTime: null,  // Thêm trường expirationTime để lưu thời gian hết hạn
    };
  },
  computed: {
    charCount() {
      return this.question.length;
    },
    canCreate() {
      // Kiểm tra xem câu hỏi và các lựa chọn có hợp lệ không
      return this.question.length > 0 && this.options.every(option => option.text.length > 0);
    },
  },
  methods: {
    closeForm() {
      this.$emit('close');
    },
    addOption() {
      if (this.options.length < 3) {
        this.options.push({ text: '' });
      }
    },
    removeOption(index) {
      if (this.options.length > 2) {
        this.options.splice(index, 1);
      }
    },
    cancel() {
      this.$emit('cancel');
    },
    create() {
      // Lấy thời gian hết hạn từ flatpickr
      const expiration = this.$refs.datetime.value
        ? new Date(this.$refs.datetime.value).toISOString()
        : null;

      // Kiểm tra tính hợp lệ của câu hỏi và các lựa chọn
      if (!this.question || !this.options.every(option => option.text.length > 0)) {
        this.$emit('error', 'Câu hỏi hoặc lựa chọn không hợp lệ!');
        console.log("Lỗi: Câu hỏi hoặc lựa chọn không hợp lệ.");
        return;
      }

      // Kiểm tra thời gian hết hạn
      if (expiration && isNaN(new Date(expiration).getTime())) {
        this.$emit('error', 'Thời gian hết hạn không hợp lệ!');
        console.log("Lỗi: Thời gian hết hạn không hợp lệ.");
        return;
      }

      // Gửi yêu cầu API với axios
      axios.post('http://localhost:5000/api/poll', {
        question: this.question,
        options: this.options,
        settings: {
          pinChat: this.pinChat,
          multipleOptions: this.multipleOptions,
          canAddOptions: this.canAddOptions,
          anonymous: this.anonymous,
          expirationTime: expiration,
        },
      })
      .then(response => {
        console.log("Dữ liệu bình chọn đã được gửi thành công:", response.data);
        this.$emit('create', {
          question: this.question,
          options: this.options,
          settings: {
            pinChat: this.pinChat,
            multipleOptions: this.multipleOptions,
            canAddOptions: this.canAddOptions,
            anonymous: this.anonymous,
            expirationTime: expiration, 
          },
        });
      })
      .catch(error => {
        console.error("Đã có lỗi xảy ra khi gửi dữ liệu:", error);
        this.$emit('error', 'Đã có lỗi xảy ra khi gửi dữ liệu.');
      });
          },

    toggleSettings() {
      this.settingsOpen = !this.settingsOpen;
    },
  },
  mounted() {
    // Khởi tạo flatpickr cho input thời gian
    flatpickr(this.$refs.datetime, {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      allowInput: true,  // Cho phép nhập trực tiếp thời gian
    });
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

.container_poll-main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
}

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