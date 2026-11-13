import { defineConfig, devices } from '@playwright/test';
import { createServer } from 'node:net';
import { randomUUID } from 'node:crypto';

// Reserve an available loopback port. strictPort makes a subsequent collision
// fail explicitly; Playwright must never silently reuse a different checkout.
const port = process.env.PLAYWRIGHT_TEST_PORT
  ? Number(process.env.PLAYWRIGHT_TEST_PORT)
  : await new Promise<number>((resolve, reject) => {
      const server = createServer();
      server.on('error', reject);
      server.listen(0, '127.0.0.1', () => {
        const address = server.address();
        if (!address || typeof address === 'string') {
          server.close();
          reject(new Error('Could not allocate a browser-test port'));
          return;
        }
        server.close((error) =>
          error ? reject(error) : resolve(address.port)
        );
      });
    });
// Playwright reloads configuration in worker processes; share only this run's
// selected port and identity through their inherited environment.
process.env.PLAYWRIGHT_TEST_PORT = String(port);
const buildId = process.env.PLAYWRIGHT_BUILD_ID ?? randomUUID();
process.env.PLAYWRIGHT_BUILD_ID = buildId;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  timeout: 60000,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'reports/browser.xml' }],
  ],
  metadata: { buildId, baseURL },
  globalSetup: './e2e/global-setup.ts',
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    env: { VITE_BUILD_ID: buildId, VITE_PUBLIC_URL: '', PUBLIC_URL: '' },
    command: `pnpm build && pnpm exec vite preview --host 127.0.0.1 --port ${port} --strictPort`,
    url: `${baseURL}/build-id.txt`,
    reuseExistingServer: false,
    timeout: 180 * 1000,
  },
});
