/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/sudoku/",
  test: {
    environment: "happy-dom",
    setupFiles: "vitest.setup.ts",
  },
});
