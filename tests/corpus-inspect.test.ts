import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { svgOutlineGeometry } from './corpus/inspect';

// The corpus trusts svgOutlineGeometry to reject an SVG whose viewport does
// not frame its paths and to count only closed outlines as regions. These
// cases use a tracked preview and small hand-written paths.

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const absolem = readFileSync(
  join(projectRoot, 'public', 'images', 'previews', 'absolem.svg'),
  'utf8'
);

/** A 10 x 10 mm square at x 5..15, y 7..17 in SVG coordinates (y down). */
const square = 'M 5 7 L 15 7 L 15 17 L 5 17 L 5 7 Z';

const svgWith = (viewBox: string | null, pathData = square) =>
  `<svg ${viewBox === null ? '' : `viewBox="${viewBox}" `}xmlns="http://www.w3.org/2000/svg"><path d="${pathData}"/></svg>`;

describe('svgOutlineGeometry viewBox', () => {
  it('reads a tracked preview and ignores its background style', () => {
    // Act
    const geometry = svgOutlineGeometry(absolem);
    // Assert: the preview's viewBox is "0 0 255.634 132.139".
    expect(absolem).toContain('style="background-color:');
    expect(geometry.width).toBeCloseTo(255.634, 3);
    expect(geometry.height).toBeCloseTo(132.139, 3);
  });

  it('accepts an origin other than 0 0 when it is where the paths start', () => {
    // Act
    const geometry = svgOutlineGeometry(svgWith('5 7 10 10'));
    // Assert
    expect(geometry.width).toBeCloseTo(10, 3);
    expect(geometry.height).toBeCloseTo(10, 3);
    expect(geometry.regions).toBe(1);
  });

  it.each([
    [
      'the tracked preview with its viewport moved off the drawing',
      absolem.replace('viewBox="0 0 ', 'viewBox="10000 10000 '),
    ],
    ['no viewBox', svgWith(null)],
    ['a NaN origin', svgWith('NaN 7 10 10')],
    ['a NaN width', svgWith('5 7 NaN 10')],
    ['an infinite height', svgWith('5 7 10 Infinity')],
    ['three values', svgWith('5 7 10')],
    ['five values', svgWith('5 7 10 10 0')],
    ['a negative size', svgWith('15 17 -10 -10')],
    ['a y origin in makerjs coordinates (y up)', svgWith('5 -17 10 10')],
    ['a size larger than the paths', svgWith('5 7 10 12')],
  ])('rejects %s', (_, svg) => {
    // Act / Assert
    expect(() => svgOutlineGeometry(svg)).toThrow(/viewBox/);
  });
});

describe('svgOutlineGeometry regions', () => {
  it('counts a closed square as one region', () => {
    // Act
    const geometry = svgOutlineGeometry(
      svgWith('0 0 10 10', 'M 0 0 L 10 0 L 10 10 L 0 10 Z')
    );
    // Assert
    expect(geometry.regions).toBe(1);
  });

  it('does not count a square with a missing side as a region', () => {
    // Act
    const geometry = svgOutlineGeometry(
      svgWith('0 0 10 10', 'M 0 0 L 10 0 L 10 10 L 0 10')
    );
    // Assert: the bounding box alone cannot tell the gap.
    expect(geometry.width).toBeCloseTo(10, 3);
    expect(geometry.height).toBeCloseTo(10, 3);
    expect(geometry.segments).toHaveLength(3);
    expect(geometry.regions).toBe(0);
  });
});
