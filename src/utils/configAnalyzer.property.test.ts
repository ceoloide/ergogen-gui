import fc from 'fast-check';
import yaml from 'js-yaml';
import { analyzeConfiguration } from './configAnalyzer';

// Property tests for config_id, the hash of the point layout that links the
// analytics events of one keyboard. analyzeConfiguration sorts the points by
// position before it hashes them, so the order and the names of the keys in
// points.yaml must not change the hash.

// 200 inputs per property keep the file well under one second of test time.
const runs = { numRuns: 200 };

// One zone with columns, whose keys hash as K, and one zone without columns
// or rows, whose points hash as A.
const canonical = `
points:
  zones:
    matrix:
      columns:
        pinky:
    thumb:
      anchor:
        shift: [0, 0]
`;

type Point = { x: number; y: number; r: number; zone: 'matrix' | 'thumb' };

// Coordinates from a few values, so that points often share an x, a y or an r.
const coordinate = fc.constantFrom(-1, 0, 2.5);
const point = (zone: fc.Arbitrary<Point['zone']>) =>
  fc.record({ x: coordinate, y: coordinate, r: coordinate, zone });

/** A list of points and a reordering of its indexes. */
const pointsAndPermutation = (zone: fc.Arbitrary<Point['zone']>) =>
  fc.array(point(zone), { minLength: 2, maxLength: 6 }).chain((points) =>
    fc.tuple(
      fc.constant(points),
      fc.shuffledSubarray(
        points.map((_, index) => index),
        { minLength: points.length }
      )
    )
  );

const configId = (namedPoints: [string, Point][]) =>
  analyzeConfiguration(
    canonical,
    yaml.dump(
      Object.fromEntries(
        namedPoints.map(([name, { x, y, r, zone }]) => [
          name,
          { x, y, r, meta: { zone: { name: zone } } },
        ])
      )
    ),
    0
  ).config_id;

describe('config_id properties', () => {
  it('does not depend on the order of the points in points.yaml', () => {
    fc.assert(
      fc.property(
        pointsAndPermutation(fc.constantFrom('matrix', 'thumb')),
        ([points, order]) => {
          const named = points.map((onePoint, index): [string, Point] => [
            `key_${index}`,
            onePoint,
          ]);

          const reordered = order.map((index) => named[index]);

          expect(configId(reordered)).toBe(configId(named));
        }
      ),
      runs
    );
  });

  it('does not depend on the names of the keys of one zone', () => {
    fc.assert(
      fc.property(
        pointsAndPermutation(fc.constant('matrix')),
        ([points, names]) => {
          const named = points.map((onePoint, index): [string, Point] => [
            `key_${index}`,
            onePoint,
          ]);

          const renamed = points.map((onePoint, index): [string, Point] => [
            `key_${names[index]}`,
            onePoint,
          ]);

          expect(configId(renamed)).toBe(configId(named));
        }
      ),
      runs
    );
  });
});
