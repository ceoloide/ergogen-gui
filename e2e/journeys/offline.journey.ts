import { cpSync } from 'node:fs';
import type { Page } from '@playwright/test';
import { waitForServiceWorkerControl } from '../utils/baseAssets';
import { download, pasteIntoEditor } from './app';
import { test, expect } from './journey';

// What the project verify-offline of scripts/verify/playwright.config.mts
// gives this journey: the build that its server serves, from the folder
// servedDir, and the next version of the app, in the folder nextBuildDir.
interface OfflineMetadata {
  buildId: string;
  nextBuildId: string;
  nextBuildDir: string;
  servedDir: string;
}

// A matrix of two columns and two rows with one outline, named so that its
// output file tells which configuration generated it.
const config = `points:
  zones:
    matrix:
      columns:
        left:
        right:
      rows:
        bottom:
        top:
outlines:
  travel:
    - what: rectangle
      where: true
      size: 14
`;

const downloadTravel = (page: Page) =>
  page.getByLabel('Download travel.dxf', { exact: true });
const headerName = (page: Page) =>
  page.getByRole('banner').getByText('Untitled 1', { exact: true });

async function downloadConfiguration(page: Page) {
  const file = await download(
    page,
    page.getByRole('button', { name: 'Download configuration' })
  );
  return file.content.toString('utf8');
}

// Reads build-id.txt from the page. The service worker does not cache the
// file, so only the server can answer.
const fetchBuildId = (page: Page) =>
  page.evaluate(() =>
    fetch('/build-id.txt', { cache: 'no-store' }).then(
      (response) => response.text(),
      () => 'network error'
    )
  );

test('works offline and updates to the next version that the user applies', async ({
  page,
  journey,
}) => {
  const { buildId, nextBuildId, nextBuildDir, servedDir } = test.info().project
    .metadata as OfflineMetadata;
  const errorBanner = page.getByRole('button', { name: 'Close error message' });
  const updateChip = page.getByRole('button', { name: /^Update available/ });
  const pageBuildId = page.locator('meta[name="ergogen-build-id"]');
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

  await journey.step('Open the app', async () => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Ergogen Web UI' })
    ).toBeVisible();
    // The app works offline once its service worker controls the page.
    journey.observe('serviceWorker', await waitForServiceWorkerControl(page));
  });

  await journey.step('Choose Empty Configuration', async () => {
    await page
      .getByRole('button', { name: 'Start with empty configuration' })
      .click();
    await expect(headerName(page)).toBeAttached();
  });

  await journey.step('Paste the outline travel', async () => {
    await pasteIntoEditor(page, config);
    await expect(downloadTravel(page)).toBeVisible({ timeout: 30_000 });
    await expect(errorBanner).toBeHidden();
  });

  await journey.step('Go offline and reload the page', async () => {
    await page.context().setOffline(true);
    const response = await page.reload();
    expect(
      response?.fromServiceWorker(),
      'the page from the service worker'
    ).toBe(true);
    const offlineAnswer = await fetchBuildId(page);
    expect(offlineAnswer, 'build-id.txt while offline').toBe('network error');
    journey.observe('offlineBuildIdFetch', offlineAnswer);
    await expect(headerName(page)).toBeAttached({ timeout: 30_000 });
    // Only a generation in the page, without the network, gives the output.
    await expect(downloadTravel(page)).toBeVisible({ timeout: 30_000 });
    await expect(errorBanner).toBeHidden();
    expect(
      await downloadConfiguration(page),
      'the saved configuration while offline'
    ).toBe(config);
  });

  await journey.step('Go online and deploy the next version', async () => {
    await page.context().setOffline(false);
    cpSync(nextBuildDir, servedDir, { recursive: true });
    const servedBuildId = await fetchBuildId(page);
    expect(servedBuildId, 'the build that the server serves').toBe(nextBuildId);
    // Two builds of one commit differ in their bytes, so only the build ID
    // proves that the next build is another version.
    expect(servedBuildId, 'the build that the page runs').not.toBe(buildId);
    journey.observe('servedBuildId', servedBuildId);
  });

  await journey.step('Reload the page', async () => {
    await page.reload();
    await expect(updateChip).toBeVisible({ timeout: 30_000 });
    await expect(
      pageBuildId,
      'the build that runs while the update waits'
    ).toHaveAttribute('content', buildId);
    journey.observe(
      'buildIdBeforeUpdate',
      await pageBuildId.getAttribute('content')
    );
  });

  await journey.step('Choose Update Available', async () => {
    await updateChip.click();
    await expect(pageBuildId, 'the build after the update').toHaveAttribute(
      'content',
      nextBuildId,
      { timeout: 30_000 }
    );
    await expect(updateChip).toBeHidden();
    await expect(headerName(page)).toBeAttached({ timeout: 30_000 });
    await expect(downloadTravel(page)).toBeVisible({ timeout: 30_000 });
    expect(
      await downloadConfiguration(page),
      'the saved configuration after the update'
    ).toBe(config);
    journey.observe(
      'buildIdAfterUpdate',
      await pageBuildId.getAttribute('content')
    );
  });
});
