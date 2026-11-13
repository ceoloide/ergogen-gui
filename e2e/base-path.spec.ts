import type { Response } from '@playwright/test';
import { test, expect } from './fixtures';
import { makeShooter } from './utils/screenshots';
import {
  appBase,
  expectDecodedImages,
  welcomeImages,
} from './utils/baseAssets';

// Runs against the root build and the subpath build (see playwright.config.mts).
test.describe('Base path', () => {
  test('a deep link and the base open the welcome page with real example previews', async ({
    page,
    baseURL,
  }) => {
    // Arrange
    const shoot = makeShooter(page, test.info());
    const base = appBase(baseURL);
    const previewResponses: Response[] = [];
    page.on('response', (response) => {
      if (response.url().includes('/images/previews/')) {
        previewResponses.push(response);
      }
    });
    const { previews, logo } = welcomeImages(page);

    // Act: a first visit through a deep link uses the server's SPA fallback
    await page.goto('new');

    // Assert
    await expect(page).toHaveURL(`${base}new`);
    await expect(page.getByText('Ergogen Web UI')).toBeVisible();
    await expectDecodedImages(previews, `${base}images/previews/`);
    await expectDecodedImages(logo, `${base}ergogen.png`);
    expect(previewResponses.length).toBe(await previews.count());
    for (const response of previewResponses) {
      expect(response.url()).toContain(`${base}images/previews/`);
      expect(response.status()).toBe(200);
      expect(await response.headerValue('content-type')).toContain(
        'image/svg+xml'
      );
    }
    await previews.first().scrollIntoViewIfNeeded();
    await shoot(`${test.info().project.name}-welcome-previews`);

    // Act: the base itself sends a new user to the welcome page below it
    await page.goto('./');

    // Assert
    await expect(page).toHaveURL(`${base}new`);
    await expect(page.getByText('Ergogen Web UI')).toBeVisible();
  });
});
