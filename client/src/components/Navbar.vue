<!-- src/components/Navbar.vue -->
<template>
  <nav class="navbar">
    <div class="container">
      <h1>Logo</h1>
      <ul>
        <li><router-link to="/">Trang chủ</router-link></li>
        <li><router-link to="/about">Giới thiệu</router-link></li>
        <li><router-link to="/contact">Liên hệ</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script setup></script>

<style lang="css" scoped></style>
