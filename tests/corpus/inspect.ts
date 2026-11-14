import JSZip from 'jszip';
import * as makerjs from 'makerjs';

/**
 * Small readers that turn generated SVG, DXF, KiCad and ZIP output into
 * comparable geometry and structure. They read only what the corpus asserts;
 * they are not general parsers for these formats.
 */

type Point = [number, number];
type Segment = [Point, Point];

/** Coordinates written to SVG are rounded to 0.001 mm; allow twice that. */
const TOLERANCE = 0.002;

/** Moves segments so their lowest endpoint coordinates are the origin. */
const fromOrigin = (segments: Segment[]): Segment[] => {
  const minX = Math.min(...segments.flatMap(([a, b]) => [a[0], b[0]]));
  const minY = Math.min(...segments.flatMap(([a, b]) => [a[1], b[1]]));
  return segments.map(
    ([a, b]) =>
      [
        [a[0] - minX, a[1] - minY],
        [b[0] - minX, b[1] - minY],
      ] as Segment
  );
};

const samePoint = (a: Point, b: Point) =>
  Math.abs(a[0] - b[0]) <= TOLERANCE && Math.abs(a[1] - b[1]) <= TOLERANCE;

const sameSegment = ([a1, a2]: Segment, [b1, b2]: Segment) =>
  (samePoint(a1, b1) && samePoint(a2, b2)) ||
  (samePoint(a1, b2) && samePoint(a2, b1));

const describeSegment = ([a, b]: Segment) =>
  `(${a[0].toFixed(3)}, ${a[1].toFixed(3)})-(${b[0].toFixed(3)}, ${b[1].toFixed(3)})`;

/**
 * Pairs segments within the SVG rounding tolerance, ignoring direction and
 * order, and lists the ones left over on each side. Equal geometry gives
 * `{ missing: [], unexpected: [] }`.
 */
export const segmentDifferences = (
  actual: Segment[],
  expected: Segment[]
): { missing: string[]; unexpected: string[] } => {
  const unmatched = [...actual];
  const missing: string[] = [];
  for (const segment of expected) {
    const index = unmatched.findIndex((candidate) =>
      sameSegment(candidate, segment)
    );
    if (index < 0) missing.push(describeSegment(segment));
    else unmatched.splice(index, 1);
  }
  return { missing, unexpected: unmatched.map(describeSegment) };
};

export type OutlineGeometry = {
  width: number;
  height: number;
  /** Closed regions: makerjs chains that end where they start. */
  regions: number;
  /** Paths that are neither lines nor arcs; the corpus expects none. */
  otherPaths: number;
  /**
   * Line and arc endpoints, moved so the lowest coordinates are the origin;
   * compare them with `segmentDifferences`.
   */
  segments: Segment[];
};

/**
 * Reads the geometry of an Ergogen SVG outline with makerjs, which is also
 * what produced it. The viewBox must be four finite numbers, with a positive
 * size, that frame the paths exactly (origin included, in SVG coordinates).
 */
export const svgOutlineGeometry = (svg: string): OutlineGeometry => {
  const pathData = [...svg.matchAll(/<path[^>]*\sd="([^"]*)"/g)]
    .map((match) => match[1])
    .join(' ');
  const model = makerjs.importer.fromSVGPathData(pathData);
  const extents = makerjs.measure.modelExtents(model);
  if (!extents) throw new Error('SVG has no paths');
  const segments: Segment[] = [];
  let otherPaths = 0;
  makerjs.model.walk(model, {
    onPath: (walked) => {
      const ends = makerjs.point.fromPathEnds(
        walked.pathContext,
        walked.offset
      );
      if (ends) {
        const [start, end] = ends;
        segments.push([
          [start[0], start[1]],
          [end[0], end[1]],
        ]);
      } else {
        otherPaths += 1;
      }
    },
  });
  // makerjs imports SVG with y negated (model y points up), so the drawing's
  // SVG-space box runs from -high to -low on y.
  const drawn = {
    x: extents.low[0],
    y: -extents.high[1],
    width: extents.width,
    height: extents.height,
  };
  const viewBoxText = svg.match(/viewBox="([^"]*)"/)?.[1];
  const viewBox =
    viewBoxText
      ?.trim()
      .split(/[\s,]+/)
      .map(Number) ?? [];
  const [x, y, width, height] = viewBox;
  if (
    viewBox.length !== 4 ||
    !viewBox.every(Number.isFinite) ||
    width <= 0 ||
    height <= 0 ||
    Math.abs(x - drawn.x) > TOLERANCE ||
    Math.abs(y - drawn.y) > TOLERANCE ||
    Math.abs(width - drawn.width) > TOLERANCE ||
    Math.abs(height - drawn.height) > TOLERANCE
  ) {
    throw new Error(
      `SVG viewBox "${viewBoxText ?? '(none)'}" does not frame its paths (${drawn.x} ${drawn.y} ${drawn.width} ${drawn.height})`
    );
  }
  return {
    width: extents.width,
    height: extents.height,
    regions: (makerjs.model.findChains(model) as makerjs.IChain[]).filter(
      (chain) => chain.endless
    ).length,
    otherPaths,
    segments: fromOrigin(segments),
  };
};

/**
 * Reads LINE entities from a makerjs DXF. Both this and the makerjs SVG import
 * use model coordinates (y up), so their segments are directly comparable.
 */
export const dxfLineSegments = (dxf: string): Segment[] => {
  const lines = dxf.split(/\r?\n/).map((line) => line.trim());
  const entitiesStart = lines.indexOf('ENTITIES');
  if (lines[0] !== '0' || lines[1] !== 'SECTION' || entitiesStart < 0) {
    throw new Error('Not a DXF document with an ENTITIES section');
  }
  const segments: Segment[] = [];
  for (let i = entitiesStart; i + 1 < lines.length; i += 1) {
    if (lines[i] !== '0' || lines[i + 1] !== 'LINE') continue;
    const values: Record<string, number> = {};
    for (let j = i + 2; j + 1 < lines.length && lines[j] !== '0'; j += 2) {
      values[lines[j]] = Number(lines[j + 1]);
    }
    segments.push([
      [values['10'], values['20']],
      [values['11'], values['21']],
    ]);
  }
  return fromOrigin(segments);
};

/** Returns each balanced `(head ...)` expression in a KiCad document. */
const sExpressions = (text: string, head: string): string[] => {
  const blocks: string[] = [];
  let start = text.indexOf(`(${head} `);
  while (start >= 0) {
    let depth = 0;
    let inString = false;
    let end = start;
    for (; end < text.length; end += 1) {
      const char = text[end];
      if (inString) {
        if (char === '\\') end += 1;
        else if (char === '"') inString = false;
      } else if (char === '"') inString = true;
      else if (char === '(') depth += 1;
      else if (char === ')' && --depth === 0) break;
    }
    blocks.push(text.slice(start, end + 1));
    start = text.indexOf(`(${head} `, end);
  }
  return blocks;
};

const netNames = (text: string): string[] =>
  [...text.matchAll(/\(net \d+ "([^"]*)"\)/g)].map((match) => match[1]);

export type PcbFootprint = {
  library: string;
  reference: string;
  x: number;
  y: number;
  rotation: number;
  /** Distinct nets on the footprint's pads, sorted. */
  nets: string[];
};

export const pcbFootprints = (pcb: string): PcbFootprint[] =>
  sExpressions(pcb, 'footprint').map((block) => {
    const at = block.match(/\(at (\S+) (\S+)(?: (\S+))?\)/);
    return {
      library: block.match(/^\(footprint "([^"]+)"/)?.[1] ?? '',
      reference: block.match(/\(property "Reference" "([^"]*)"/)?.[1] ?? '',
      x: Number(at?.[1]),
      y: Number(at?.[2]),
      rotation: Number(at?.[3] ?? 0),
      nets: [...new Set(netNames(block))].sort(),
    };
  });

/** Nets declared at board level, before the first footprint. */
export const pcbDeclaredNets = (pcb: string): string[] => {
  const firstFootprint = pcb.indexOf('(footprint ');
  return netNames(
    pcb.slice(0, firstFootprint < 0 ? undefined : firstFootprint)
  );
};

/** Width and height of the board outline drawn on Edge.Cuts. */
export const pcbEdgeCutsSize = (
  pcb: string
): { width: number; height: number; segments: number } => {
  const edges = [
    ...sExpressions(pcb, 'gr_line'),
    ...sExpressions(pcb, 'gr_arc'),
  ].filter((block) => block.includes('(layer Edge.Cuts)'));
  const points = edges.flatMap((block) =>
    [...block.matchAll(/\((?:start|end|mid) (\S+) (\S+)\)/g)].map((match) => [
      Number(match[1]),
      Number(match[2]),
    ])
  );
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  return {
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
    segments: edges.length,
  };
};

/**
 * The KiCad 8 template stamps the generation date into the title block. It is
 * the only part of the corpus PCB that changes between identical runs.
 */
export const withoutPcbGenerationDate = (pcb: string): string =>
  pcb.replace(/\(date "\d{4}-\d{2}-\d{2}"\)/, '(date "<generation date>")');

export type ArchiveContents = {
  /** File paths, sorted; folders are left out. */
  paths: string[];
  text: (path: string) => Promise<string>;
  buffer: ArrayBuffer;
};

export const readArchive = async (blob: Blob): Promise<ArchiveContents> => {
  const buffer = await blob.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);
  const paths = Object.values(zip.files)
    .filter((entry) => !entry.dir)
    .map((entry) => entry.name)
    .sort();
  return {
    paths,
    buffer,
    text: async (path) => {
      const entry = zip.file(path);
      if (!entry) throw new Error(`Archive has no file ${path}`);
      return entry.async('string');
    },
  };
};
