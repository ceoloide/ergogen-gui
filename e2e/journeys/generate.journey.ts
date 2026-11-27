import { pasteIntoEditor, previewSize } from './app';
import { test, expect } from './journey';

// A board of 18 mm keys, `columns` wide and two rows high. Ergogen spaces the
// keys 19 mm apart, so the outline is 19 * columns - 1 mm wide and 37 mm high.
const boardConfig = (columns: string[]) => `points:
  zones:
    matrix:
      columns:
${columns.map((column) => `        ${column}:`).join('\n')}
      rows:
        bottom:
        top:
outlines:
  board:
    - what: rectangle
      where: true
      size: 18
`;

test('generates the outputs of a configuration typed in the editor', async ({
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
    await expect(
      page.getByRole('textbox', { name: 'Editor content' })
    ).toBeAttached();
    await expect(
      page.getByRole('button', { name: 'Generate configuration' })
    ).toBeVisible();
  });

  await journey.step(
    'Paste a board of two columns into the editor',
    async () => {
      await pasteIntoEditor(page, boardConfig(['left', 'right']));
      await expect(page.getByRole('code')).toContainText('board:');
    }
  );

  await journey.step('Choose Generate', async () => {
    await page.getByRole('button', { name: 'Generate configuration' }).click();
    // The download control of an output has a label but no role.
    await expect(
      page.getByLabel('Download board.dxf', { exact: true })
    ).toBeVisible({ timeout: 30_000 });
    await expect(errorBanner).toBeHidden();
    journey.observe(
      'outputs',
      await page
        .getByLabel(/^Download .+\.\w+$/)
        .evaluateAll((buttons) =>
          buttons.map((button) =>
            button.getAttribute('aria-label')?.replace(/^Download /, '')
          )
        )
    );
  });

  await journey.step('Choose board.dxf in Outputs', async () => {
    await page.getByText('board.dxf', { exact: true }).click();
    await expect
      .poll(() => previewSize(page))
      .toEqual({ width: '37mm', height: '37mm' });
    journey.observe('boardOfTwoColumns', await previewSize(page));
  });

  await journey.step(
    'Paste a board of three columns and press Ctrl+Enter',
    async () => {
      await pasteIntoEditor(page, boardConfig(['left', 'middle', 'right']));
      await page.keyboard.press('ControlOrMeta+Enter');
      await expect
        .poll(() => previewSize(page), { timeout: 30_000 })
        .toEqual({ width: '56mm', height: '37mm' });
      await expect(errorBanner).toBeHidden();
      journey.observe('boardOfThreeColumns', await previewSize(page));
    }
  );
});
