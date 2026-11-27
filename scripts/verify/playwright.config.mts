// The Playwright configuration of `pnpm verify`. Run the script
// scripts/verify/verify.mts, which sets the VERIFY_ variables, chooses the
// journeys, and keeps the proof of a journey that could not run.
//
// The configuration builds the app with its own build ID into its own folder
// and serves it with `vite preview` on a free loopback port. e2e/global-setup.ts
// stops the run unless the server answers with that build ID. Chromium then
// runs the journeys of e2e/journeys/ one at a time, without retries.
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';
import { gitState, JOURNEY_SUFFIX, PROOF_PATH } from './proof.mts';

const root = fileURLToPath(new URL('../..', import.meta.url));

const freeLoopbackPort = () =>
  new Promise<string>((resolve, reject) => {
    const server = createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      server.close(() =>
        address && typeof address === 'object'
          ? resolve(String(address.port))
          : reject(new Error('Could not choose a port for pnpm verify'))
      );
    });
  });

// Playwright loads this file again in its worker process. The worker inherits
// these variables, so both processes see the same run.
const env = process.env;
env.VERIFY_PORT ??= await freeLoopbackPort();
const buildId = (env.VERIFY_BUILD_ID ??= randomUUID());
const buildDir = (env.VERIFY_BUILD_DIR ??= join(
  tmpdir(),
  `ergogen-gui-verify-${buildId}`
));
if (env.VERIFY_COMMIT === undefined) {
  const { commit, dirty } = gitState(root);
  env.VERIFY_COMMIT = commit;
  env.VERIFY_DIRTY = String(dirty);
}
const proofDir = join(root, PROOF_PATH);
const baseURL = `http://127.0.0.1:${env.VERIFY_PORT}`;
const features = env.VERIFY_FEATURES?.split(',').filter(Boolean);

export default defineConfig({
  testDir: join(root, 'e2e', 'journeys'),
  testMatch: features?.length
    ? features.map((feature) => `**/${feature}${JOURNEY_SUFFIX}`)
    : `**/*${JOURNEY_SUFFIX}`,
  outputDir: join(proofDir, 'traces'),
  forbidOnly: true,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 120_000,
  reporter: [['list']],
  globalSetup: join(root, 'e2e', 'global-setup.ts'),
  use: { trace: 'retain-on-failure', screenshot: 'off' },
  projects: [
    {
      name: 'verify',
      metadata: {
        buildId,
        baseURL,
        proofDir,
        commit: env.VERIFY_COMMIT,
        dirty: env.VERIFY_DIRTY === 'true',
      },
      use: { ...devices['Desktop Chrome'], baseURL },
    },
  ],
  webServer: {
    command:
      `pnpm build --outDir ${JSON.stringify(buildDir)} --emptyOutDir` +
      ` && pnpm exec vite preview --outDir ${JSON.stringify(buildDir)}` +
      ` --host 127.0.0.1 --port ${env.VERIFY_PORT} --strictPort`,
    cwd: root,
    env: { VITE_BUILD_ID: buildId, VITE_PUBLIC_URL: '', PUBLIC_URL: '' },
    url: `${baseURL}/build-id.txt`,
    reuseExistingServer: false,
    timeout: 240_000,
  },
});
