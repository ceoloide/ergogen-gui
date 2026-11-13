import { test, expect } from './fixtures';
import { makeShooter } from './utils/screenshots';

test('renders editor and preview', async ({ page }) => {
  const shoot = makeShooter(page, test.info());
  await page.goto('/new');
  await page.getByRole('button', { name: 'Empty Configuration' }).click();

  const editor = page.getByTestId('config-editor');
  await shoot('before-editor-visible');
  await expect(editor).toBeVisible();
  await shoot('after-editor-visible');

  const preview = page.getByTestId('demo.svg-file-preview');
  await shoot('before-preview-visible');
  await expect(preview).toBeVisible();
  await shoot('after-preview-visible');
});
