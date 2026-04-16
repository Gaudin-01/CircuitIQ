import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Add this section to solve the Terser error
  build: {
    minify: "esbuild", // Force Vite to use the built-in minifier instead of Terser
    chunkSizeWarningLimit: 1600, // Increases limit for your large 2685 module build
  },
  resolve: {
    tsconfigPaths: true,
  },
});