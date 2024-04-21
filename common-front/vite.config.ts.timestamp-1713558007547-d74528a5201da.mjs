// vite.config.ts
import { defineConfig } from "file:///Users/andres/Desktop/Hyper/CODE/h9-software/common-front/node_modules/vite/dist/node/index.js";
import react from "file:///Users/andres/Desktop/Hyper/CODE/h9-software/common-front/node_modules/@vitejs/plugin-react/dist/index.mjs";
import typescript from "file:///Users/andres/Desktop/Hyper/CODE/h9-software/common-front/node_modules/@rollup/plugin-typescript/dist/es/index.js";
import tsconfigPaths from "file:///Users/andres/Desktop/Hyper/CODE/h9-software/common-front/node_modules/vite-tsconfig-paths/dist/index.mjs";
import path from "path";
import postcss from "file:///Users/andres/Desktop/Hyper/CODE/h9-software/common-front/node_modules/rollup-plugin-postcss/dist/index.js";
import svgr from "file:///Users/andres/Desktop/Hyper/CODE/h9-software/common-front/node_modules/vite-plugin-svgr/dist/index.js";
var __vite_injected_original_dirname = "/Users/andres/Desktop/Hyper/CODE/h9-software/common-front";
var vite_config_default = defineConfig({
  plugins: [react(), tsconfigPaths(), postcss(), svgr()],
  server: {
    port: 3e3
  },
  build: {
    manifest: true,
    minify: false,
    reportCompressedSize: true,
    lib: {
      entry: path.resolve(__vite_injected_original_dirname, "lib/index.ts"),
      fileName: "index",
      formats: ["es"]
    },
    rollupOptions: {
      external: ["react", "react-dom", "react-redux", "@reduxjs/toolkit"],
      plugins: [typescript()]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYW5kcmVzL0Rlc2t0b3AvSHlwZXIvQ09ERS9oOS1zb2Z0d2FyZS9jb21tb24tZnJvbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9hbmRyZXMvRGVza3RvcC9IeXBlci9DT0RFL2g5LXNvZnR3YXJlL2NvbW1vbi1mcm9udC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvYW5kcmVzL0Rlc2t0b3AvSHlwZXIvQ09ERS9oOS1zb2Z0d2FyZS9jb21tb24tZnJvbnQvdml0ZS5jb25maWcudHNcIjsvLyB2aXRlLmNvbmZpZy50c1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCB0eXBlc2NyaXB0IGZyb20gXCJAcm9sbHVwL3BsdWdpbi10eXBlc2NyaXB0XCI7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBwb3N0Y3NzIGZyb20gXCJyb2xsdXAtcGx1Z2luLXBvc3Rjc3NcIjtcbmltcG9ydCBzdmdyIGZyb20gXCJ2aXRlLXBsdWdpbi1zdmdyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gICAgcGx1Z2luczogW3JlYWN0KCksIHRzY29uZmlnUGF0aHMoKSwgcG9zdGNzcygpLCBzdmdyKCldLFxuICAgIHNlcnZlcjoge1xuICAgICAgICBwb3J0OiAzMDAwLFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgICAgbWFuaWZlc3Q6IHRydWUsXG4gICAgICAgIG1pbmlmeTogZmFsc2UsXG4gICAgICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiB0cnVlLFxuICAgICAgICBsaWI6IHtcbiAgICAgICAgICAgIGVudHJ5OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImxpYi9pbmRleC50c1wiKSxcbiAgICAgICAgICAgIGZpbGVOYW1lOiBcImluZGV4XCIsXG4gICAgICAgICAgICBmb3JtYXRzOiBbXCJlc1wiXSxcbiAgICAgICAgfSxcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgZXh0ZXJuYWw6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCIsIFwicmVhY3QtcmVkdXhcIiwgXCJAcmVkdXhqcy90b29sa2l0XCJdLFxuICAgICAgICAgICAgcGx1Z2luczogW3R5cGVzY3JpcHQoKV0sXG4gICAgICAgIH0sXG4gICAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLFVBQVU7QUFDakIsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sVUFBVTtBQVBqQixJQUFNLG1DQUFtQztBQVN6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTLENBQUMsTUFBTSxHQUFHLGNBQWMsR0FBRyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQUEsRUFDckQsUUFBUTtBQUFBLElBQ0osTUFBTTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNILFVBQVU7QUFBQSxJQUNWLFFBQVE7QUFBQSxJQUNSLHNCQUFzQjtBQUFBLElBQ3RCLEtBQUs7QUFBQSxNQUNELE9BQU8sS0FBSyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUM3QyxVQUFVO0FBQUEsTUFDVixTQUFTLENBQUMsSUFBSTtBQUFBLElBQ2xCO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDWCxVQUFVLENBQUMsU0FBUyxhQUFhLGVBQWUsa0JBQWtCO0FBQUEsTUFDbEUsU0FBUyxDQUFDLFdBQVcsQ0FBQztBQUFBLElBQzFCO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
