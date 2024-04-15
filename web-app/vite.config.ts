/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  base: "/sudoku/",
  test: {
    environment: "happy-dom",
    setupFiles: "vitest.setup.ts",
  },
});
