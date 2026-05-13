// Trigger reload for admin-i18n.js fix v2
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // Triggering dev server restart
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@admin": path.resolve(__dirname, "./admin"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@pi-ui": path.resolve(__dirname, "./shared"),
    },
  },
  build: {
    outDir: "build",
  },
  server: {
    host: "localhost",
    port: 5174,
  },
});
