import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import react from "@vitejs/plugin-react"; // Needed for the React-based modal
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    vue(),
    react(),
    nodePolyfills({
      protocolImports: true,
    }),
  ],
});
