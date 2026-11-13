import { test, expect } from './fixtures';
import { makeShooter } from './utils/screenshots';

test('minimal test: page loads and has welcome text', async ({ page }) => {
  const shoot = makeShooter(page, test.info());
  await page.goto('/');
  const welcome = page.getByText('Ergogen Web UI');
  await shoot('before-welcome-visible');
  await expect(welcome).toBeVisible();
  await shoot('after-welcome-visible');
});
