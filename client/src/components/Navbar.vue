<template>
  <div class="container">
    <div class="sidebar">
      <div class="logo">
        <i class="fas fa-chart-bar icon" style="color: #6b46c1;"></i>
      </div>
      
      <div class="icon-container" :class="{ 'icon-active-container': activeIcon === 'bell' }" @click="setActiveIcon('bell')">
        <i class="fas fa-bell icon" :class="{ 'icon-active': activeIcon === 'bell' }"></i>
      </div>
      
      <div class="icon-container" :class="{ 'icon-active-container': activeIcon === 'comment' }" @click="setActiveIcon('comment')">
        <i class="fas fa-comment-dots icon" :class="{ 'icon-active': activeIcon === 'comment' }"></i>
      </div>
      
      <div class="icon-container" :class="{ 'icon-active-container': activeIcon === 'users' }" @click="setActiveIcon('users')">
        <i class="fas fa-users icon" :class="{ 'icon-active': activeIcon === 'users' }"></i>
      </div>
      
      <div class="icon-container" :class="{ 'icon-active-container': activeIcon === 'user-friends' }" @click="setActiveIcon('user-friends')">
        <i class="fas fa-user-friends icon" :class="{ 'icon-active': activeIcon === 'user-friends' }"></i>
      </div>
      
      <div class="icon-container" :class="{ 'icon-active-container': activeIcon === 'cog' }" @click="setActiveIcon('cog')">
        <i class="fas fa-cog icon" :class="{ 'icon-active': activeIcon === 'cog' }"></i>
      </div>
      
      <div class="icon-container" style="margin-top: 25px;" @click="toggleTheme">
        <!-- Biểu tượng mặt trăng hoặc mặt trời -->
        <i :class="isNightMode ? 'fas fa-moon' : 'fas fa-sun'" class="icon-gray"></i>
      </div>

      <div class="avatar-container">
        <!-- Avatar -->
        <img ref="avatar" alt="User profile picture" class="avatar"
          src="https://storage.googleapis.com/a1aa/image/7lBa4dTLolp7p8szWr9BosdarMGGKMwOqwk4lK7epn4.jpg"
          @click="toggleDropdown" />

        <!-- Dropdown -->
        <div ref="dropdown" class="dropdown" :class="{ show: isDropdownOpen }">
          <a href="#"><i class="fas fa-user"></i> Profile</a>
          <a href="#"><i class="fas fa-cog"></i> Settings</a>
          <a href="#"><i class="fas fa-sign-out-alt"></i> Log Out</a>
        </div>
      </div>
    </div>

    <div class="data-tab-engine">
      <h2>Data Tab Engine</h2>
    </div>

    <div class="data-tab-chat">
      <h2>Data Tab Chat</h2>
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: white;
  margin: 0;
  font-family: Arial, sans-serif;
}

.container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 80px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  position: relative;
  border-right: 1px solid #e2e8f0;
}

.logo {
  width: 64px;
  height: 64px;
}

.logo i {
  display: flex;
  color: grey;
  font-size: 24px;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 50%;
  margin-bottom: 2rem;
  transition: background-color 0.3s;
}

.icon-container {
  display: flex;
  color: grey;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  font-size: 22px;
  background-color: white;
  border-radius: 50%;
  margin-bottom: 1.1rem;
  transition: background-color 0.3s;
}

.icon-container:hover {
  background-color: #f3f4f6;
}

/* Hiệu ứng cho icon khi active */
.icon-active-container {
  background-color: #f3f4f6;
}

.icon-active {
  color: #7c3aed;
}

/* Avatar style */
.avatar-container {
  margin-top: auto;
  position: relative;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: opacity 0.3s;
}

.avatar:hover {
  opacity: 0.8;
}

.dropdown {
  position: absolute;
  left: 3.5rem;
  top: -6rem;
  width: 12rem;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: none;
}

.dropdown.show {
  display: block;
}

.dropdown a {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: #4a5568;
  text-decoration: none;
}

.dropdown a:hover {
  background-color: #f7fafc;
}

.dropdown a i {
  margin-right: 0.5rem;
}

/* Đảm bảo dropdown vẫn hoạt động như mong muốn */
.data-tab-engine {
  width: 500px;
  background-color: #f7fafc;
  border-left: 1px solid #e2e8f0;
  padding: 1rem;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

.data-tab-engine h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #4a5568;
}

.data-tab-chat {
  width: 950px;
  background-color: #f7fafc;
  border-left: 1px solid #e2e8f0;
  padding: 1rem;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

.data-tab-chat h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #4a5568;
}

.content {
  flex-grow: 1;
  padding: 2rem;
}
</style>

<script>
export default {
  data() {
    return {
      activeIcon: '', // Lưu trữ công cụ đang được chọn
      isDropdownOpen: false,
      isNightMode: false
    };
  },
  methods: {
    setActiveIcon(icon) {
      // Cập nhật trạng thái của công cụ đang được chọn
      this.activeIcon = icon;
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    closeDropdown(event) {
      if (
        this.isDropdownOpen &&
        !this.$refs.dropdown.contains(event.target) &&
        !this.$refs.avatar.contains(event.target)
      ) {
        this.isDropdownOpen = false;
      }
    },
    toggleTheme() {
      this.isNightMode = !this.isNightMode;
    }
  },
  mounted() {
    document.addEventListener("click", this.closeDropdown);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeDropdown);
  }
};
</script>
