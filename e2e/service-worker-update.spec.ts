import fs from 'node:fs';
import net from 'node:net';
import { test, expect } from './fixtures';
import { makeShooter } from './utils/screenshots';
import { waitForServiceWorkerControl } from './utils/baseAssets';

// Runs only in the chromium-subpath-update project, whose server reads the
// files of its own build copy on every request (see playwright.config.mts).
test.describe('Service worker update', () => {
  test('a new deployment waits behind the update chip and activates when applied', async ({
    page,
    context,
  }) => {
    // Arrange: the current build controls the page
    const shoot = makeShooter(page, test.info());
    const { buildId, nextBuildId, nextBuildDir, servedDir } =
      test.info().project.metadata;
    const buildMeta = page.locator('meta[name="ergogen-build-id"]');
    const updateChip = page.getByRole('button', { name: /^Update available/ });
    // Chromium's ids of the worker versions that install during the drill
    const installedVersions = new Set<string>();
    const devTools = await context.newCDPSession(page);
    devTools.on('ServiceWorker.workerVersionUpdated', ({ versions }) => {
      for (const version of versions) {
        if (['installed', 'activating', 'activated'].includes(version.status)) {
          installedVersions.add(version.versionId);
        }
      }
    });
    await devTools.send('ServiceWorker.enable');
    await page.goto('new');
    await waitForServiceWorkerControl(page);
    await page.reload();
    await expect(buildMeta).toHaveAttribute('content', buildId);
    await expect(updateChip).toBeHidden();

    // Act: deploy the next build over the served files, then load the page
    fs.cpSync(nextBuildDir, servedDir, { recursive: true });
    await page.reload();

    // Assert: it installs and waits while the current build keeps running
    await expect(updateChip).toBeVisible();
    await expect(buildMeta).toHaveAttribute('content', buildId);
    expect(
      await page.evaluate(
        async () =>
          (await navigator.serviceWorker.getRegistration())?.waiting?.state
      )
    ).toBe('installed');
    await shoot('update-available');

    // Act
    await updateChip.click();

    // Assert: the reload runs the next build under its own worker
    await expect(buildMeta).toHaveAttribute('content', nextBuildId);
    await expect(page.getByText('Ergogen Web UI')).toBeVisible();
    await expect(updateChip).toBeHidden();
    expect(
      await page.evaluate(async () => {
        const registration = await navigator.serviceWorker.getRegistration();
        return {
          waiting: registration?.waiting ?? null,
          controlled: navigator.serviceWorker.controller !== null,
        };
      })
    ).toEqual({ waiting: null, controlled: true });
    await shoot('updated');

    // Act: the activated build also starts without a network
    await context.setOffline(true);
    const documentResponse = await page.reload();

    // Assert
    expect(documentResponse?.fromServiceWorker()).toBe(true);
    await expect(buildMeta).toHaveAttribute('content', nextBuildId);
    await expect(page.getByText('Ergogen Web UI')).toBeVisible();
    // Only the two builds installed: no third, unexpected worker installation
    // (#222). Such a worker would not necessarily wait or show the chip.
    expect(installedVersions.size).toBe(2);
  });

  test('its browser ignores a proxy set in the environment', async ({
    browser,
    launchOptions,
  }) => {
    // Arrange: a local proxy that records what it is asked to reach and
    // forwards nothing. A proxy resolves host names itself, so the browser's
    // resolver rules alone would let worker requests reach other hosts.
    const proxyRequests: string[] = [];
    const proxy = net.createServer((socket) =>
      socket.once('data', (data) => {
        proxyRequests.push(data.toString().split('\r\n')[0]);
        socket.destroy();
      })
    );
    await new Promise<void>((resolve) => proxy.listen(0, '127.0.0.1', resolve));
    const { port } = proxy.address() as net.AddressInfo;
    const proxyURL = `http://127.0.0.1:${port}`;
    const proxied = await browser.browserType().launch({
      ...launchOptions,
      env: { ...process.env, http_proxy: proxyURL, https_proxy: proxyURL },
    });

    try {
      // Act
      const page = await proxied.newPage();
      const outcome = await page.evaluate(() =>
        fetch('https://fonts.googleapis.com/css').then(
          () => 'loaded',
          () => 'failed'
        )
      );

      // Assert
      expect(outcome).toBe('failed');
      expect(proxyRequests).toEqual([]);
    } finally {
      await proxied.close();
      proxy.close();
    }
  });
});
