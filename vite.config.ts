// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import typescript from "@rollup/plugin-typescript";
// import { typescriptPaths } from "rollup-plugin-typescript-paths";
import path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        // alias: [
        //     {
        //         find: "~",
        //         replacement: path.resolve(__dirname, "./src"),
        //     },
        // ],
    },
    server: {
        port: 3000,
    },
    build: {
        manifest: true,
        minify: false,
        reportCompressedSize: true,
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            fileName: "index",
            formats: ["es"],
        },
        rollupOptions: {
            external: ["react", "react-dom", "@reduxjs/toolkit"],
            plugins: [
                // typescriptPaths({
                //     preserveExtensions: true,
                // }),
                typescript({
                    sourceMap: true,
                    declaration: true,
                    outDir: "dist",
                }),
            ],
        },
    },
});
