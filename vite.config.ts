import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Prevent Vite from trying to pre-bundle the worker (it's already ESM)
    exclude: ["pdfjs-dist"],
  },
});