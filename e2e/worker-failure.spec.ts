import { test, expect } from './fixtures';
import EmptyYAML from '../src/examples/empty_yaml';
import { CONFIG_LOCAL_STORAGE_KEY } from '../src/context/constants';

// The service worker would serve its precached copy of the Ergogen worker
// script, which page.route does not see.
test.use({ serviceWorkers: 'block' });

// An Ergogen worker script that failed to load left the app generating
// forever, and Generate did nothing until a reload (#414).
test('keeps a worker load error and recovers on Generate without a reload', async ({
  page,
}) => {
  // Arrange: the worker script fails to load until the test restores it
  let workerScriptBroken = true;
  let workerScriptRequests = 0;
  await page.route(/\/ergogen\.worker-[^/]+\.js$/, (route) => {
    workerScriptRequests += 1;
    return workerScriptBroken
      ? route.fulfill({ status: 404 })
      : route.continue();
  });
  await page.addInitScript(
    ({ config, key }) => {
      localStorage.setItem(key, JSON.stringify(config));
    },
    { config: EmptyYAML.value, key: CONFIG_LOCAL_STORAGE_KEY }
  );
  await page.clock.install();
  const errorBanner = page.getByText('Ergogen worker error');
  const loadingBar = page.getByRole('progressbar', { name: 'Loading' });

  // Act: load, then fire the 300 ms debounced auto-generation that follows it
  await page.goto('/');
  await expect(errorBanner).toBeVisible();
  await page.clock.fastForward(1000);

  // Assert: the error stays and nothing is generating
  await expect(errorBanner).toBeVisible();
  await expect(loadingBar).toBeHidden();
  expect(workerScriptRequests).toBe(1);

  // Act: restore the worker script and click Generate
  workerScriptBroken = false;
  await page.getByRole('button', { name: 'Generate configuration' }).click();

  // Assert: one new worker generates the outputs
  await expect(page.getByText('demo.dxf', { exact: true })).toBeVisible({
    timeout: 20000,
  });
  await expect(errorBanner).toBeHidden();
  await expect(loadingBar).toBeHidden();
  expect(workerScriptRequests).toBe(2);
});
