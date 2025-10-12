import { test, expect } from '@playwright/test';
import { makeShooter } from './utils/screenshots';
import ADux from '../src/examples/adux';
import { CONFIG_LOCAL_STORAGE_KEY } from '../src/context/constants';

test.describe('Responsive Layout', () => {
  test('should show/hide panels correctly on mobile', async ({ page }) => {
    const shoot = makeShooter(page, test.info());
    // Set viewport to a mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Empty Configuration' }).click();

    const configEditor = page.getByTestId('config-editor');
    const outputPanel = page.getByTestId('demo.svg-file-preview');

    // 1. On mobile, "Config" is active, editor is visible, output is hidden
    await shoot('before-mobile-config-visible-output-hidden');
    await expect(configEditor).toBeVisible();
    await expect(outputPanel).toBeHidden();
    await shoot('after-mobile-config-visible-output-hidden');

    // 2. Click "Outputs" button
    await page.getByRole('button', { name: 'Outputs' }).click();

    // 3. "Outputs" is active, editor is hidden, output is visible
    await shoot('before-mobile-output-visible-config-hidden');
    await expect(configEditor).toBeHidden();
    await expect(outputPanel).toBeVisible();
    await shoot('after-mobile-output-visible-config-hidden');
  });

  test('should download archive on mobile when download outputs button is clicked', async ({
    page,
  }) => {
    const shoot = makeShooter(page, test.info());
    // Set A. dux config directly in local storage
    await page.addInitScript(
      ({ config, key }) => {
        localStorage.setItem(key, JSON.stringify(config));
      },
      { config: ADux.value, key: CONFIG_LOCAL_STORAGE_KEY }
    );

    // Set viewport to a mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Wait for the generation to complete
    await page.getByTestId('downloads-container').waitFor({ timeout: 10000 });

    // Click "Outputs" button to show the outputs panel
    await page.getByRole('button', { name: 'Outputs' }).click();
    await shoot('before-outputs-panel-visible');

    // Find the download outputs button
    const downloadButton = page.getByTestId('mobile-download-outputs-button');
    await expect(downloadButton).toBeVisible();
    await shoot('before-download-button-click');

    // Set up download event listener
    const downloadPromise = page.waitForEvent('download');

    // Click the download button
    await downloadButton.click();

    // Wait for the download
    const download = await downloadPromise;
    await shoot('after-download-started');

    // Check that the filename matches the expected pattern
    expect(download.suggestedFilename()).toMatch(
      /^ergogen-\d{4}-\d{2}-\d{2}\.zip$/
    );
  });
});
