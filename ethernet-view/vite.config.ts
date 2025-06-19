/// <reference types="vitest" />
import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        sourcemap: true,
        outDir: "static",
        minify: false,
    },
    plugins: [react(), tsconfigPaths(), svgr()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/tests/setup.ts",
    },
    resolve: {
        alias: {
          common: path.resolve(__dirname, '../common-front'),
        },
    },
    server: {
        proxy: {
            // Proxy API calls to backend (ethernet-view backend runs on 5174)
            '/backend': {
                target: 'http://localhost:5174',
                changeOrigin: true,
            },
        },
    },
});
