import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  base: "./",
  // 1. Plugins go in their own array
  plugins: [react(), tailwindcss(), legacy({
      targets: ['defaults', 'not IE 11']
    }), VitePWA({ registerType: "autoUpdate" })],
  // 2. Resolve is a separate top-level property
  resolve: {
    tsconfigPaths: true,
  },
});
