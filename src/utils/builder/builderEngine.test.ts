/**
 * Builder edits checked against the real Ergogen engine: the patched text is
 * laid out again and the key positions must move exactly as Ergogen defines.
 */
import * as ergogen from 'ergogen';
import { computeLayout, Layout, LayoutKey } from './pointsPreview';
import { applyPatch, PatchOperation } from './yamlPatch';
import { BUILDER_STARTER_CONFIG } from './starterConfig';
import {
  columnFrame,
  columnKeys,
  isOverridden,
  keysInScope,
  provenance,
  scopeAvailability,
  scopePath,
  zoneAnchor,
} from './layoutModel';
import {
  addColumn,
  addRow,
  addThumbCluster,
  addZone,
  deleteColumn,
  deleteRow,
  deleteZone,
  enableMirror,
  disableMirror,
  mirrorState,
  StructureEdit,
} from './structureOps';

const key = (layout: Layout, name: string): LayoutKey => {
  const found = layout.keys.find((candidate) => candidate.name === name);
  if (!found) throw new Error(`No key ${name}`);
  return found;
};

const patch = (text: string, operations: PatchOperation[]) => {
  const result = applyPatch(text, operations);
  if (!result.ok) throw new Error(result.reason);
  return result.text;
};

const applyEdit = (text: string, edit: StructureEdit) => {
  if (!edit.ok) throw new Error(edit.reason);
  return patch(text, edit.operations);
};

describe('computeLayout', () => {
  it('matches the points of a full Ergogen run', async () => {
    // Arrange
    const full = await ergogen.process(BUILDER_STARTER_CONFIG, { debug: true });

    // Act
    const layout = computeLayout(BUILDER_STARTER_CONFIG);

    // Assert
    const fullPoints = full.points as Record<
      string,
      { x: number; y: number; r: number }
    >;
    expect(layout.keys.map((k) => k.name).sort()).toEqual(
      Object.keys(fullPoints).sort()
    );
    for (const k of layout.keys) {
      expect(k.x).toBeCloseTo(fullPoints[k.name].x, 6);
      expect(k.y).toBeCloseTo(fullPoints[k.name].y, 6);
      expect(k.r).toBeCloseTo(fullPoints[k.name].r, 6);
    }
    expect(layout.zones).toEqual([
      {
        name: 'matrix',
        columns: ['pinky', 'ring', 'middle', 'index', 'inner'],
        rows: ['bottom', 'home', 'top'],
      },
    ]);
  });

  it('shows skipped keys as hints without changing the real layout', () => {
    // Arrange
    const text = patch(BUILDER_STARTER_CONFIG, [
      {
        type: 'set',
        path: [
          'points',
          'zones',
          'matrix',
          'columns',
          'inner',
          'rows',
          'top',
          'skip',
        ],
        value: true,
      },
    ]);

    // Act
    const layout = computeLayout(text);

    // Assert
    const hint = key(layout, 'matrix_inner_top');
    expect(hint.skipped).toBe(true);
    expect(layout.keys.filter((k) => !k.skipped)).toHaveLength(14);
    expect(hint.y).toBeCloseTo(key(layout, 'matrix_inner_home').y + 19, 6);
  });

  it('keeps every key when all of them are skipped, in engine order', () => {
    // Arrange
    const allSkipped = patch(BUILDER_STARTER_CONFIG, [
      { type: 'set', path: ['points', 'key', 'skip'], value: true },
    ]);
    const bottomSkipped = patch(BUILDER_STARTER_CONFIG, [
      {
        type: 'set',
        path: ['points', 'zones', 'matrix', 'rows', 'bottom', 'skip'],
        value: true,
      },
    ]);

    // Act
    const all = computeLayout(allSkipped);
    const bottom = computeLayout(bottomSkipped);

    // Assert
    expect(all.keys).toHaveLength(15);
    expect(all.keys.every((k) => k.skipped)).toBe(true);
    expect(all.zones[0].columns).toHaveLength(5);
    expect(
      columnKeys(bottom, 'matrix', 'ring').map((k) => [k.row, k.skipped])
    ).toEqual([
      ['bottom', true],
      ['home', false],
      ['top', false],
    ]);
    expect(bottom.keys.map((k) => k.name)).toEqual(
      computeLayout(BUILDER_STARTER_CONFIG).keys.map((k) => k.name)
    );
  });

  it('reports an empty configuration clearly', () => {
    expect(() => computeLayout('')).toThrow('The configuration is empty.');
    expect(() => computeLayout('  \n')).toThrow('The configuration is empty.');
  });

  it('throws the engine error for an invalid configuration', () => {
    expect(() =>
      computeLayout(
        'points:\n  zones:\n    matrix:\n      key:\n        stagger: nope\n'
      )
    ).toThrow();
  });
});

describe('parameter edits', () => {
  const layout = computeLayout(BUILDER_STARTER_CONFIG);
  const ringHome = key(layout, 'matrix_ring_home');

  it('changes a column stagger and moves that column and later ones', () => {
    // Arrange
    const path = scopePath('column', ringHome, 'stagger');

    // Act
    const next = computeLayout(
      patch(BUILDER_STARTER_CONFIG, [{ type: 'set', path, value: 10 }])
    );

    // Assert
    expect(key(next, 'matrix_pinky_home').y).toBeCloseTo(
      key(layout, 'matrix_pinky_home').y,
      6
    );
    expect(key(next, 'matrix_ring_home').y).toBeCloseTo(ringHome.y + 4, 6);
    expect(key(next, 'matrix_inner_home').y).toBeCloseTo(
      key(layout, 'matrix_inner_home').y + 4,
      6
    );
  });

  it('records provenance and keeps expressions as written', () => {
    // Arrange
    const text = patch(BUILDER_STARTER_CONFIG, [
      {
        type: 'set',
        path: scopePath('zone', ringHome, 'padding'),
        value: 'u+1',
      },
    ]);

    // Act
    const next = computeLayout(text);

    // Assert
    const home = key(next, 'matrix_ring_home');
    expect(provenance(next, home, 'padding')).toEqual({
      scope: 'zone',
      raw: 'u+1',
    });
    expect(provenance(next, home, 'stagger')).toEqual({
      scope: 'column',
      raw: 6,
    });
    expect(provenance(next, home, 'splay')).toEqual({
      scope: 'default',
      raw: undefined,
    });
    expect(home.params.padding).toBe(20);
    expect(isOverridden(next, home, 'stagger', 'zone')).toBe(true);
    expect(text).toContain('padding: u+1');
  });

  it('limits column parameters to column scopes and highlights the scope', () => {
    // Act
    const availability = scopeAvailability(layout, ringHome, 'splay');
    const rowKeys = keysInScope(layout, ringHome, 'row');

    // Assert
    expect(availability.column).toBeNull();
    expect(availability.key).toMatch(/first key/);
    expect(scopeAvailability(layout, ringHome, 'width').row).toBeNull();
    expect(rowKeys.size).toBe(5);
  });
});

describe('column handle geometry', () => {
  const displacement = (
    before: Layout,
    after: Layout,
    name: string
  ): [number, number] => [
    key(after, name).x - key(before, name).x,
    key(after, name).y - key(before, name).y,
  ];

  const direction = (angle: number, [x, y]: [number, number]) => {
    const radians = (angle * Math.PI) / 180;
    return [
      x * Math.cos(radians) - y * Math.sin(radians),
      x * Math.sin(radians) + y * Math.cos(radians),
    ];
  };

  it('moves a splayed column along the axis the engine uses', () => {
    // Arrange: its own splay does not turn the column's stagger
    const text = (stagger: number) => `points:
  zones:
    solo:
      columns:
        only:
          key:
            splay: 90
            stagger: ${stagger}
            rotate: 15
      rows:
        bottom:
        top:
`;
    const before = computeLayout(text(0));

    // Act
    const after = computeLayout(text(10));
    const frame = columnFrame(before, 'solo', 'only');

    // Assert
    if (!frame.ok) throw new Error(frame.reason);
    const [dx, dy] = displacement(before, after, 'solo_only_bottom');
    const [ax, ay] = direction(frame.axisAngle, [0, 10]);
    expect(dx).toBeCloseTo(ax, 6);
    expect(dy).toBeCloseTo(ay, 6);
    expect(dx).toBeCloseTo(0, 6);
    expect(dy).toBeCloseTo(10, 6);
  });

  it('uses earlier splays for spread and pivots splay at the engine origin', () => {
    // Arrange
    const text = (spread: number, splay: number) => `points:
  zones:
    matrix:
      anchor:
        rotate: 10
      columns:
        a:
          key:
            splay: 20
        b:
          key:
            spread: ${spread}
            splay: ${splay}
            origin: [-9.5, -9.5]
            rotate: 5
`;
    const before = computeLayout(text(19, 0));

    // Act
    const spread = computeLayout(text(29, 0));
    const splayed = computeLayout(text(19, 30));
    const frame = columnFrame(before, 'matrix', 'b');

    // Assert
    if (!frame.ok) throw new Error(frame.reason);
    expect(frame.axisAngle).toBeCloseTo(30, 6);
    const [dx, dy] = displacement(before, spread, 'matrix_b');
    const [ax, ay] = direction(frame.axisAngle, [10, 0]);
    expect(dx).toBeCloseTo(ax, 6);
    expect(dy).toBeCloseTo(ay, 6);
    const [px, py] = frame.pivot;
    const from = key(before, 'matrix_b');
    const to = key(splayed, 'matrix_b');
    expect(Math.hypot(to.x - px, to.y - py)).toBeCloseTo(
      Math.hypot(from.x - px, from.y - py),
      6
    );
    const turned =
      Math.atan2(to.y - py, to.x - px) - Math.atan2(from.y - py, from.x - px);
    expect((turned * 180) / Math.PI).toBeCloseTo(30, 6);
  });

  it('refuses to drag a column whose first key has an adjust', () => {
    // Arrange
    const layout = computeLayout(`points:
  zones:
    matrix:
      columns:
        a:
          key:
            adjust:
              shift: [1, 2]
`);

    // Act
    const frame = columnFrame(layout, 'matrix', 'a');

    // Assert
    expect(frame.ok).toBe(false);
  });
});

describe('scope availability with column-local rows', () => {
  it('only offers the row scope when the row is zone-wide', () => {
    // Arrange: no zone rows, but one column defines its own
    const layout = computeLayout(`points:
  zones:
    matrix:
      columns:
        a:
        b:
          rows:
            extra:
`);
    const plain = key(layout, 'matrix_a');

    // Act
    const availability = scopeAvailability(layout, plain, 'width');

    // Assert
    expect(availability.row).toMatch(/column/);
    expect(availability.key).toBeNull();
  });
});

describe('zone anchors and mirrors the builder cannot edit', () => {
  it('explains structured anchors instead of showing them as text', () => {
    // Arrange
    const layout = computeLayout(`points:
  zones:
    matrix:
    other:
      anchor:
        ref: matrix
        rotate:
          ref: matrix
`);

    // Act
    const { reason } = zoneAnchor(layout, 'other');

    // Assert
    expect(reason).toMatch(/YAML/);
  });

  it('treats zone mirrors, shifted and structured mirror references as custom', () => {
    // Arrange
    const zoneMirror = computeLayout(`points:
  zones:
    matrix:
      mirror:
        ref: matrix
        distance: 20
`);
    const aggregate = computeLayout(`points:
  zones:
    matrix:
  mirror:
    ref:
      - matrix
    distance: 20
`);

    const shifted = computeLayout(
      BUILDER_STARTER_CONFIG.replace(
        'outlines:',
        '  mirror:\n    ref: matrix_inner_top\n    distance: 20\n    shift: [0, 5]\noutlines:'
      )
    );

    // Act and assert
    expect(mirrorState(zoneMirror).kind).toBe('custom');
    expect(mirrorState(aggregate).kind).toBe('custom');
    expect(mirrorState(shifted).kind).toBe('custom');
  });
});

describe('structure edits', () => {
  const layout = computeLayout(BUILDER_STARTER_CONFIG);

  it('adds a column after the selected one and deletes it again', () => {
    // Act
    const added = applyEdit(
      BUILDER_STARTER_CONFIG,
      addColumn(layout, 'matrix', 'ring')
    );
    const addedLayout = computeLayout(added);
    const removed = applyEdit(
      added,
      deleteColumn(addedLayout, 'matrix', 'col1')
    );

    // Assert
    expect(addedLayout.zones[0].columns).toEqual([
      'pinky',
      'ring',
      'col1',
      'middle',
      'index',
      'inner',
    ]);
    expect(addedLayout.keys).toHaveLength(18);
    expect(removed).toBe(BUILDER_STARTER_CONFIG);
  });

  it('adds and removes a row', () => {
    // Act
    const added = applyEdit(BUILDER_STARTER_CONFIG, addRow(layout, 'matrix'));
    const addedLayout = computeLayout(added);
    const removed = applyEdit(added, deleteRow(addedLayout, 'matrix', 'row1'));

    // Assert
    expect(addedLayout.zones[0].rows).toEqual([
      'bottom',
      'home',
      'top',
      'row1',
    ]);
    expect(removed).toBe(BUILDER_STARTER_CONFIG);
  });

  it('adds a column and a row after siblings written as dotted keys', () => {
    // Arrange: dotted siblings, as in several bundled examples
    const dotted = BUILDER_STARTER_CONFIG.replace(
      '        ring:\n          key:\n            stagger: 6\n',
      '        ring.key.stagger: 6\n'
    ).replace('        top:\n', '        top.padding: 18\n');
    const dottedLayout = computeLayout(dotted);

    // Act
    const withColumn = applyEdit(
      dotted,
      addColumn(dottedLayout, 'matrix', 'ring')
    );
    const withRow = applyEdit(dotted, addRow(dottedLayout, 'matrix'));

    // Assert: the engine sees them right after their siblings
    expect(computeLayout(withColumn).zones[0].columns).toEqual([
      'pinky',
      'ring',
      'col1',
      'middle',
      'index',
      'inner',
    ]);
    expect(computeLayout(withRow).zones[0].rows).toEqual([
      'bottom',
      'home',
      'top',
      'row1',
    ]);
  });

  it('adds a thumb cluster anchored to the last column and a free zone', () => {
    // Act
    const withThumb = applyEdit(
      BUILDER_STARTER_CONFIG,
      addThumbCluster(layout, 'matrix')
    );
    const thumbLayout = computeLayout(withThumb);
    const withZone = applyEdit(withThumb, addZone(thumbLayout));
    const zoneLayout = computeLayout(withZone);

    // Assert
    const anchor = key(layout, 'matrix_inner_bottom');
    expect(key(thumbLayout, 'thumb_near_cluster').x).toBeCloseTo(
      anchor.x - 19,
      6
    );
    expect(key(thumbLayout, 'thumb_near_cluster').y).toBeCloseTo(
      anchor.y - 24,
      6
    );
    expect(key(thumbLayout, 'thumb_far_cluster').r).toBeCloseTo(-30, 6);
    expect(zoneLayout.zones.map((zone) => zone.name)).toEqual([
      'matrix',
      'thumb',
      'zone1',
    ]);
    expect(applyEdit(withZone, deleteZone(zoneLayout, 'zone1'))).toBe(
      withThumb
    );
  });

  it('mirrors the board and turns mirroring off again', () => {
    // Act
    const mirrored = applyEdit(BUILDER_STARTER_CONFIG, enableMirror(layout));
    const mirroredLayout = computeLayout(mirrored);
    const restored = applyEdit(mirrored, disableMirror(mirroredLayout));

    // Assert
    const inner = key(mirroredLayout, 'matrix_inner_bottom');
    const copy = key(mirroredLayout, 'mirror_matrix_inner_bottom');
    expect(copy.mirrored).toBe(true);
    expect(copy.source).toBe('matrix_inner_bottom');
    expect(copy.x - inner.x).toBeCloseTo(40, 6);
    expect(mirrorState(mirroredLayout)).toEqual({
      kind: 'reference',
      ref: 'matrix_inner_bottom',
      distance: 40,
    });
    expect(restored).toBe(BUILDER_STARTER_CONFIG);
  });

  it('removes a row from every column that overrides it', () => {
    // Arrange
    const text = patch(BUILDER_STARTER_CONFIG, [
      {
        type: 'set',
        path: [
          'points',
          'zones',
          'matrix',
          'columns',
          'ring',
          'rows',
          'top',
          'width',
        ],
        value: 20,
      },
    ]);
    const before = computeLayout(text);

    // Act
    const removed = computeLayout(
      applyEdit(text, deleteRow(before, 'matrix', 'top'))
    );

    // Assert
    expect(removed.keys.filter((k) => k.row === 'top')).toHaveLength(0);
    expect(removed.keys).toHaveLength(10);
  });

  it('refuses to remove keys that other parts of the layout refer to', () => {
    // Arrange
    const withThumb = applyEdit(
      BUILDER_STARTER_CONFIG,
      addThumbCluster(layout, 'matrix')
    );
    const thumbLayout = computeLayout(withThumb);
    const mirrored = applyEdit(withThumb, enableMirror(thumbLayout));
    const mirroredLayout = computeLayout(mirrored);

    // Act
    const column = deleteColumn(thumbLayout, 'matrix', 'inner');
    const row = deleteRow(thumbLayout, 'matrix', 'bottom');
    const zone = deleteZone(thumbLayout, 'matrix');
    const mirrorColumn = deleteColumn(mirroredLayout, 'thumb', 'far');

    // Assert
    for (const edit of [column, row, zone]) {
      expect(edit.ok).toBe(false);
      if (!edit.ok) {
        expect(edit.reason).toContain('matrix_inner_bottom');
        expect(edit.reason).toContain('points.zones.thumb.anchor.ref');
      }
    }
    expect(mirrorColumn.ok).toBe(false);
    if (!mirrorColumn.ok) {
      expect(mirrorColumn.reason).toContain('points.mirror.ref');
    }
    expect(deleteColumn(thumbLayout, 'matrix', 'pinky').ok).toBe(true);
  });

  it('refuses structure edits that the config cannot express safely', () => {
    // Arrange
    const single = computeLayout('points:\n  zones:\n    solo:\n');

    // Act and assert
    expect(addColumn(single, 'solo', 'default').ok).toBe(false);
    expect(addRow(single, 'solo').ok).toBe(false);
    expect(deleteZone(single, 'solo').ok).toBe(false);
    expect(deleteColumn(layout, 'matrix', 'nope').ok).toBe(false);
  });
});
