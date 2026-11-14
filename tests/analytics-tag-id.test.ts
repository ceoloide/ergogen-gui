// @vitest-environment node
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { loadConfigFromFile } from 'vite';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const loadTagId = async () => {
  const loaded = await loadConfigFromFile(
    { command: 'build', mode: 'test' },
    resolve(projectRoot, 'vite.config.mts')
  );
  return JSON.parse(loaded!.config.define!['import.meta.env.VITE_GTAG_ID']);
};

beforeEach(() => {
  vi.stubEnv('VITE_GTAG_ID', '');
  vi.stubEnv('REACT_APP_GTAG_ID', '');
});
afterEach(() => vi.unstubAllEnvs());

it('builds the GA4 tag ID from VITE_GTAG_ID', async () => {
  // Arrange
  vi.stubEnv('VITE_GTAG_ID', 'G-MODERN123');

  // Act & Assert
  expect(await loadTagId()).toBe('G-MODERN123');
});

it('ignores the retired REACT_APP_GTAG_ID', async () => {
  // Arrange
  vi.stubEnv('REACT_APP_GTAG_ID', 'G-LEGACY123');

  // Act & Assert
  expect(await loadTagId()).toBe('');
});
