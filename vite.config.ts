import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src/js"),
      "@/assets": resolve(__dirname, "./src/assets"),
    },
  },
  root: "./", // Explicitly set root directory
  build: {
    rollupOptions: {
      input: resolve(__dirname, "index.html"),
    },
    outDir: "dist",
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5174",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
