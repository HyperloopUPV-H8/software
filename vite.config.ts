// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import typescript from "@rollup/plugin-typescript";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import postcss from "rollup-plugin-postcss";

export default defineConfig({
    plugins: [react(), tsconfigPaths(), postcss()],
    server: {
        port: 3000,
    },
    build: {
        manifest: true,
        minify: false,
        reportCompressedSize: true,
        lib: {
            entry: path.resolve(__dirname, "lib/index.ts"),
            fileName: "index",
            formats: ["es"],
        },
        rollupOptions: {
            external: ["react", "react-dom", "@reduxjs/toolkit"],
            plugins: [typescript()],
        },
    },
});
