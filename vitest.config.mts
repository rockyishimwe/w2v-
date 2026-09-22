import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    // Pure-logic unit tests only (per project decision) — node env, no DOM.
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
});
