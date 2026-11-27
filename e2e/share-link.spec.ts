import { compressToEncodedURIComponent } from 'lz-string';
import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';

// Names that appear only in this configuration and in its outputs.
const sharedConfig = `points:
  zones:
    shared_zone:
      columns:
        shared_column:
      rows:
        shared_row:
outlines:
  shared_plate:
    - what: rectangle
      where: true
      size: 18
`;

// The link format that README.md#share-links documents.
const shareLink = (data: { config: string }) =>
  `/#${compressToEncodedURIComponent(JSON.stringify(data))}`;

// What the app logs and shows when it asks for a generation before the
// Ergogen worker has started.
const workerNotReady = 'Worker not available for processing request.';

// Collects the console errors of the page from the first navigation on.
const recordConsoleErrors = (page: Page) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
};

test.describe('Share links', () => {
  test('a share link opens its configuration in the editor of a browser with empty storage', async ({
    page,
  }) => {
    const consoleErrors = recordConsoleErrors(page);

    await page.goto(shareLink({ config: sharedConfig }));

    await expect(
      page.getByRole('textbox', { name: 'Editor content' }),
      'the editor of the configuration that the link carried'
    ).toBeAttached({ timeout: 30_000 });
    await expect(page.getByRole('code')).toContainText('shared_plate');
    await expect(
      page.getByLabel('Download shared_plate.dxf', { exact: true }),
      'an output of the configuration that the link carried'
    ).toBeVisible({ timeout: 30_000 });
    await expect(page, 'the editor, without the hash of the link').toHaveURL(
      /^[^#]*\/$/
    );
    expect(
      consoleErrors,
      'a generation that started after the Ergogen worker'
    ).not.toContain(workerNotReady);
  });

  test('a share link generates its outputs with automatic generation off', async ({
    page,
  }) => {
    // The key that the app reads when it has no saved settings.
    await page.addInitScript(() => {
      localStorage.setItem('ergogen:config:autoGen', 'false');
    });
    const consoleErrors = recordConsoleErrors(page);

    await page.goto(shareLink({ config: sharedConfig }));

    await expect(
      page.getByLabel('Download shared_plate.dxf', { exact: true }),
      'an output that only the generation of the link builds'
    ).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText(workerNotReady)).toBeHidden();
    expect(
      consoleErrors,
      'a generation that started after the Ergogen worker'
    ).not.toContain(workerNotReady);
  });
});
