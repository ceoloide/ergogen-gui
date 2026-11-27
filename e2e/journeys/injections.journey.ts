import {
  addCustomFootprint,
  download,
  markerBoardConfig,
  markerBoardFootprints,
  markerFootprint,
  pasteIntoEditor,
  pcbFootprints,
} from './app';
import { test, expect } from './journey';

test('places a custom footprint that the user adds in the settings', async ({
  page,
  journey,
}) => {
  const errorBanner = page.getByRole('button', { name: 'Close error message' });
  const downloadBoard = page.getByLabel('Download board.kicad_pcb', {
    exact: true,
  });
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

  await journey.step(
    'Paste a PCB that places journey_marker before it exists',
    async () => {
      await pasteIntoEditor(page, markerBoardConfig);
      await expect(errorBanner).toBeVisible({ timeout: 30_000 });
      await expect(
        page.getByText('pcbs.board.footprints.marker.what')
      ).toBeVisible();
      await expect(downloadBoard).toBeHidden();
    }
  );

  await journey.step(
    'Add the footprint journey_marker in the settings',
    async () => {
      await addCustomFootprint(page, markerFootprint);
      await expect(
        page.getByRole('link', {
          name: `download injection ${markerFootprint.name}`,
        })
      ).toBeVisible();
    }
  );

  await journey.step('Close the settings', async () => {
    await page.getByRole('button', { name: 'Hide settings panel' }).click();
    await expect(
      downloadBoard,
      `board.kicad_pcb, which needs the footprint ${markerFootprint.name}`
    ).toBeVisible({ timeout: 30_000 });
    await expect(errorBanner).toBeHidden();
  });

  await journey.step('Download board.kicad_pcb from Outputs', async () => {
    const file = await download(page, downloadBoard);
    expect(file.name).toBe('board.kicad_pcb');
    const footprints = pcbFootprints(file.content.toString('utf8'));
    expect(
      footprints,
      'the footprints of the downloaded board.kicad_pcb'
    ).toEqual(markerBoardFootprints);
    journey.observe('pcb', { name: file.name, footprints });
  });
});
