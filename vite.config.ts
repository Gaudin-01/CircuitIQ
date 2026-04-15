import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import legacy from "@vitejs/plugin-legacy";
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  base: "./",
  // 1. Plugins go in their own array
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    legacy({
      targets: ['defaults', 'not IE 11']
  }),],
  // 2. Resolve is a separate top-level property
  resolve: {
    tsconfigPaths: true,
  },
});
