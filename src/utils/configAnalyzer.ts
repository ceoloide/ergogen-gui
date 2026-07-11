/* eslint-disable @typescript-eslint/no-explicit-any */
import yaml from 'js-yaml';

export interface KeyboardAnalyticsPayload {
  total_generation_time_ms: number;
  count_outlines: number;
  count_raw_outlines: number;
  count_pcbs: number;
  count_cases: number;
  is_reversible: boolean;
  is_mirrored: boolean;
  'meta.name': string;
  'meta.author': string;
  count_zones: number;
  matrix_zones: number;
  has_matrix: boolean;
  matrix_zone_names: string;
  matrix_col_counts: string;
  matrix_row_counts: string;
  matrix_key_counts: string;
  matrix_col_names: string;
  matrix_row_names: string;
  matrix_keys: number;
  config_id: string;
}

/**
 * Pure JavaScript synchronous implementation of SHA-256.
 */
export function sha256(ascii: string): string {
  function rightRotate(value: number, amount: number): number {
    return (value >>> amount) | (value << (32 - amount));
  }

  const words: number[] = [];

  const hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
    0x1f83d9ab, 0x5be0cd19,
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
    0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
    0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
    0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
    0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  const utf8 = unescape(encodeURIComponent(ascii));
  for (let idx = 0; idx < utf8.length; idx++) {
    const charCode = utf8.charCodeAt(idx);
    words[idx >> 2] |= charCode << (24 - (idx % 4) * 8);
  }

  const byteLength = utf8.length;
  words[byteLength >> 2] |= 0x80 << (24 - (byteLength % 4) * 8);

  const blocksCount = ((byteLength + 8) >> 6) + 1;
  words[blocksCount * 16 - 1] = byteLength * 8;

  for (let blockIndex = 0; blockIndex < blocksCount; blockIndex++) {
    const w: number[] = [];
    for (let i = 0; i < 16; i++) {
      w[i] = words[blockIndex * 16 + i] || 0;
    }
    for (let i = 16; i < 64; i++) {
      const s0 =
        rightRotate(w[i - 15], 7) ^
        rightRotate(w[i - 15], 18) ^
        (w[i - 15] >>> 3);
      const s1 =
        rightRotate(w[i - 2], 17) ^
        rightRotate(w[i - 2], 19) ^
        (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }

    let a = hash[0];
    let b = hash[1];
    let c = hash[2];
    let d = hash[3];
    let e = hash[4];
    let f = hash[5];
    let g = hash[6];
    let h = hash[7];

    for (let i = 0; i < 64; i++) {
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + k[i] + w[i]) | 0;
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    hash[0] = (hash[0] + a) | 0;
    hash[1] = (hash[1] + b) | 0;
    hash[2] = (hash[2] + c) | 0;
    hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0;
    hash[5] = (hash[5] + f) | 0;
    hash[6] = (hash[6] + g) | 0;
    hash[7] = (hash[7] + h) | 0;
  }

  let hex = '';
  for (let i = 0; i < 8; i++) {
    const word = hash[i];
    hex += ((word >>> 24) & 0xff).toString(16).padStart(2, '0');
    hex += ((word >>> 16) & 0xff).toString(16).padStart(2, '0');
    hex += ((word >>> 8) & 0xff).toString(16).padStart(2, '0');
    hex += (word & 0xff).toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Helper to recursively search an object for specific boolean flags.
 */
function searchRecursive(obj: any, keys: string[]): boolean {
  if (!obj || typeof obj !== 'object') return false;
  for (const k of keys) {
    if (obj[k] === true) return true;
  }
  for (const key of Object.keys(obj)) {
    if (searchRecursive(obj[key], keys)) return true;
  }
  return false;
}

/**
 * Rounds a number to exactly 2 decimal places.
 */
const round2 = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

/**
 * Extracts point's zone name from its metadata.
 */
const getPointZone = (pt: any): string | undefined => {
  if (!pt || !pt.meta) return undefined;
  if (typeof pt.meta.zone === 'object' && pt.meta.zone !== null) {
    return pt.meta.zone.name;
  }
  return pt.meta.zone;
};

/**
 * Analyzes the keyboard configuration using the generated canonical.yaml and points.yaml text contents.
 */
export function analyzeConfiguration(
  canonicalYaml: string,
  pointsYaml: string,
  totalGenerationTimeMs: number
): KeyboardAnalyticsPayload {
  const canonicalObj = (yaml.load(canonicalYaml) || {}) as any;
  const pointsObj = (yaml.load(pointsYaml) || {}) as any;

  // 1. Outline counts
  const outlinesObj = canonicalObj.outlines || {};
  const outlineKeys = Object.keys(outlinesObj);
  const count_outlines = outlineKeys.filter((k) => !k.startsWith('_')).length;
  const count_raw_outlines = outlineKeys.length;

  // 2. PCB & Case counts
  const count_pcbs = Object.keys(canonicalObj.pcbs || {}).length;
  const count_cases = Object.keys(canonicalObj.cases || {}).length;

  // 3. Flags and Metadata
  const is_reversible = searchRecursive(canonicalObj.pcbs, [
    'reversible',
    'reverse',
  ]);
  const is_mirrored = searchRecursive(canonicalObj.points, ['mirror']);
  const metaName = canonicalObj.meta?.name ?? 'noname';
  const metaAuthor = canonicalObj.meta?.author ?? 'noauthor';
  const count_zones = Object.keys(canonicalObj.points?.zones || {}).length;

  // 4. Granular Matrix Zone Analysis
  const zonesObj = canonicalObj.points?.zones || {};
  const zoneKeys = Object.keys(zonesObj);

  const matrixZonesList = zoneKeys.filter((key) => {
    const zone = zonesObj[key];
    return (
      zone && typeof zone === 'object' && ('columns' in zone || 'rows' in zone)
    );
  });

  const matrix_zones = matrixZonesList.length;
  const has_matrix = matrix_zones > 0;

  let matrix_zone_names = '';
  let matrix_col_counts = '';
  let matrix_row_counts = '';
  let matrix_key_counts = '';
  let matrix_col_names = '';
  let matrix_row_names = '';
  let matrix_keys = 0;

  const pointsKeys = Object.keys(pointsObj);

  if (has_matrix) {
    const sortedZones = [...matrixZonesList].sort();

    const zoneNamesArr: string[] = [];
    const colCountsArr: number[] = [];
    const rowCountsArr: number[] = [];
    const keyCountsArr: number[] = [];
    const colNamesArr: string[] = [];
    const rowNamesArr: string[] = [];

    for (const zoneName of sortedZones) {
      const zone = zonesObj[zoneName];

      const cols = Object.keys(zone?.columns || {});
      const sortedCols = [...cols].sort();

      const rows = Object.keys(zone?.rows || {});
      const sortedRows = [...rows].sort();

      // Mirroring check
      const hasZoneMirror =
        zone?.mirror === true ||
        (typeof zone?.mirror === 'object' && zone?.mirror !== null);
      const hasRootMirror =
        canonicalObj.points?.mirror === true ||
        (typeof canonicalObj.points?.mirror === 'object' &&
          canonicalObj.points?.mirror !== null);
      const isZoneMirrored = hasZoneMirror || hasRootMirror;

      const pointsInZone = pointsKeys.filter((k) => {
        const pt = pointsObj[k];
        const zName = getPointZone(pt);
        if (zName !== zoneName) return false;
        // Filter out mirrored points from the baseline count
        if (pt?.meta?.mirrored === true || k.startsWith('mirror_'))
          return false;
        return true;
      });

      let zoneKeyCount = pointsInZone.length;
      if (isZoneMirrored) {
        zoneKeyCount *= 2;
      }

      zoneNamesArr.push(zoneName);
      colCountsArr.push(sortedCols.length);
      rowCountsArr.push(sortedRows.length);
      keyCountsArr.push(zoneKeyCount);

      colNamesArr.push(sortedCols.join(','));
      rowNamesArr.push(sortedRows.join(','));

      matrix_keys += zoneKeyCount;
    }

    matrix_zone_names = zoneNamesArr.join(',');
    matrix_col_counts = colCountsArr.join(',');
    matrix_row_counts = rowCountsArr.join(',');
    matrix_key_counts = keyCountsArr.join(',');
    matrix_col_names = colNamesArr.join('|');
    matrix_row_names = rowNamesArr.join('|');
  }

  // 5. Deterministic Geometric Hash (config_id)
  const processedPoints = pointsKeys.map((name) => {
    const pt = pointsObj[name];
    const zoneName = getPointZone(pt);
    const isMatrixZone = zoneName ? matrixZonesList.includes(zoneName) : false;
    const type = isMatrixZone ? 'K' : 'A';

    const x = round2(pt?.x ?? 0);
    const y = round2(pt?.y ?? 0);
    const r = round2(pt?.r ?? 0);

    return {
      name,
      type,
      x,
      y,
      r,
    };
  });

  processedPoints.sort((a, b) => {
    if (a.x !== b.x) return a.x - b.x;
    if (a.y !== b.y) return a.y - b.y;
    if (a.r !== b.r) return a.r - b.r;
    return a.name.localeCompare(b.name);
  });

  const serialized_points = processedPoints
    .map(
      (pt) =>
        `${pt.type}${pt.x.toString()};${pt.y.toString()};${pt.r.toString()}`
    )
    .join('|');

  const hashInput = `${metaName}|${metaAuthor}|${serialized_points}`;
  const fullHash = sha256(hashInput);
  const config_id = fullHash.substring(0, 12);

  return {
    total_generation_time_ms: totalGenerationTimeMs,
    count_outlines,
    count_raw_outlines,
    count_pcbs,
    count_cases,
    is_reversible,
    is_mirrored,
    'meta.name': metaName,
    'meta.author': metaAuthor,
    count_zones,
    matrix_zones,
    has_matrix,
    matrix_zone_names,
    matrix_col_counts,
    matrix_row_counts,
    matrix_key_counts,
    matrix_col_names,
    matrix_row_names,
    matrix_keys,
    config_id,
  };
}
