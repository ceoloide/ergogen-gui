import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as ergogen from 'ergogen';
import { describe, expect, it } from 'vitest';
import { exampleOptions } from '../src/examples';
import { segmentDifferences, svgOutlineGeometry } from './corpus/inspect';

/**
 * The example previews in public/images/previews are generated files that the
 * repository tracks. `pnpm generate-previews` (scripts/generate-previews.js)
 * renders each example with the prepared engine, then only restyles the SVG
 * (size, background, stroke colour). These tests regenerate the same geometry
 * and compare it with the tracked file, so a stale or hand-edited preview
 * fails. Path direction and start vertex are ignored: an identical outline can
 * be traversed differently by different makerjs runs.
 */

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const previewsDirectory = join(projectRoot, 'public', 'images', 'previews');

// The same file name rule as scripts/generate-previews.js and the Welcome page.
const previewFileName = (label: string) =>
  `${label.toLowerCase().replace(/[\s()]/g, '_')}.svg`;

// The script skips the empty example, which has nothing to draw.
const examples = exampleOptions
  .flatMap((group) => group.options)
  .filter((example) => example.label !== 'Empty YAML configuration');

describe('tracked example previews', () => {
  it('has exactly one preview per drawable example', () => {
    // Assert
    expect(readdirSync(previewsDirectory).sort()).toEqual(
      examples.map((example) => previewFileName(example.label)).sort()
    );
  });

  it.each(examples.map((example) => [example.label, example] as const))(
    'preview of %s matches the geometry generated now',
    async (label, example) => {
      // Arrange
      const previewPath = join(previewsDirectory, previewFileName(label));
      expect(existsSync(previewPath), `${previewPath} exists`).toBe(true);
      // Act: the same engine call and output choice as the script.
      const output = await ergogen.process(example.value, {
        svg: true,
        debug: true,
      });
      const generated = output.outlines?.preview?.svg || output.demo.svg;
      const tracked = svgOutlineGeometry(readFileSync(previewPath, 'utf8'));
      const expected = svgOutlineGeometry(generated);
      // Assert
      const stale = `${previewFileName(label)} is stale; run pnpm generate-previews`;
      expect(tracked.width, stale).toBeCloseTo(expected.width, 2);
      expect(tracked.height, stale).toBeCloseTo(expected.height, 2);
      expect(tracked.regions, stale).toBe(expected.regions);
      expect(tracked.otherPaths, stale).toBe(expected.otherPaths);
      expect(
        segmentDifferences(tracked.segments, expected.segments),
        stale
      ).toEqual({ missing: [], unexpected: [] });
    },
    20000
  );
});
