import type { Page, TestInfo } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export const SCREENSHOTS_ROOT = path.join(__dirname, '..', 'screenshots');

export function ensureDir(p: string) {
  try {
    fs.mkdirSync(p, { recursive: true });
  } catch {
    // ignore
  }
}

function safeSlug(s: string) {
  return s.replace(/[^a-z0-9-_]/gi, '_');
}

/**
 * Creates a screenshot function for a given test that writes into
 *   e2e/screenshots/<spec-file-base>/
 *
 * Filenames follow: <test-title-slug>-<counter>-<label>.png
 */
export function makeShooter(page: Page, info: TestInfo): (label: string) => Promise<void> {
  const specBase = path.basename(info.file, path.extname(info.file));
  const folder = path.join(SCREENSHOTS_ROOT, specBase);
  ensureDir(folder);

  let counter = 0;
  const testSlug = safeSlug(info.title);

  return async (label: string) => {
    const idx = String(++counter).padStart(2, '0');
    const file = `${testSlug}-${idx}-${safeSlug(label).slice(0, 80)}.png`;
    await page.screenshot({ path: path.join(folder, file), fullPage: true });
  };
}
