import { describe, expect, it } from 'vitest';
import * as ergogen from 'ergogen';
import { exampleOptions } from '../src/examples';
import { svgOutlineGeometry } from './corpus/inspect';

describe('Briefs 56 example', () => {
  it('provides 56 mirrored keys and separate body, center and preview outlines', async () => {
    const example = exampleOptions
      .flatMap((group) => group.options)
      .find((item) => item.label === 'Briefs 56');
    expect(example).toBeDefined();
    const output = await ergogen.process(example!.value, {
      svg: true,
      debug: true,
    });
    const points = Object.values(output.points) as {
      x: number;
      y: number;
      r: number;
    }[];
    expect(points).toHaveLength(56);
    for (const point of points) {
      expect(
        points.some(
          (other) =>
            Math.abs(other.x + point.x) < 0.001 &&
            Math.abs(other.y - point.y) < 0.001 &&
            Math.abs(other.r + point.r) < 0.001
        )
      ).toBe(true);
    }
    // Matrix and first two thumbs share one orientation and default u spacing.
    const matrix = output.points.matrix_middle_bottom;
    for (const name of ['thumbs_outer_thumb', 'thumbs_middle_thumb']) {
      expect(output.points[name].r).toBe(matrix.r);
    }
    const bottom = output.points.matrix_outer_bottom;
    const home = output.points.matrix_outer_home;
    expect(Math.hypot(home.x - bottom.x, home.y - bottom.y)).toBeCloseTo(19);
    const outer = output.points.thumbs_outer_thumb;
    const middle = output.points.thumbs_middle_thumb;
    expect(Math.hypot(middle.x - outer.x, middle.y - outer.y)).toBeCloseTo(19);
    expect(output.points.thumbs_inner_thumb.r).toBe(-32);
    expect(output.points.thumbs_tip_thumb.r).toBe(-44);
    // Keep the rounded, relative layout close to the supplied drawing.
    const landmarks = [
      ['matrix_outer_number', 120, 115],
      ['matrix_pinky_number', 152, 123],
      ['matrix_ring_number', 187, 116],
      ['matrix_middle_number', 219, 118],
      ['matrix_index_number', 251, 134],
      ['matrix_inner_number', 283, 140],
      ['thumbs_outer_thumb', 197, 257],
      ['thumbs_middle_thumb', 229, 262],
      ['thumbs_inner_thumb', 263, 277],
      ['thumbs_tip_thumb', 293, 299],
    ] as const;
    for (const [name, x, y] of landmarks) {
      const point = output.points[name];
      expect(
        Math.hypot(
          point.x - ((x - 323) * 19) / 33,
          point.y - ((84 - y) * 19) / 33
        )
      ).toBeLessThan(3);
    }
    const body = svgOutlineGeometry(output.outlines.body.svg);
    expect(body.width).toBeCloseTo(15.6 * 19, 1);
    expect(body.height).toBeCloseTo(7.3 * 19, 1);
    expect(svgOutlineGeometry(output.outlines.keys.svg).regions).toBe(56);
    expect(svgOutlineGeometry(output.outlines.preview.svg).regions).toBe(58);
    const center = svgOutlineGeometry(output.outlines.center.svg);
    expect(center.regions).toBe(1);
    expect(center.width).toBeGreaterThan(48);
    expect(center.width).toBeLessThan(52);
    expect(center.height).toBeGreaterThan(89);
    expect(center.height).toBeLessThan(94);
    for (const name of ['keys', 'body', 'center', 'preview']) {
      expect(output.outlines[name].svg).toContain('<svg');
    }
  });
});
