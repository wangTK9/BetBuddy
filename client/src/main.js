import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "@fortawesome/fontawesome-free/css/all.min.css";
import App from "./App.vue";
import Home from "./views/Home.vue";

// import About from "./views/About.vue";
// import Market from "./views/Market.vue";
// import Projects from "./views/Projects.vue";
// import Support from "./views/Support.vue";
import Account from "./views/Account.vue";
import Login from "./views/Login.vue";
import Chat from "./views/ChatView.vue";
import Poll from "./views/Poll.vue";
import Bet from "./views/Bet.vue";

// Import Vue Socket.IO
import { io } from "socket.io-client";
import { createSocket } from "./plugins/socket"; // Tạo plugin cho Socket.IO

// Import FontAwesome icon
import "@fortawesome/fontawesome-free/css/all.min.css";
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
    { path: "/poll", component: Poll },
    { path: "/bet", component: Bet },
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
