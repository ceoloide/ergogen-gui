import type { Page } from '@playwright/test';
import { appBase, expectDecodedImages } from '../utils/baseAssets';
import { test, expect } from './journey';

const welcomeHeading = (page: Page) =>
  page.getByRole('heading', { name: 'Ergogen Web UI' });
const editor = (page: Page) =>
  page.getByRole('textbox', { name: 'Editor content' });

test('opens the page that the address and the stored configurations call for', async ({
  page,
  baseURL,
  journey,
}) => {
  // Each address is relative to the base, so the journey also holds for a
  // build below a subpath.
  const base = appBase(baseURL);

  await journey.step('Open the app', async () => {
    await page.goto('./');
    await expect(page).toHaveURL(`${base}new`);
    await expect(welcomeHeading(page)).toBeVisible();
    await expectDecodedImages(
      page.getByRole('banner').getByRole('img', { name: 'Ergogen logo' }),
      `${base}ergogen.png`
    );
    journey.observe('firstVisit', new URL(page.url()).pathname);
  });

  await journey.step('Open an address that the app does not have', async () => {
    await page.goto('journey/unknown');
    await expect(page).toHaveURL(`${base}new`);
    await expect(welcomeHeading(page)).toBeVisible();
  });

  await journey.step('Choose Empty Configuration', async () => {
    await page
      .getByRole('button', { name: 'Start with empty configuration' })
      .click();
    await expect(page).toHaveURL(base);
    await expect(editor(page)).toBeAttached();
  });

  await journey.step('Open the unknown address again', async () => {
    await page.goto('journey/unknown');
    await expect(page).toHaveURL(base);
    await expect(editor(page)).toBeAttached({ timeout: 30_000 });
    journey.observe('unknownWithConfiguration', new URL(page.url()).pathname);
  });

  await journey.step('Choose Start new configuration', async () => {
    await page.getByRole('button', { name: 'Start new configuration' }).click();
    await expect(page).toHaveURL(`${base}new`);
    await expect(welcomeHeading(page)).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Start new configuration' })
    ).toBeHidden();
  });

  await journey.step(
    'Choose Untitled 1 in Pick up where you left',
    async () => {
      await page
        .getByLabel('Load Untitled 1 configuration', { exact: true })
        .click();
      await expect(page).toHaveURL(base);
      await expect(editor(page)).toBeAttached();
      await expect(
        page.getByRole('banner').getByText('Untitled 1', { exact: true })
      ).toBeAttached();
    }
  );
});
