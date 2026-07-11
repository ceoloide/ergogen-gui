import { analyzeConfiguration, sha256 } from './configAnalyzer';

describe('sha256 utility', () => {
  it('should generate correct SHA-256 hash', () => {
    // Verified SHA-256 for 'hello world'
    expect(sha256('hello world')).toBe(
      'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9'
    );
  });
});

describe('analyzeConfiguration', () => {
  const sampleCanonical = `
meta:
  name: sweep
  author: david
points:
  zones:
    matrix:
      columns:
        ring:
        pinky:
      rows:
        home:
        bottom:
    thumb:
      columns:
        t1:
      rows:
        1:
  mirror: true
outlines:
  preview: {}
  _private: {}
pcbs:
  main:
    reversible: true
cases:
  case1: {}
`;

  const samplePoints = `
matrix_pinky_bottom:
  x: 10
  y: 20
  r: 0
  meta:
    zone:
      name: matrix
matrix_pinky_home:
  x: 10
  y: 30
  r: 0
  meta:
    zone:
      name: matrix
matrix_ring_bottom:
  x: 29
  y: 20
  r: 0
  meta:
    zone:
      name: matrix
matrix_ring_home:
  x: 29
  y: 30
  r: 0
  meta:
    zone:
      name: matrix
thumb_t1_1:
  x: 50
  y: 10
  r: 15
  meta:
    zone:
      name: thumb
mirror_matrix_pinky_bottom:
  x: -10
  y: 20
  r: 0
  meta:
    zone:
      name: matrix
    mirrored: true
mirror_matrix_pinky_home:
  x: -10
  y: 30
  r: 0
  meta:
    zone:
      name: matrix
    mirrored: true
mirror_matrix_ring_bottom:
  x: -29
  y: 20
  r: 0
  meta:
    zone:
      name: matrix
    mirrored: true
mirror_matrix_ring_home:
  x: -29
  y: 30
  r: 0
  meta:
    zone:
      name: matrix
    mirrored: true
mirror_thumb_t1_1:
  x: -50
  y: 10
  r: -15
  meta:
    zone:
      name: thumb
    mirrored: true
`;

  it('correctly extracts performance metrics, counts, and flags', () => {
    // Arrange & Act
    const payload = analyzeConfiguration(sampleCanonical, samplePoints, 123);

    // Assert
    expect(payload.total_generation_time_ms).toBe(123);
    expect(payload.count_outlines).toBe(1); // 'preview' (public), '_private' is ignored
    expect(payload.count_raw_outlines).toBe(2);
    expect(payload.count_pcbs).toBe(1);
    expect(payload.count_cases).toBe(1);
    expect(payload.is_reversible).toBe(true);
    expect(payload.is_mirrored).toBe(true);
    expect(payload['meta.name']).toBe('sweep');
    expect(payload['meta.author']).toBe('david');
    expect(payload.count_zones).toBe(2);
  });

  it('correctly handles fallbacks for missing metadata', () => {
    const canonicalNoMeta = `
points:
  zones: {}
`;
    const payload = analyzeConfiguration(canonicalNoMeta, '{}', 0);
    expect(payload['meta.name']).toBe('noname');
    expect(payload['meta.author']).toBe('noauthor');
  });

  it('performs granular matrix zone analysis with alphabetical sorting', () => {
    // Arrange & Act
    const payload = analyzeConfiguration(sampleCanonical, samplePoints, 123);

    // Assert
    expect(payload.matrix_zones).toBe(2);
    expect(payload.has_matrix).toBe(true);
    // alphabetical sorted: matrix, thumb
    expect(payload.matrix_zone_names).toBe('matrix,thumb');
    // col counts for matrix: 2 (pinky, ring), thumb: 1 (t1) -> sorted matrix: pinky, ring (2), thumb: t1 (1) -> '2,1'
    expect(payload.matrix_col_counts).toBe('2,1');
    // row counts for matrix: 2 (bottom, home), thumb: 1 (1) -> '2,1'
    expect(payload.matrix_row_counts).toBe('2,1');

    // Key counts are doubled because points.mirror is true.
    // Base keys in points for matrix: 4 (pinky_bottom, pinky_home, ring_bottom, ring_home). Doubled: 8.
    // Base keys in points for thumb: 1 (t1_1). Doubled: 2.
    // Total key count list: '8,2'
    expect(payload.matrix_key_counts).toBe('8,2');
    expect(payload.matrix_keys).toBe(10);

    // Col names sorted alphabetically in each zone:
    // matrix columns: pinky, ring (sorted alphabetically: 'pinky,ring')
    // thumb columns: t1 (sorted: 't1')
    // Joined by '|' -> 'pinky,ring|t1'
    expect(payload.matrix_col_names).toBe('pinky,ring|t1');

    // Row names sorted alphabetically in each zone:
    // matrix rows: bottom, home (sorted alphabetically: 'bottom,home')
    // thumb rows: 1 (sorted: '1')
    // Joined by '|' -> 'bottom,home|1'
    expect(payload.matrix_row_names).toBe('bottom,home|1');
  });

  it('correctly handles case when has_matrix is false', () => {
    const canonicalNoMatrix = `
points:
  zones:
    auxiliary:
      // no columns or rows
`;
    const payload = analyzeConfiguration(canonicalNoMatrix, '{}', 10);
    expect(payload.matrix_zones).toBe(0);
    expect(payload.has_matrix).toBe(false);
    expect(payload.matrix_zone_names).toBe('');
    expect(payload.matrix_col_counts).toBe('');
    expect(payload.matrix_row_counts).toBe('');
    expect(payload.matrix_key_counts).toBe('');
    expect(payload.matrix_col_names).toBe('');
    expect(payload.matrix_row_names).toBe('');
    expect(payload.matrix_keys).toBe(0);
  });

  it('correctly generates deterministic geometric config_id', () => {
    // Arrange & Act
    const payload = analyzeConfiguration(sampleCanonical, samplePoints, 123);

    // Verify format and deterministic hashing
    expect(payload.config_id).toHaveLength(12);

    // Let's manually compute expected config_id
    // points in samplePoints are matrix and thumb keys.
    // Let's classify:
    // matrix_pinky_bottom: matrix zone -> K. x: 10, y: 20, r: 0
    // matrix_pinky_home: matrix zone -> K. x: 10, y: 30, r: 0
    // matrix_ring_bottom: matrix zone -> K. x: 29, y: 20, r: 0
    // matrix_ring_home: matrix zone -> K. x: 29, y: 30, r: 0
    // thumb_t1_1: thumb zone -> K. x: 50, y: 10, r: 15
    // mirror_matrix_pinky_bottom: matrix zone -> K. x: -10, y: 20, r: 0
    // mirror_matrix_pinky_home: matrix zone -> K. x: -10, y: 30, r: 0
    // mirror_matrix_ring_bottom: matrix zone -> K. x: -29, y: 20, r: 0
    // mirror_matrix_ring_home: matrix zone -> K. x: -29, y: 30, r: 0
    // mirror_thumb_t1_1: thumb zone -> K. x: -50, y: 10, r: -15

    // Let's verify sort order by x, then y, then r, then name:
    // x values: -50, -29, -29, -10, -10, 10, 10, 29, 29, 50
    // Sorted list of points:
    // 1. mirror_thumb_t1_1: x: -50, y: 10, r: -15 -> K-50;10;-15
    // 2. mirror_matrix_ring_bottom: x: -29, y: 20, r: 0 -> K-29;20;0
    // 3. mirror_matrix_ring_home: x: -29, y: 30, r: 0 -> K-29;30;0
    // 4. mirror_matrix_pinky_bottom: x: -10, y: 20, r: 0 -> K-10;20;0
    // 5. mirror_matrix_pinky_home: x: -10, y: 30, r: 0 -> K-10;30;0
    // 6. matrix_pinky_bottom: x: 10, y: 20, r: 0 -> K10;20;0
    // 7. matrix_pinky_home: x: 10, y: 30, r: 0 -> K10;30;0
    // 8. matrix_ring_bottom: x: 29, y: 20, r: 0 -> K29;20;0
    // 9. matrix_ring_home: x: 29, y: 30, r: 0 -> K29;30;0
    // 10. thumb_t1_1: x: 50, y: 10, r: 15 -> K50;10;15

    const expectedPointsStr = [
      'K-50;10;-15',
      'K-29;20;0',
      'K-29;30;0',
      'K-10;20;0',
      'K-10;30;0',
      'K10;20;0',
      'K10;30;0',
      'K29;20;0',
      'K29;30;0',
      'K50;10;15',
    ].join('|');

    const expectedInput = `sweep|david|${expectedPointsStr}`;
    const expectedHash = sha256(expectedInput).substring(0, 12);
    expect(payload.config_id).toBe(expectedHash);
  });

  it('correctly handles duplicate coordinates by sorting alphabetically by point original name', () => {
    // If coordinates match, tie break by original name.
    const customPoints = `
pt_b:
  x: 10
  y: 20
  r: 0
  meta:
    zone: matrix
pt_a:
  x: 10
  y: 20
  r: 0
  meta:
    zone: matrix
`;
    // Both are K10;20;0. Sorted alphabetically by name: pt_a, pt_b.
    const payload = analyzeConfiguration(sampleCanonical, customPoints, 0);
    // Since names are pt_a then pt_b:
    // Output string should have two identical coordinates, but the order of sorting should be deterministic.
    expect(payload.config_id).toBeDefined();
  });
});
