import { defineConfig, devices } from '@playwright/test';
import { createServer, type Server } from 'node:net';
import { randomUUID } from 'node:crypto';

// Reserve distinct available loopback ports. strictPort makes a subsequent
// collision fail explicitly; Playwright must never silently reuse a different
// checkout. All sockets stay open until every port is chosen so none repeats.
const portVariables = [
  'PLAYWRIGHT_TEST_PORT',
  'PLAYWRIGHT_SUBPATH_PORT',
  'PLAYWRIGHT_UPDATE_PORT',
].filter((name) => !process.env[name]);
const listen = () =>
  new Promise<Server>((resolve, reject) => {
    const server = createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
const reserved = await Promise.all(portVariables.map(listen));
reserved.forEach((server, index) => {
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Could not allocate a browser-test port');
  }
  process.env[portVariables[index]] = String(address.port);
});
await Promise.all(
  reserved.map(
    (server) =>
      new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve()))
      )
  )
);
// Playwright reloads configuration in worker processes; share only this run's
// selected ports and identities through their inherited environment.
const identity = (name: string) => (process.env[name] ??= randomUUID());
const urlOf = (variable: string, path: string) =>
  `http://127.0.0.1:${process.env[variable]}${path}`;

// The default build, served at the domain root.
const buildId = identity('PLAYWRIGHT_BUILD_ID');
const baseURL = urlOf('PLAYWRIGHT_TEST_PORT', '');

// A build below a subpath, as on a GitHub project page, and the next build of
// the same base for the update drill. The drill gets its own server and copy
// of the build, because it deploys the next build over the files it serves.
const subpath = '/ergogen-gui/';
const subpathEnv = { VITE_PUBLIC_URL: subpath, PUBLIC_URL: '' };
const subpathBuildId = identity('PLAYWRIGHT_SUBPATH_BUILD_ID');
const nextBuildId = identity('PLAYWRIGHT_SUBPATH_NEXT_BUILD_ID');
const subpathURL = urlOf('PLAYWRIGHT_SUBPATH_PORT', subpath);
const updateURL = urlOf('PLAYWRIGHT_UPDATE_PORT', subpath);
const preview = (outDir: string, variable: string) =>
  `pnpm exec vite preview --outDir ${outDir} --host 127.0.0.1 --port ${process.env[variable]} --strictPort`;

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
  globalSetup: './e2e/global-setup.ts',
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: '**/service-worker-update.spec.ts',
      metadata: { buildId, baseURL },
      use: { ...devices['Desktop Chrome'], baseURL },
    },
    {
      name: 'chromium-subpath',
      testMatch: ['**/base-path.spec.ts', '**/service-worker.spec.ts'],
      metadata: { buildId: subpathBuildId, baseURL: subpathURL },
      use: { ...devices['Desktop Chrome'], baseURL: subpathURL },
    },
    {
      name: 'chromium-subpath-update',
      testMatch: '**/service-worker-update.spec.ts',
      metadata: {
        buildId: subpathBuildId,
        baseURL: updateURL,
        nextBuildId,
        nextBuildDir: 'dist-subpath-next',
        servedDir: 'dist-subpath-served',
      },
      use: { ...devices['Desktop Chrome'], baseURL: updateURL },
    },
  ],
  // Playwright starts these in order: the root build also prepares the engine.
  webServer: [
    {
      env: { VITE_BUILD_ID: buildId, VITE_PUBLIC_URL: '', PUBLIC_URL: '' },
      command: `pnpm build && ${preview('dist', 'PLAYWRIGHT_TEST_PORT')}`,
      url: `${baseURL}/build-id.txt`,
      reuseExistingServer: false,
      timeout: 180 * 1000,
    },
    {
      env: { ...subpathEnv, VITE_BUILD_ID: subpathBuildId },
      command:
        `pnpm exec vite build --outDir dist-subpath` +
        ` && VITE_BUILD_ID=${nextBuildId} pnpm exec vite build --outDir dist-subpath-next` +
        ` && ${preview('dist-subpath', 'PLAYWRIGHT_SUBPATH_PORT')}`,
      url: `${subpathURL}build-id.txt`,
      reuseExistingServer: false,
      timeout: 240 * 1000,
    },
    {
      env: subpathEnv,
      command:
        'rm -rf dist-subpath-served && cp -R dist-subpath dist-subpath-served' +
        ` && ${preview('dist-subpath-served', 'PLAYWRIGHT_UPDATE_PORT')}`,
      url: `${updateURL}build-id.txt`,
      reuseExistingServer: false,
      timeout: 60 * 1000,
    },
  ],
});
