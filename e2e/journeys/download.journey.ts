import { readFile } from 'node:fs/promises';
import type { Locator, Page } from '@playwright/test';
import JSZip from 'jszip';
import { pasteIntoEditor } from './app';
import { test, expect } from './journey';

// Rectangles 14 mm wide and 10 mm high at the four keys of a matrix, whose
// keys sit 19 mm apart around (0, 0). The outline spans x from -7 to 26 mm
// and y from -5 to 24 mm, with four lines for each rectangle.
const config = `points:
  zones:
    matrix:
      columns:
        left:
        right:
      rows:
        bottom:
        top:
outlines:
  plate:
    - what: rectangle
      where: true
      size: [14, 10]
`;
const plateGeometry = { lines: 16, x: [-7, 26], y: [-5, 24] };

async function download(page: Page, control: Locator) {
  const [file] = await Promise.all([
    page.waitForEvent('download'),
    control.click(),
  ]);
  return {
    name: file.suggestedFilename(),
    content: await readFile(await file.path()),
  };
}

// The lines of a DXF file and the range of their ends. A DXF file is a list
// of pairs of lines: a group code, then its value. In the ENTITIES section,
// the codes 10 and 11 hold the x of the two ends of a line, and 20 and 21
// their y.
function dxfGeometry(dxf: string) {
  const lines = dxf.split(/\r?\n/).map((line) => line.trim());
  const xs: number[] = [];
  const ys: number[] = [];
  let count = 0;
  let inEntities = false;
  for (let i = 0; i + 1 < lines.length; i += 2) {
    const [code, value] = [lines[i], lines[i + 1]];
    if (code === '2') inEntities = value === 'ENTITIES';
    if (!inEntities) continue;
    if (code === '0' && value === 'LINE') count += 1;
    if (code === '10' || code === '11') xs.push(Number(value));
    if (code === '20' || code === '21') ys.push(Number(value));
  }
  const range = (values: number[]) =>
    values.length ? [Math.min(...values), Math.max(...values)] : [];
  return { lines: count, x: range(xs), y: range(ys) };
}

async function archiveTexts(content: Buffer) {
  const zip = await JSZip.loadAsync(content);
  const texts: Record<string, string> = {};
  for (const entry of Object.values(zip.files)) {
    if (!entry.dir) texts[entry.name] = await entry.async('string');
  }
  return texts;
}

test('downloads the outputs and configurations that the user chooses', async ({
  page,
  journey,
}) => {
  const errorBanner = page.getByRole('button', { name: 'Close error message' });
  const downloadPlate = page.getByLabel('Download plate.dxf', { exact: true });
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

  await journey.step('Paste the outline plate into the editor', async () => {
    await pasteIntoEditor(page, config);
    await expect(downloadPlate).toBeVisible({ timeout: 30_000 });
    await expect(errorBanner).toBeHidden();
  });

  await journey.step('Download plate.dxf from Outputs', async () => {
    const file = await download(page, downloadPlate);
    expect(file.name).toBe('plate.dxf');
    const geometry = dxfGeometry(file.content.toString('utf8'));
    expect(geometry, 'the lines of the downloaded plate.dxf').toEqual(
      plateGeometry
    );
    journey.observe('output', { name: file.name, ...geometry });
  });

  await journey.step('Download the configuration', async () => {
    const file = await download(
      page,
      page.getByRole('button', { name: 'Download configuration' })
    );
    expect(file.name).toBe('config.yaml');
    expect(
      file.content.toString('utf8'),
      'the downloaded config.yaml holds the pasted configuration'
    ).toBe(config);
    journey.observe('configuration', {
      name: file.name,
      bytes: file.content.length,
    });
  });

  await journey.step('Download the archive of all outputs', async () => {
    const file = await download(
      page,
      page.getByRole('button', {
        name: 'Download archive of all generated files',
      })
    );
    expect(file.name).toMatch(/^ergogen-\d{4}-\d{2}-\d{2}\.zip$/);
    const files = await archiveTexts(file.content);
    expect(Object.keys(files)).toEqual([
      'config.yaml',
      'outputs/demo.svg',
      'outputs/outlines/plate.dxf',
      'outputs/outlines/plate.svg',
    ]);
    expect(
      files['config.yaml'],
      'the archive holds the pasted configuration'
    ).toBe(config);
    expect(
      dxfGeometry(files['outputs/outlines/plate.dxf']),
      'the lines of plate.dxf in the archive'
    ).toEqual(plateGeometry);
    journey.observe('archive', { name: file.name, files: Object.keys(files) });
  });

  await journey.step('Open Download All in the navigation', async () => {
    await page.getByRole('button', { name: 'Show navigation panel' }).click();
    await page.getByRole('button', { name: 'Download All' }).click();
    await expect(
      page.getByRole('heading', { name: 'Download Configurations' })
    ).toBeVisible();
    await expect(
      page.getByRole('checkbox', { name: 'Untitled 1' })
    ).toBeChecked();
  });

  await journey.step('Download the stored configurations', async () => {
    const file = await download(
      page,
      page.getByRole('button', { name: 'Download (1)' })
    );
    expect(file.name).toMatch(/^ergogen-config-all-\d{4}-\d{2}-\d{2}\.zip$/);
    const files = await archiveTexts(file.content);
    expect(Object.keys(files)).toEqual(['Untitled 1.yaml']);
    expect(
      files['Untitled 1.yaml'],
      'the archive holds the stored configuration, which is the pasted one'
    ).toBe(config);
    await expect(
      page.getByRole('heading', { name: 'Download Configurations' })
    ).toBeHidden();
    journey.observe('storedConfigurations', {
      name: file.name,
      files: Object.keys(files),
    });
  });
});
