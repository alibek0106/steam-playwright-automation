import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 2,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    headless: false,
  },

  projects: [
    {
      name: 'chromium-en',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'en-US',
      },
    },
    {
      name: 'chromium-ru',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'ru-RU',
      },
    },
    {
      name: 'firefox-en',
      use: {
        ...devices['Desktop Firefox'],
        locale: 'en-US',
      },
    },
    {
      name: 'firefox-ru',
      use: {
        ...devices['Desktop Firefox'],
        locale: 'ru-RU',
      },
    },
  ],
});
