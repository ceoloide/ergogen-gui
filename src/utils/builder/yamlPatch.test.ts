import { applyPatch } from './yamlPatch';

const expectText = (result: ReturnType<typeof applyPatch>) => {
  if (!result.ok) throw new Error(`Refused: ${result.reason}`);
  return result.text;
};

const expectRefusal = (result: ReturnType<typeof applyPatch>) => {
  if (result.ok) throw new Error(`Expected a refusal, got:\n${result.text}`);
  return result.reason;
};

describe('applyPatch', () => {
  const nested = `# My board
points:
  zones:
    matrix: # the main block
      columns:
        pinky:
        ring:
          key:
            stagger: 3 # a little
      rows:
        bottom:
        home:
outlines: {}
`;

  it('replaces an existing scalar and keeps every comment', () => {
    // Arrange
    const path = [
      'points',
      'zones',
      'matrix',
      'columns',
      'ring',
      'key',
      'stagger',
    ];

    // Act
    const text = expectText(
      applyPatch(nested, [{ type: 'set', path, value: 'cy/4' }])
    );

    // Assert
    expect(text).toBe(
      nested.replace('stagger: 3 # a little', 'stagger: cy/4 # a little')
    );
  });

  it('fills an empty value with nested block entries', () => {
    // Act
    const text = expectText(
      applyPatch(nested, [
        {
          type: 'set',
          path: [
            'points',
            'zones',
            'matrix',
            'columns',
            'pinky',
            'key',
            'splay',
          ],
          value: -5,
        },
      ])
    );

    // Assert
    expect(text).toContain(
      '        pinky:\n          key:\n            splay: -5\n        ring:'
    );
    expect(text).toContain('# the main block');
  });

  it('adds a missing key to an existing block mapping', () => {
    // Act
    const text = expectText(
      applyPatch(nested, [
        {
          type: 'set',
          path: [
            'points',
            'zones',
            'matrix',
            'columns',
            'ring',
            'key',
            'spread',
          ],
          value: 20,
        },
      ])
    );

    // Assert
    expect(text).toContain(
      '            stagger: 3 # a little\n            spread: 20\n      rows:'
    );
  });

  it('inserts a new key right after a named sibling', () => {
    // Act
    const text = expectText(
      applyPatch(nested, [
        {
          type: 'set',
          path: ['points', 'zones', 'matrix', 'columns', 'middle'],
          value: null,
          after: 'pinky',
        },
      ])
    );

    // Assert
    expect(text).toContain('        pinky:\n        middle:\n        ring:');
  });

  it('follows dotted keys instead of adding a conflicting nested key', () => {
    // Arrange
    const dotted = `points.zones.matrix.columns.pinky.key.stagger: 2 # dotted
points.zones.matrix.rows.bottom:
`;

    // Act
    const replaced = expectText(
      applyPatch(dotted, [
        {
          type: 'set',
          path: [
            'points',
            'zones',
            'matrix',
            'columns',
            'pinky',
            'key',
            'stagger',
          ],
          value: 4,
        },
      ])
    );
    const added = expectText(
      applyPatch(dotted, [
        {
          type: 'set',
          path: [
            'points',
            'zones',
            'matrix',
            'columns',
            'pinky',
            'key',
            'splay',
          ],
          value: 10,
        },
      ])
    );

    // Assert
    expect(replaced).toBe(dotted.replace('stagger: 2', 'stagger: 4'));
    expect(added).toContain(
      'points.zones.matrix.rows.bottom:\npoints.zones.matrix.columns.pinky.key.splay: 10\n'
    );
  });

  it('edits values inside flow mappings and JSON', () => {
    // Arrange
    const json = '{"points": {"zones": {"matrix": {"key": {"padding": 17}}}}}';

    // Act
    const replaced = expectText(
      applyPatch(json, [
        {
          type: 'set',
          path: ['points', 'zones', 'matrix', 'key', 'padding'],
          value: 18,
        },
      ])
    );
    const added = expectText(
      applyPatch(json, [
        {
          type: 'set',
          path: ['points', 'zones', 'matrix', 'key', 'width'],
          value: 'u-2',
        },
      ])
    );

    // Assert
    expect(replaced).toBe(json.replace('17', '18'));
    expect(added).toBe(
      json.replace('"padding": 17', '"padding": 17, width: u-2')
    );
  });

  it('replaces an explicit null and keeps CRLF line endings', () => {
    // Arrange
    const crlf = 'points:\r\n  zones:\r\n    matrix: null\r\n';

    // Act
    const text = expectText(
      applyPatch(crlf, [
        {
          type: 'set',
          path: ['points', 'zones', 'matrix', 'key', 'stagger'],
          value: 1.23456,
        },
      ])
    );

    // Assert
    expect(text).toBe(
      'points:\r\n  zones:\r\n    matrix:\r\n      key:\r\n        stagger: 1.2346\r\n'
    );
  });

  it('writes lists in flow style and quotes strings that need it', () => {
    // Act
    const text = expectText(
      applyPatch(nested, [
        {
          type: 'set',
          path: ['points', 'zones', 'matrix', 'anchor', 'shift'],
          value: [10, -5.5],
        },
        {
          type: 'set',
          path: ['points', 'zones', 'matrix', 'anchor', 'ref'],
          value: 'a: b',
        },
      ])
    );

    // Assert
    expect(text).toContain(
      '      anchor:\n        shift: [10, -5.5]\n        ref: "a: b"\n'
    );
  });

  it('removes a key with its comment and keeps its siblings', () => {
    // Act
    const text = expectText(
      applyPatch(nested, [
        {
          type: 'delete',
          path: ['points', 'zones', 'matrix', 'columns', 'ring'],
        },
      ])
    );

    // Assert
    expect(text).toBe(
      nested.replace(
        '        ring:\n          key:\n            stagger: 3 # a little\n',
        ''
      )
    );
  });

  it('refuses edits through aliases, merge keys and $extends', () => {
    // Arrange
    const aliased = `shared: &shared
  stagger: 3
points:
  zones:
    matrix:
      key: *shared
`;
    const merged = `points:
  zones:
    matrix:
      key:
        <<: {stagger: 1}
`;
    const extended = `points:
  zones:
    matrix:
      $extends: points.zones.other
`;
    const path = ['points', 'zones', 'matrix', 'key', 'stagger'];

    // Act and assert
    expect(
      expectRefusal(applyPatch(aliased, [{ type: 'set', path, value: 4 }]))
    ).toMatch(/alias/);
    expect(
      expectRefusal(applyPatch(merged, [{ type: 'set', path, value: 4 }]))
    ).toMatch(/merge key/);
    expect(
      expectRefusal(applyPatch(extended, [{ type: 'set', path, value: 4 }]))
    ).toMatch(/\$extends/);
  });

  it('refuses invalid YAML and paths written in two spellings', () => {
    // Arrange
    const twice = `points:
  zones.matrix.key.stagger: 1
  zones:
    matrix:
      key:
        spread: 2
`;
    const path = ['points', 'zones', 'matrix', 'key', 'stagger'];

    // Act and assert
    expect(
      expectRefusal(
        applyPatch('points: [\n', [{ type: 'set', path, value: 4 }])
      )
    ).toMatch(/error/i);
    expect(
      expectRefusal(applyPatch(twice, [{ type: 'set', path, value: 4 }]))
    ).toMatch(/more than one place/);
  });

  it('refuses a value that is not a mapping on the way', () => {
    // Arrange
    const scalar = 'points:\n  zones: 5\n';

    // Act
    const reason = expectRefusal(
      applyPatch(scalar, [
        { type: 'set', path: ['points', 'zones', 'matrix'], value: null },
      ])
    );

    // Assert
    expect(reason).toMatch(/not a mapping/);
  });

  it('applies nothing when a later operation is refused', () => {
    // Act
    const result = applyPatch(nested, [
      {
        type: 'set',
        path: [
          'points',
          'zones',
          'matrix',
          'columns',
          'ring',
          'key',
          'stagger',
        ],
        value: 9,
      },
      { type: 'set', path: ['outlines', 'x', 'y'], value: 1 },
    ]);

    // Assert
    expect(result.ok).toBe(false);
  });
});
