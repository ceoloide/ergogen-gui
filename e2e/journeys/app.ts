import type { Page } from '@playwright/test';

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
