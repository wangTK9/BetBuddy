import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import Home from "./views/Home.vue";
import Account from "./views/Account.vue";
import Login from "./views/Login.vue";
import Chat from "./views/Chat.vue";

// Import Vue Socket.IO
import { io } from "socket.io-client";
import { createSocket } from "./plugins/socket"; // Tạo plugin cho Socket.IO

// Import FontAwesome icon
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faWallet,
  faUser,
  faMoon,
  faSun,
  faSearch,
  faCopy,
  faPen,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

library.add(faWallet, faUser, faMoon, faSun, faSearch, faCopy, faPen, faGear);

// Kết nối WebSocket với backend
const socket = io("http://localhost:5000"); // Cập nhật URL nếu cần

// Tạo router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/home", component: Home },
    { path: "/account", component: Account },
    { path: "/", component: Login },
    { path: "/login", component: Login },
    { path: "/chat", component: Chat },
  ],
});

// Tạo Pinia và sử dụng plugin
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(createSocket(socket)); // Sử dụng plugin Socket.IO
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
