/**
 * Builder edits checked against the real Ergogen engine: the patched text is
 * laid out again and the key positions must move exactly as Ergogen defines.
 */
import * as ergogen from 'ergogen';
import { computeLayout, Layout, LayoutKey } from './pointsPreview';
import { applyPatch, PatchOperation } from './yamlPatch';
import { BUILDER_STARTER_CONFIG } from './starterConfig';
import {
  isOverridden,
  keysInScope,
  provenance,
  scopeAvailability,
  scopePath,
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
    const restored = applyEdit(mirrored, disableMirror());

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
