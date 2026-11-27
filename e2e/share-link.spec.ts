import { compressToEncodedURIComponent } from 'lz-string';
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

test.describe('Share links', () => {
  test('a share link opens its configuration in the editor of a browser with empty storage', async ({
    page,
  }) => {
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
  });
});
