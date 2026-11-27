import { readFile } from 'node:fs/promises';
import type { Browser, Locator, Page } from '@playwright/test';

// Replaces the text of the editor with a paste, as a user does. Typed text
// gets the automatic indentation of the editor on each new line.
export async function pasteIntoEditor(page: Page, text: string) {
  await page.evaluate((value) => navigator.clipboard.writeText(value), text);
  await page.getByRole('textbox', { name: 'Editor content' }).focus();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.press('ControlOrMeta+V');
}

// The width and height attributes of the SVG that the preview shows.
export async function previewSize(page: Page) {
  const source = await page
    .getByRole('img', { name: 'Ergogen SVG Output preview' })
    .getAttribute('src');
  const svg = decodeURIComponent(
    (source ?? '').replace(/^data:image\/svg\+xml;utf8,/, '')
  );
  const tag = /<svg\b[^>]*>/.exec(svg)?.[0] ?? '';
  const attribute = (name: string) =>
    new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1] ?? null;
  return { width: attribute('width'), height: attribute('height') };
}

// Chooses a control that makes the browser save a file, and reads the file.
// The wait for the download starts before the click.
export async function download(page: Page, control: Locator) {
  const [file] = await Promise.all([
    page.waitForEvent('download'),
    control.click(),
  ]);
  return {
    name: file.suggestedFilename(),
    content: await readFile(await file.path()),
  };
}

// A custom footprint that Ergogen does not have. It draws only its name and
// its reference, whose designator JM the code sets, so a PCB that holds
// `journey_marker` with the reference JM1 can come only from this footprint.
export const markerFootprint = {
  name: 'journey_marker',
  code: `module.exports = {
  params: { designator: 'JM' },
  body: (p) =>
    \`(module journey_marker (layer F.Cu) \${p.at} (fp_text reference "\${p.ref}" (at 0 0) (layer F.SilkS) (effects (font (size 1 1) (thickness 0.15)))))\`,
};
`,
};

// A matrix of two columns and two rows, and the PCB `board` with the marker
// footprint at each of its four keys.
export const markerBoardConfig = `points:
  zones:
    matrix:
      columns:
        left:
        right:
      rows:
        bottom:
        top:
pcbs:
  board:
    footprints:
      marker:
        what: ${markerFootprint.name}
        where: true
`;

// The footprints of the marker in board.kicad_pcb, one at each key.
export const markerBoardFootprints = ['JM1', 'JM2', 'JM3', 'JM4'].map(
  (reference) => ({ name: markerFootprint.name, reference })
);

// Opens Settings and adds a custom footprint as a user does: Add new custom
// footprint, then the name, then the code pasted into the editor of the
// footprint. Settings stay open.
export async function addCustomFootprint(
  page: Page,
  footprint: { name: string; code: string }
) {
  await page.getByRole('button', { name: 'Show settings panel' }).click();
  await page.getByRole('button', { name: 'Add new custom footprint' }).click();
  await page
    .getByRole('textbox', { name: 'Footprint name' })
    .fill(footprint.name);
  await pasteIntoEditor(page, footprint.code);
}

// The name and the reference of each footprint in a KiCad 5 PCB, in the order
// of the file.
export function pcbFootprints(kicadPcb: string) {
  return [
    ...kicadPcb.matchAll(/\(module (\S+)\s.*?\(fp_text reference "([^"]*)"/gs),
  ].map(([, name, reference]) => ({ name, reference }));
}

// A page in a new browser context, with empty storage, that blocks each
// request to another host than `baseURL`, as e2e/fixtures.ts does for the
// page of a journey. Close its context at the end of the journey.
export async function newContextPage(browser: Browser, baseURL: string) {
  const origin = new URL(baseURL).origin;
  const context = await browser.newContext({ baseURL });
  await context.route('**/*', (route) =>
    new URL(route.request().url()).origin === origin
      ? route.continue()
      : route.abort('blockedbyclient')
  );
  return context.newPage();
}
