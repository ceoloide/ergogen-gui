import * as ergogen from 'ergogen';
import { beforeAll, describe, expect, it } from 'vitest';

// A small semantic fixture exercises the same prepared engine as the browser,
// including a vendor footprint that the unmodified dependency does not expose.
const twoKeys = {
  points: {
    zones: { matrix: { columns: { one: {}, two: {} }, rows: { row: {} } } },
  },
  outlines: { keys: [{ what: 'rectangle', where: true, size: [18, 18] }] },
  pcbs: {
    board: {
      template: 'kicad8',
      footprints: {
        keys: {
          what: 'ceoloide/switch_mx',
          where: true,
          params: { from: '{{colrow}}', to: 'GND' },
        },
      },
    },
  },
};
let output: {
  points: Record<string, { x: number; y: number }>;
  outlines: { keys: { svg: string } };
  pcbs: { board: string };
};

beforeAll(async () => {
  // Act: run the real engine, with no worker or engine mock.
  output = await ergogen.process(twoKeys, { svg: true, debug: true });
}, 20000);

describe('prepared engine semantic corpus', () => {
  it('preserves key count and pitch', () => {
    // Assert
    expect(Object.keys(output.points)).toEqual([
      'matrix_one_row',
      'matrix_two_row',
    ]);
    expect(
      output.points.matrix_two_row.x - output.points.matrix_one_row.x
    ).toBe(19);
    expect(output.points.matrix_one_row.y).toBe(output.points.matrix_two_row.y);
  });

  it('preserves outline dimensions without a volatile SVG snapshot', () => {
    // Assert
    expect(output.outlines.keys.svg).toContain('viewBox="0 0 37 18"');
  });

  it('compiles the pinned vendor footprint into a KiCad 8 PCB', () => {
    // Assert
    expect(output.pcbs.board).toContain('(version 20240108)');
    expect(output.pcbs.board.match(/\(footprint /g)).toHaveLength(2);
    expect(output.pcbs.board).toContain('GND');
  });

  it('rejects an unknown footprint rather than emitting a partial PCB', async () => {
    // Arrange
    const invalid = structuredClone(twoKeys);
    invalid.pcbs.board.footprints.keys.what = 'missing/footprint';
    // Act / Assert
    await expect(ergogen.process(invalid, { svg: true })).rejects.toThrow();
  });
});
