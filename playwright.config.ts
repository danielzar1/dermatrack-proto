import { defineConfig, devices } from "@playwright/test";

// e2e covers the Slice-1 loop (ARCHITECTURE.md §3 acceptance criteria).
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm dev",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
