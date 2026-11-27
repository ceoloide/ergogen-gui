import type { Page } from '@playwright/test';
import JSZip from 'jszip';
import {
  download,
  markerBoardFiles,
  markerBoardFootprints,
  markerFootprint,
  pcbFootprints,
} from './app';
import { test, expect } from './journey';

// A configuration whose only outline, local_plate, names its output file.
const plateConfig = `points:
  zones:
    matrix:
      columns:
        left:
        right:
      rows:
        bottom:
        top:
outlines:
  local_plate:
    - what: rectangle
      where: true
      size: 14
`;

// Chooses Choose File on the Welcome page and picks the file in the dialog of
// the browser. The wait for the dialog starts before the click.
async function chooseLocalFile(
  page: Page,
  file: { name: string; mimeType: string; buffer: Buffer }
) {
  const [chooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('button', { name: 'Select local file to load' }).click(),
  ]);
  await chooser.setFiles(file);
}

async function zipArchive(files: Record<string, string>) {
  const zip = new JSZip();
  for (const [path, text] of Object.entries(files)) zip.file(path, text);
  return zip.generateAsync({ type: 'nodebuffer' });
}

test('opens a configuration file and an archive from the computer', async ({
  page,
  journey,
}) => {
  const errorBanner = page.getByRole('button', { name: 'Close error message' });
  const downloadBoard = page.getByLabel('Download board.kicad_pcb', {
    exact: true,
  });

  await journey.step('Open the app', async () => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Ergogen Web UI' })
    ).toBeVisible();
  });

  await journey.step('Choose File and pick local-plate.yaml', async () => {
    await chooseLocalFile(page, {
      name: 'local-plate.yaml',
      mimeType: 'application/yaml',
      buffer: Buffer.from(plateConfig),
    });
    await expect(
      page.getByLabel('Download local_plate.dxf', { exact: true }),
      'local_plate.dxf, the outline of local-plate.yaml'
    ).toBeVisible({ timeout: 30_000 });
    await expect(errorBanner).toBeHidden();
  });

  await journey.step('Download the configuration', async () => {
    const file = await download(
      page,
      page.getByRole('button', { name: 'Download configuration' })
    );
    expect(
      file.content.toString('utf8'),
      'the downloaded configuration, which must be local-plate.yaml'
    ).toBe(plateConfig);
    journey.observe('configuration', file.name);
  });

  await journey.step('Choose Start new configuration', async () => {
    await page.getByRole('button', { name: 'Start new configuration' }).click();
    await expect(
      page.getByRole('heading', { name: 'Ergogen Web UI' })
    ).toBeVisible();
  });

  await journey.step('Choose File and pick marker-board.zip', async () => {
    const archive = await zipArchive(markerBoardFiles);
    await chooseLocalFile(page, {
      name: 'marker-board.zip',
      mimeType: 'application/zip',
      buffer: archive,
    });
    await expect(
      downloadBoard,
      `board.kicad_pcb, which needs the footprint ${markerFootprint.name} of the archive`
    ).toBeVisible({ timeout: 30_000 });
    await expect(errorBanner).toBeHidden();
    journey.observe('archive', Object.keys(markerBoardFiles));
  });

  await journey.step('Download board.kicad_pcb from Outputs', async () => {
    const file = await download(page, downloadBoard);
    const footprints = pcbFootprints(file.content.toString('utf8'));
    expect(
      footprints,
      'the footprints of the downloaded board.kicad_pcb'
    ).toEqual(markerBoardFootprints);
    journey.observe('pcb', { name: file.name, footprints });
  });
});
