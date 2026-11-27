import type { Page } from '@playwright/test';
import { download, pasteIntoEditor } from './app';
import { test, expect } from './journey';

// A matrix of two columns and two rows with one outline of squares, named so
// that its output file tells which configuration generated it.
const configuration = (outline: string) => `points:
  zones:
    matrix:
      columns:
        left:
        right:
      rows:
        bottom:
        top:
outlines:
  ${outline}:
    - what: rectangle
      where: true
      size: 14
`;
const first = configuration('first');
const second = configuration('second');

const downloadOutput = (page: Page, file: string) =>
  page.getByLabel(`Download ${file}`, { exact: true });
const headerName = (page: Page, name: string) =>
  page.getByRole('banner').getByText(name, { exact: true });
// The button of a configuration in the navigation has the name of its icon in
// its accessible name, so select it by its tooltip.
const savedConfiguration = (page: Page, name: string) =>
  page.getByTitle(name, { exact: true });

async function openNavigation(page: Page) {
  await page.getByRole('button', { name: 'Show navigation panel' }).click();
  await expect(page.getByText('Saved Configurations')).toBeVisible();
}

async function downloadConfiguration(page: Page) {
  const file = await download(
    page,
    page.getByRole('button', { name: 'Download configuration' })
  );
  return file.content.toString('utf8');
}

test('keeps the configurations that the user creates, renames, switches, and deletes', async ({
  page,
  journey,
}) => {
  const errorBanner = page.getByRole('button', { name: 'Close error message' });
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

  await journey.step('Open the app', async () => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Ergogen Web UI' })
    ).toBeVisible();
  });

  await journey.step('Choose Empty Configuration', async () => {
    await page
      .getByRole('button', { name: 'Start with empty configuration' })
      .click();
    await expect(headerName(page, 'Untitled 1')).toBeAttached();
  });

  await journey.step('Paste the outline first', async () => {
    await pasteIntoEditor(page, first);
    await expect(downloadOutput(page, 'first.dxf')).toBeVisible({
      timeout: 30_000,
    });
    await expect(errorBanner).toBeHidden();
  });

  await journey.step('Create a second configuration', async () => {
    await page.getByRole('button', { name: 'Start new configuration' }).click();
    await page
      .getByRole('button', { name: 'Start with empty configuration' })
      .click();
    await expect(headerName(page, 'Untitled 2')).toBeAttached();
  });

  await journey.step('Paste the outline second', async () => {
    await pasteIntoEditor(page, second);
    await expect(downloadOutput(page, 'second.dxf')).toBeVisible({
      timeout: 30_000,
    });
    await expect(errorBanner).toBeHidden();
  });

  await journey.step('Rename Untitled 1 in the navigation', async () => {
    await openNavigation(page);
    await page
      .getByRole('button', { name: 'Rename configuration Untitled 1' })
      .click();
    await page
      .getByRole('textbox', { name: 'Rename input' })
      .fill('Journey first');
    await page.getByRole('button', { name: 'Save name' }).click();
    await expect(savedConfiguration(page, 'Journey first')).toBeVisible();
    await expect(savedConfiguration(page, 'Untitled 1')).toHaveCount(0);
    await page.getByRole('button', { name: 'Close navigation panel' }).click();
  });

  await journey.step('Reload the page', async () => {
    // Reload before any other change. Each change stores the whole list, which
    // would keep the new name even if the rename did not store it.
    await page.reload();
    await expect(headerName(page, 'Untitled 2')).toBeAttached({
      timeout: 30_000,
    });
    await expect(downloadOutput(page, 'second.dxf')).toBeVisible({
      timeout: 30_000,
    });
    await openNavigation(page);
    await expect(
      savedConfiguration(page, 'Journey first'),
      'the renamed configuration in the navigation after the reload'
    ).toBeVisible();
    await expect(savedConfiguration(page, 'Untitled 2')).toBeVisible();
    await expect(savedConfiguration(page, 'Untitled 1')).toHaveCount(0);
  });

  await journey.step('Switch to Journey first in the navigation', async () => {
    await savedConfiguration(page, 'Journey first').click();
    await expect(headerName(page, 'Journey first')).toBeAttached();
    await expect(downloadOutput(page, 'first.dxf')).toBeVisible({
      timeout: 30_000,
    });
    await expect(downloadOutput(page, 'second.dxf')).toBeHidden();
    expect(
      await downloadConfiguration(page),
      'the configuration of Journey first'
    ).toBe(first);
  });

  await journey.step('Delete Untitled 2 in the navigation', async () => {
    await openNavigation(page);
    page.once('dialog', async (dialog) => {
      journey.observe('deleteQuestion', dialog.message());
      await dialog.accept();
    });
    await page
      .getByRole('button', { name: 'Delete configuration Untitled 2' })
      .click();
    await expect(savedConfiguration(page, 'Untitled 2')).toHaveCount(0);
    await expect(savedConfiguration(page, 'Journey first')).toBeVisible();
    await page.getByRole('button', { name: 'Close navigation panel' }).click();
  });

  await journey.step('Reload the page again', async () => {
    await page.reload();
    await expect(
      headerName(page, 'Journey first'),
      'the configuration that the user switched to, after the reload'
    ).toBeAttached({
      timeout: 30_000,
    });
    await expect(downloadOutput(page, 'first.dxf')).toBeVisible({
      timeout: 30_000,
    });
    expect(
      await downloadConfiguration(page),
      'the configuration of Journey first after the reload'
    ).toBe(first);
    await openNavigation(page);
    // Each configuration in the navigation has its own Rename button.
    const renameButtons = page.getByRole('button', {
      name: /^Rename configuration ./,
    });
    await expect(
      renameButtons,
      'the configurations in the navigation after the delete and the reload'
    ).toHaveCount(1);
    await expect(savedConfiguration(page, 'Journey first')).toBeVisible();
    journey.observe(
      'saved',
      await renameButtons.evaluateAll((buttons) =>
        buttons.map((button) => button.getAttribute('aria-label'))
      )
    );
  });
});
