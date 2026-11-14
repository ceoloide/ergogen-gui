import { readFile } from 'node:fs/promises';
import { CONFIG_LOCAL_STORAGE_KEY } from '../src/context/constants';
import { test, expect } from './fixtures';

for (const name of ['infused-kim/diode', 'infused-kimo/isde']) {
  test(`generates a downloadable PCB with ${name}`, async ({ page }) => {
    const config = JSON.stringify({
      points: {
        zones: { matrix: { columns: { one: {}, two: {} }, rows: { row: {} } } },
      },
      pcbs: {
        board: {
          template: 'kicad5',
          footprints: {
            diodes: {
              what: name,
              where: true,
              params: { from: '{{colrow}}', to: 'GND' },
            },
          },
        },
      },
    });
    await page.addInitScript(
      ({ config, key }) => localStorage.setItem(key, JSON.stringify(config)),
      { config, key: CONFIG_LOCAL_STORAGE_KEY }
    );

    await page.goto('/');
    const downloadButton = page.getByLabel('Download board.kicad_pcb', {
      exact: true,
    });
    await expect(downloadButton).toBeVisible({ timeout: 20000 });
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadButton.click(),
    ]);
    const path = test.info().outputPath('board.kicad_pcb');
    await download.saveAs(path);
    const pcb = await readFile(path, 'utf8');
    expect(pcb.match(/\(module /g)).toHaveLength(2);
    expect(pcb).toContain('GND');
    await page.screenshot({ path: test.info().outputPath('generated.png') });
  });
}
