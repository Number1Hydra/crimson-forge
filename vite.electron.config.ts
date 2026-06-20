import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Standalone Vite build for the Electron renderer (loaded via file://).
// Reuses the same React components as the web app but without TanStack SSR.
export default defineConfig({
  base: "./",
  root: path.resolve(__dirname, "electron/renderer"),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  build: {
    outDir: path.resolve(__dirname, "electron/renderer-dist"),
    emptyOutDir: true,
  },
});
