import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './specs',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm --filter @restaurant-os/merchant-web dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
});
