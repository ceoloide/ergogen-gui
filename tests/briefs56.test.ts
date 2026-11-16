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
    // Reference drawing landmarks, normalized by its 33 px key pitch.
    const landmarks = [
      ['outer_key_number', 120, 115, -13],
      ['pinky_key_number', 152, 123, -13],
      ['ring_key_number', 187, 116, -13],
      ['middle_key_number', 219, 118, -13],
      ['index_key_number', 251, 134, -13],
      ['inner_key_number', 283, 140, -13],
      ['thumb_outer_key_thumb', 197, 257, -10],
      ['thumb_middle_key_thumb', 229, 262, -10],
      ['thumb_inner_key_thumb', 263, 277, -32],
      ['thumb_tip_key_thumb', 293, 299, -44],
    ] as const;
    for (const [name, x, y, rotation] of landmarks) {
      expect(output.points[name].x).toBeCloseTo(((x - 323) * 19.05) / 33, 3);
      expect(output.points[name].y).toBeCloseTo(((84 - y) * 19.05) / 33, 3);
      expect(output.points[name].r).toBe(rotation);
    }
    const body = svgOutlineGeometry(output.outlines.body.svg);
    expect(body.width).toBeCloseTo((514 * 19.05) / 33, 1);
    expect(body.height).toBeCloseTo((241 * 19.05) / 33, 1);
    // Merged cap outlines must not silently hide an overlap.
    expect(svgOutlineGeometry(output.outlines.keys.svg).regions).toBe(56);
    expect(svgOutlineGeometry(output.outlines.preview.svg).regions).toBe(58);
    const center = svgOutlineGeometry(output.outlines.center.svg);
    expect(center.regions).toBe(1);
    expect(center.width).toBeCloseTo(50.366, 2);
    expect(center.height).toBeCloseTo(91.978, 2);
    for (const name of ['keys', 'body', 'center', 'preview']) {
      expect(output.outlines[name].svg).toContain('<svg');
    }
  });
});
