import { pasteIntoEditor, previewSize } from './app';
import { test, expect } from './journey';

const matrix = `points:
  zones:
    matrix:
      columns:
        left:
        right:
      rows:
        bottom:
        top:
outlines:
`;

// An outline of one rectangle at each key of the matrix. Ergogen spaces the
// keys 19 mm apart, so rectangles `w` wide and `h` high make an outline
// 19 + w mm wide and 19 + h mm high.
const outline = (name: string, size: string) => `  ${name}:
    - what: rectangle
      where: true
      size: ${size}
`;

const board = outline('board', '[18, 10]');
const plate = outline('plate', '14');

test('previews the output that the user chooses in Outputs', async ({
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
  });

  await journey.step('Paste the outlines board and plate', async () => {
    await pasteIntoEditor(page, matrix + board + plate);
    await expect(
      page.getByLabel('Download plate.dxf', { exact: true })
    ).toBeVisible({ timeout: 30_000 });
    await expect(errorBanner).toBeHidden();
    // Before a choice, the preview shows demo.svg, whose keys are 18 mm squares.
    await expect
      .poll(() => previewSize(page))
      .toEqual({ width: '37mm', height: '37mm' });
    journey.observe('demo', await previewSize(page));
  });

  await journey.step('Choose board.dxf in Outputs', async () => {
    await page.getByText('board.dxf', { exact: true }).click();
    await expect
      .poll(() => previewSize(page))
      .toEqual({ width: '37mm', height: '29mm' });
    journey.observe('board', await previewSize(page));
  });

  await journey.step('Choose plate.dxf in Outputs', async () => {
    await page.getByText('plate.dxf', { exact: true }).click();
    await expect
      .poll(() => previewSize(page))
      .toEqual({ width: '33mm', height: '33mm' });
    journey.observe('plate', await previewSize(page));
  });

  await journey.step('Paste the configuration without plate', async () => {
    await pasteIntoEditor(page, matrix + board);
    await expect(
      page.getByLabel('Download plate.dxf', { exact: true })
    ).toBeHidden({ timeout: 30_000 });
    await expect(errorBanner).toBeHidden();
    // The chosen output is gone, so the preview falls back to demo.svg.
    await expect
      .poll(() => previewSize(page))
      .toEqual({ width: '37mm', height: '37mm' });
    journey.observe('withoutPlate', await previewSize(page));
  });

  await journey.step('Turn on Debug in the settings', async () => {
    await page.getByRole('button', { name: 'Show settings panel' }).click();
    await page.getByText('Debug', { exact: true }).click();
    await expect(
      page.getByRole('checkbox', { name: 'Enable debug mode' })
    ).toBeChecked();
    await page.getByRole('button', { name: 'Hide settings panel' }).click();
    await expect(
      page.getByLabel('Download points.yaml', { exact: true })
    ).toBeVisible();
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

  await journey.step('Choose points.yaml in Outputs', async () => {
    await page.getByText('points.yaml', { exact: true }).click();
    const preview = page
      .getByLabel(/^YAML preview for points/)
      .getByRole('code');
    // The first point of the matrix, which Ergogen names after the zone, the
    // column, and the row of the pasted configuration.
    await expect(preview).toContainText('matrix_left_bottom:');
    journey.observe(
      'pointsPreview',
      (await preview.innerText()).match(/^matrix_\w+:/m)?.[0]
    );
  });
});
