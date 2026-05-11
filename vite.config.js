import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
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
