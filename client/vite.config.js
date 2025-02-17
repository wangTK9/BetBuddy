import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import react from "@vitejs/plugin-react"; // Needed for the React-based modal
import { nodePolyfills } from "vite-plugin-node-polyfills";
import path from "path"; // Thêm path để cấu hình alias "@"

export default defineConfig({
  plugins: [
    vue(),
    react(),
    nodePolyfills({
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Định nghĩa alias "@"
    },
  },
});
