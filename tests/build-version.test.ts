// @vitest-environment node
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { loadConfigFromFile } from 'vite';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(
  readFileSync(resolve(projectRoot, 'package.json'), 'utf8')
);
const versionKeys = [
  'VITE_ERGOGEN_VERSION',
  'ERGOGEN_VERSION',
  'REACT_APP_ERGOGEN_VERSION',
];

beforeEach(() => {
  for (const key of versionKeys) vi.stubEnv(key, '');
});
afterEach(() => vi.unstubAllEnvs());

it('keeps the canonical engine identity without repository-variable metadata', async () => {
  // Act: load the actual build config with no version overrides.
  const loaded = await loadConfigFromFile(
    { command: 'build', mode: 'test' },
    resolve(projectRoot, 'vite.config.mts')
  );
  // Assert: legacy share links and new builds identify the same fork.
  expect(
    JSON.parse(loaded!.config.define!['import.meta.env.VITE_ERGOGEN_VERSION'])
  ).toBe(manifest.dependencies.ergogen);
});

it.each(versionKeys)(
  'preserves an explicit %s compatibility override',
  async (key) => {
    // Arrange
    const specifier = 'github:example/ergogen#test-ref';
    vi.stubEnv(key, specifier);
    // Act
    const loaded = await loadConfigFromFile(
      { command: 'build', mode: 'test' },
      resolve(projectRoot, 'vite.config.mts')
    );
    // Assert
    expect(
      JSON.parse(loaded!.config.define!['import.meta.env.VITE_ERGOGEN_VERSION'])
    ).toBe(specifier);
  }
);
