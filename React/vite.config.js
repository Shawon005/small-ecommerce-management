import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";

export default defineConfig({
  plugins: [
    laravel({
      input: ["src/main.jsx"],
      publicDirectory: "../Laravel/public",
      hotFile: "../Laravel/public/hot",
      buildDirectory: "build",
      refresh: ["../Laravel/resources/views/**"],
    }),
    react(),
  ],
  server: {
    cors: { origin: ["http://127.0.0.1:8000", "http://localhost:8000"] },
  },
  build: { emptyOutDir: true },
});
