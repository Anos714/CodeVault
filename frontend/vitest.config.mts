import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

/**
 * Unit tests for pure server helpers (token format, CORS decisions). The
 * Playwright suite under `e2e/` covers the HTTP surface end to end.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
