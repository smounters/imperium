import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    extensions: [".ts", ".js", ".mjs"],
  },
  test: {
    include: ["tests/**/*.test.ts"],
    globals: false,
    testTimeout: 10_000,
  },
});
