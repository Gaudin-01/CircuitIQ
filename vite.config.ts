// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths"; // 1. Import this

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    VitePWA({ registerType: "autoUpdate" }),
  ], // 2. Add it here
});

// import path from "node:path";
// import tailwindcss from "@tailwindcss/vite";
// import hercules from "@usehercules/vite";
// import react from "@vitejs/plugin-react-swc";
// import { defineConfig } from "vite";

// // https://vite.dev/config/
// export default defineConfig({
//   server: {
//     host: "0.0.0.0",
//     port: 5173,
//     allowedHosts: true,
//     hmr: {
//       overlay: false,
//     },
//   },
//   plugins: [react(), tailwindcss(), hercules()],
//   resolve: {
//     alias: {
//       "@/convex": path.resolve(__dirname, "./convex"),
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   build: {
//     chunkSizeWarningLimit: 1000,
//   },
// });
