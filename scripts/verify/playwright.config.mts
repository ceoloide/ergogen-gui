// The Playwright configuration of `pnpm verify`. Run the script
// scripts/verify/verify.mts, which sets the VERIFY_ variables, chooses the
// journeys, and keeps the proof of a journey that could not run.
//
// The configuration builds the app with its own build ID into its own folder
// and serves it with `vite preview` on a free loopback port. When the offline
// journey runs, it also builds the next version of the app with another build
// ID, and serves a copy of the first build on a second port, because that
// journey deploys the next version over the files of its server.
// e2e/global-setup.ts stops the run unless each server answers with the build
// ID of the first build. Chromium then runs the journeys of e2e/journeys/ one
// at a time, without retries.
import { randomUUID } from 'node:crypto';
import { createServer, type Server } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';
import { reachNoHostName } from '../../e2e/utils/hostNames';
import { gitState, JOURNEY_SUFFIX, PROOF_PATH } from './proof.mts';

const root = fileURLToPath(new URL('../..', import.meta.url));

// Chooses free loopback ports. Each socket stays open until every port is
// chosen, so no port repeats.
async function freeLoopbackPorts(count: number) {
  const servers = await Promise.all(
    Array.from(
      { length: count },
      () =>
        new Promise<Server>((resolve, reject) => {
          const server = createServer();
          server.on('error', reject);
          server.listen(0, '127.0.0.1', () => resolve(server));
        })
    )
  );
  const ports = servers.map((server) => {
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('Could not choose a port for pnpm verify');
    }
    return String(address.port);
  });
  await Promise.all(
    servers.map((server) => new Promise((resolve) => server.close(resolve)))
  );
  return ports;
}

// Playwright loads this file again in its worker process. The worker inherits
// these variables, so both processes see the same run.
const env = process.env;
if (env.VERIFY_PORT === undefined || env.VERIFY_OFFLINE_PORT === undefined) {
  [env.VERIFY_PORT, env.VERIFY_OFFLINE_PORT] = await freeLoopbackPorts(2);
}
const buildId = (env.VERIFY_BUILD_ID ??= randomUUID());
const nextBuildId = (env.VERIFY_NEXT_BUILD_ID ??= randomUUID());
// verify.mts removes this folder, with each build in it, after the run.
const buildDir = (env.VERIFY_BUILD_DIR ??= join(
  tmpdir(),
  `ergogen-gui-verify-${buildId}`
));
const appDir = join(buildDir, 'app');
const nextBuildDir = join(buildDir, 'next');
const servedDir = join(buildDir, 'served');
if (env.VERIFY_COMMIT === undefined) {
  const { commit, dirty } = gitState(root);
  env.VERIFY_COMMIT = commit;
  env.VERIFY_DIRTY = String(dirty);
}
const proofDir = join(root, PROOF_PATH);
const baseURL = `http://127.0.0.1:${env.VERIFY_PORT}`;
const offlineURL = `http://127.0.0.1:${env.VERIFY_OFFLINE_PORT}`;
const features = env.VERIFY_FEATURES?.split(',').filter(Boolean);
const offlineJourney = `**/offline${JOURNEY_SUFFIX}`;
const runsOffline = !features?.length || features.includes('offline');

// The tag ID starts with G-TEST, so the app sends usage metrics from this
// loopback host, as it does from a public host with a real tag ID. The fixture
// of e2e/fixtures.ts blocks those requests, and the analytics journey answers
// them itself.
const buildEnv = {
  VITE_GTAG_ID: 'G-TESTJOURNEY',
  VITE_PUBLIC_URL: '',
  PUBLIC_URL: '',
};
const serve = (dir: string, port: string | undefined) =>
  `pnpm exec vite preview --outDir ${JSON.stringify(dir)}` +
  ` --host 127.0.0.1 --port ${port} --strictPort`;
const runMetadata = {
  proofDir,
  commit: env.VERIFY_COMMIT,
  dirty: env.VERIFY_DIRTY === 'true',
};

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
      testIgnore: offlineJourney,
      metadata: { ...runMetadata, buildId, baseURL },
      use: { ...devices['Desktop Chrome'], baseURL },
    },
    ...(runsOffline
      ? [
          {
            name: 'verify-offline',
            testMatch: offlineJourney,
            metadata: {
              ...runMetadata,
              buildId,
              baseURL: offlineURL,
              nextBuildId,
              nextBuildDir,
              servedDir,
            },
            // The requests of its service worker to other hosts fail here, not
            // in the fixture (see e2e/fixtures.ts).
            use: {
              ...devices['Desktop Chrome'],
              baseURL: offlineURL,
              launchOptions: { args: reachNoHostName },
            },
          },
        ]
      : []),
  ],
  // Playwright starts these servers one after another, so the second one can
  // copy the build of the first, which also prepared the engine.
  webServer: [
    {
      command:
        `pnpm build --outDir ${JSON.stringify(appDir)} --emptyOutDir` +
        ` && ${serve(appDir, env.VERIFY_PORT)}`,
      cwd: root,
      env: { ...buildEnv, VITE_BUILD_ID: buildId },
      url: `${baseURL}/build-id.txt`,
      reuseExistingServer: false,
      timeout: 240_000,
    },
    ...(runsOffline
      ? [
          {
            command:
              `pnpm exec vite build --outDir ${JSON.stringify(nextBuildDir)} --emptyOutDir` +
              ` && cp -R ${JSON.stringify(appDir)} ${JSON.stringify(servedDir)}` +
              ` && ${serve(servedDir, env.VERIFY_OFFLINE_PORT)}`,
            cwd: root,
            env: { ...buildEnv, VITE_BUILD_ID: nextBuildId },
            url: `${offlineURL}/build-id.txt`,
            reuseExistingServer: false,
            timeout: 240_000,
          },
        ]
      : []),
  ],
});
