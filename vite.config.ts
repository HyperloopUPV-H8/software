import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@models": path.resolve(__dirname, "./src/models"),
      "@adapters": path.resolve(__dirname, "./src/adapters"),
      "@context": path.resolve(__dirname, "./src/context"),
    },
  },
});
