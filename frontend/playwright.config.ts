import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end suite against a running dev server with a real Neon database.
 *
 * - `bun run dev` boots the server (reused when already up).
 * - Tests sign in as the seeded demo account and clean up every snippet they
 *   create, so re-runs start from the same vault.
 * - OAuth providers can't complete headlessly (Google/GitHub consent pages),
 *   so those specs assert the redirect *to* the provider instead.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
