import yaml from 'js-yaml';
import { unnest as engineUnnest } from 'ergogen/src/prepare';
import { unnest } from './unnest';

describe('unnest', () => {
  it('expands dotted keys exactly like the engine', () => {
    // Arrange
    const config = yaml.load(`
points.zones.matrix.columns.pinky.key.stagger: 2
points:
  zones.matrix.rows:
    bottom:
    home.padding: 17
  key: {splay: 3, list: [{a.b: 1}, 2, null]}
later.wins: 1
later: {other: 2}
`);

    // Act and assert
    expect(unnest(config)).toEqual(engineUnnest(config));
    expect(JSON.stringify(unnest(config))).toBe(
      JSON.stringify(engineUnnest(config))
    );
  });
});
