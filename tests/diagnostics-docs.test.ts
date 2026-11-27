// @vitest-environment node
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  diagnosticCatalog,
  type DiagnosticCode,
} from '../src/diagnostics/catalog';
import { diagnosticAnchor } from '../src/diagnostics/diagnostic';
import { headingsOf } from './markdown';

/**
 * Each diagnostic code needs a section in the contributor documentation and in
 * the repair guide for agents. The console links to both by the anchor of the
 * code, so the heading of each section must produce that anchor.
 */

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const documents = [
  'docs/diagnostics.md',
  '.agents/skills/ergogen-gui-diagnostics/SKILL.md',
];
const codes = Object.keys(diagnosticCatalog) as DiagnosticCode[];
const looksLikeCode = (text: string) => /^[A-Z][A-Z0-9_]*$/.test(text);

describe.each(documents)('%s', (path) => {
  const headings = headingsOf(readFileSync(join(root, path), 'utf8')).map(
    ({ text, anchor }) => ({ text: text.replaceAll('`', ''), anchor })
  );

  it('has a section for each code, at the anchor that the console prints', () => {
    // Arrange
    const expected = codes.map((code) => [code, diagnosticAnchor(code)]);

    // Act
    const found = codes.map((code) => [
      code,
      headings.find(({ text }) => text === code)?.anchor,
    ]);

    // Assert
    expect(found).toEqual(expected);
  });

  it('has no section for a code that the catalog lacks', () => {
    // Arrange
    const known = new Set<string>(codes);

    // Act
    const unknown = headings
      .map(({ text }) => text)
      .filter((text) => looksLikeCode(text) && !known.has(text));

    // Assert
    expect(unknown).toEqual([]);
  });
});
