import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:8000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "php artisan serve --host=127.0.0.1 --port=8000",
    cwd: "../Laravel",
    url: "http://127.0.0.1:8000/up",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
