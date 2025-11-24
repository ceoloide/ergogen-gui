import { test, expect } from '@playwright/test';
import { makeShooter } from './utils/screenshots';

test.describe('Responsive Layout', () => {
  test('should show/hide panels correctly on mobile', async ({ page }) => {
    const shoot = makeShooter(page, test.info());
    // Set viewport to a mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.getByTestId('empty-config-button').click();

    const configEditor = page.getByTestId('config-editor');
    const outputPanel = page.getByTestId('demo.svg-file-preview');

    // 1. On mobile, "Config" is active, editor is visible, output is hidden
    await shoot('before-mobile-config-visible-output-hidden');
    await expect(configEditor).toBeVisible();
    await expect(outputPanel).toBeHidden();
    await shoot('after-mobile-config-visible-output-hidden');

    // 2. Click "Outputs" button
    await page.getByTestId('mobile-outputs-button').click();

    // 3. "Outputs" is active, editor is hidden, output is visible
    await shoot('before-mobile-output-visible-config-hidden');
    await expect(configEditor).toBeHidden();
    await expect(outputPanel).toBeVisible();
    await shoot('after-mobile-output-visible-config-hidden');
  });
});
