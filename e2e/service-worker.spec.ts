import fs from 'node:fs';
import type { Page, Response } from '@playwright/test';
import { test, expect } from './fixtures';
import { makeShooter } from './utils/screenshots';
import {
  appBase,
  expectDecodedImages,
  waitForServiceWorkerControl,
  welcomeImages,
} from './utils/baseAssets';

const IMAGE_CACHE = 'public-images-v1';

/** Reads the runtime image cache without creating it. */
const cachedImageUrls = (page: Page) =>
  page.evaluate(async (name) => {
    if (!(await caches.has(name))) return [];
    const cache = await caches.open(name);
    return (await cache.keys()).map((request) => request.url);
  }, IMAGE_CACHE);

/** Fetches a URL from the page, through its service worker. */
const fetchFromPage = (page: Page, url: string) =>
  page.evaluate(async (target) => {
    try {
      const response = await fetch(target);
      return {
        status: response.status,
        type: response.headers.get('content-type'),
      };
    } catch {
      return 'network error';
    }
  }, url);

// Runs against the root build and the subpath build (see playwright.config.mts).
test.describe('Service worker', () => {
  test('caches example previews, the logo and the favicon at runtime and serves them offline', async ({
    page,
    context,
    baseURL,
  }) => {
    // Arrange: the first visit installs the worker; the reload is controlled
    const shoot = makeShooter(page, test.info());
    const base = appBase(baseURL);
    const { previews, logo } = welcomeImages(page);
    await page.goto('new');
    expect(await waitForServiceWorkerControl(page)).toEqual({
      scope: base,
      script: `${base}service-worker.js`,
    });

    // Act: real requests through the worker prime its runtime cache
    await page.reload();
    await expectDecodedImages(previews, `${base}images/previews/`);
    await expectDecodedImages(logo, `${base}ergogen.png`);
    const previewUrls = await previews.evaluateAll((nodes) =>
      (nodes as HTMLImageElement[]).map((image) => image.currentSrc)
    );

    // Assert
    await expect
      .poll(() => cachedImageUrls(page))
      .toEqual(expect.arrayContaining([...previewUrls, `${base}ergogen.png`]));

    // Act: the favicon is cached the same way
    expect(await fetchFromPage(page, `${base}favicon.ico`)).toEqual({
      status: 200,
      type: 'image/x-icon',
    });

    // Assert
    await expect
      .poll(() => cachedImageUrls(page))
      .toContain(`${base}favicon.ico`);

    // Act: reload without a network
    await context.setOffline(true);
    const offlineImages: Response[] = [];
    page.on('response', (response) => {
      const path = response.url().slice(base.length);
      if (path.startsWith('images/') || path === 'ergogen.png') {
        offlineImages.push(response);
      }
    });
    const documentResponse = await page.reload();

    // Assert: the shell comes from the precache, the images from the runtime cache
    expect(documentResponse?.fromServiceWorker()).toBe(true);
    await expect(page.getByText('Ergogen Web UI')).toBeVisible();
    await expectDecodedImages(previews, `${base}images/previews/`);
    await expectDecodedImages(logo, `${base}ergogen.png`);
    expect(offlineImages.map((response) => response.url()).sort()).toEqual(
      [...previewUrls, `${base}ergogen.png`].sort()
    );
    for (const response of offlineImages) {
      expect(response.fromServiceWorker()).toBe(true);
      expect(response.status()).toBe(200);
    }
    expect(await fetchFromPage(page, `${base}favicon.ico`)).toEqual({
      status: 200,
      type: 'image/x-icon',
    });
    // The network really is down, for the page and for the worker: an image
    // the worker never cached cannot load.
    const [uncachedImage] = fs.readdirSync('public/images/changelog');
    expect(
      await fetchFromPage(page, `${base}images/changelog/${uncachedImage}`)
    ).toBe('network error');
    expect(await fetchFromPage(page, `${base}build-id.txt`)).toBe(
      'network error'
    );
    await previews.first().scrollIntoViewIfNeeded();
    await shoot(`${test.info().project.name}-offline-welcome`);
  });
});
