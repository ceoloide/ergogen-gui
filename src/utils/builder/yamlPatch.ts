/**
 * Text-preserving edits of an Ergogen YAML configuration.
 *
 * The builder never re-serializes a whole document. Each operation finds the
 * exact source range of the value it changes (with the `yaml` package's
 * concrete ranges) and splices new text into it, so comments, blank lines,
 * quoting and flow/block style elsewhere stay byte for byte. Ergogen expands
 * dotted keys (`matrix.columns.pinky: …`) before reading a config, so paths are
 * matched against both dotted and nested spellings.
 *
 * Every splice is then checked: the edited text must parse with js-yaml (the
 * parser the engine uses), and after Ergogen's own key expansion it must equal
 * the old configuration with exactly the intended change. Anything else is
 * refused with a reason instead of risking a silent corruption.
 */
import yaml from 'js-yaml';
import {
  parseDocument,
  isAlias,
  isMap,
  isScalar,
  isSeq,
  isCollection,
  Pair,
  YAMLMap,
  Node as YamlNode,
} from 'yaml';
import { unnest } from './unnest';

export type PatchValue =
  | string
  | number
  | boolean
  | null
  | PatchValue[]
  | { [key: string]: PatchValue };

export type PatchOperation =
  | {
      type: 'set';
      path: string[];
      value: PatchValue;
      /** For a new key: insert it right after this sibling key. */
      after?: string;
    }
  | { type: 'delete'; path: string[] };

type PatchResult = { ok: true; text: string } | { ok: false; reason: string };

/** Keys whose meaning depends on preprocessing the builder cannot follow. */
const PREPROCESSOR_KEYS = ['$extends', '$params', '$args', '$skip'];

class PatchRefusal extends Error {}

const refuse = (reason: string): never => {
  throw new PatchRefusal(reason);
};

const formatPath = (path: string[]) => path.join('.');

const roundNumber = (value: number) => {
  if (!Number.isFinite(value)) {
    return refuse('Only finite numbers can be written.');
  }
  const rounded = Math.round(value * 10000) / 10000;
  return Object.is(rounded, -0) ? 0 : rounded;
};

const loadsAs = (source: string, expected: string) => {
  try {
    const block = yaml.load(`k: ${source}`) as { k?: unknown } | null;
    const flow = yaml.load(`[${source}]`) as unknown[] | null;
    return block?.k === expected && Array.isArray(flow) && flow[0] === expected;
  } catch {
    return false;
  }
};

/** Serializes a scalar or a list in flow style, valid in any context. */
const formatFlow = (value: PatchValue): string => {
  if (value === null) return 'null';
  if (typeof value === 'number') return String(roundNumber(value));
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'string') {
    const plain =
      value.trim() === value && value !== '' && loadsAs(value, value);
    return plain ? value : JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(formatFlow).join(', ')}]`;
  }
  const entries = Object.entries(value).map(
    ([key, item]) => `${formatKey(key)}: ${formatFlow(item)}`
  );
  return `{${entries.join(', ')}}`;
};

const formatKey = (key: string) =>
  /^[A-Za-z0-9_$][A-Za-z0-9_$.-]*$/.test(key) && loadsAs(key, key)
    ? key
    : JSON.stringify(key);

const isPlainObject = (
  value: PatchValue | undefined
): value is { [key: string]: PatchValue } =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isListOfObjects = (value: PatchValue) =>
  Array.isArray(value) && value.some((item) => isPlainObject(item));

/**
 * Serializes `key: value` as block lines at the given indentation. Mappings
 * become nested blocks, lists of mappings become block sequences, and other
 * values stay in flow style. A null value is written as an empty `key:`.
 */
const formatBlockEntry = (
  key: string,
  value: PatchValue,
  indent: string,
  unit: string
): string[] => {
  const head = `${indent}${formatKey(key)}:`;
  if (value === null) return [head];
  if (isPlainObject(value)) {
    const entries = Object.entries(value);
    if (!entries.length) return [`${head} {}`];
    return [
      head,
      ...entries.flatMap(([childKey, childValue]) =>
        formatBlockEntry(childKey, childValue, indent + unit, unit)
      ),
    ];
  }
  if (Array.isArray(value) && isListOfObjects(value)) {
    const lines = [head];
    for (const item of value) {
      if (isPlainObject(item)) {
        const itemLines = Object.entries(item).flatMap(([k, v]) =>
          formatBlockEntry(k, v, `${indent}${unit}  `, unit)
        );
        const first = itemLines[0] ?? `${indent}${unit}  {}`;
        lines.push(
          `${indent}${unit}- ${first.trimStart()}`,
          ...itemLines.slice(1)
        );
      } else {
        lines.push(`${indent}${unit}- ${formatFlow(item)}`);
      }
    }
    return lines;
  }
  return [`${head} ${formatFlow(value)}`];
};

const lineStart = (text: string, offset: number) =>
  text.lastIndexOf('\n', offset - 1) + 1;

const columnOf = (text: string, offset: number) =>
  offset - lineStart(text, offset);

/** The offset just after the line holding `offset - 1`, or the text end. */
const afterLine = (text: string, offset: number) => {
  if (offset > 0 && text[offset - 1] === '\n') return offset;
  const newline = text.indexOf('\n', offset);
  return newline === -1 ? text.length : newline + 1;
};

const isTrivialLine = (line: string) => {
  const trimmed = line.trim();
  return trimmed === '' || trimmed.startsWith('#');
};

/**
 * Where the content of a node that ends at `offset` really ends: the start of
 * the line after its last content line. The `yaml` package lets a node's
 * range run on over the indentation of the next key and over blank and
 * comment lines that come before the next, less indented key; those belong
 * to what follows, so they are left out. Comment lines indented deeper than
 * `column` stay with the node.
 */
const contentEnd = (
  text: string,
  offset: number,
  floor: number,
  column: number
) => {
  const start = lineStart(text, offset);
  let end =
    text.slice(start, offset).trim() === '' ? start : afterLine(text, offset);
  while (end > floor) {
    const previous = lineStart(text, end - 1);
    if (previous <= floor) break;
    const line = text.slice(previous, end).replace(/\r?\n$/, '');
    if (!isTrivialLine(line)) break;
    const indent = line.length - line.trimStart().length;
    if (line.trim() !== '' && indent > column) break;
    end = previous;
  }
  return end;
};

const detectEol = (text: string) => (text.includes('\r\n') ? '\r\n' : '\n');

/** Indentation step used by the document's block mappings (default two). */
const detectIndentUnit = (text: string) => {
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length - 1; i++) {
    const current = lines[i];
    if (!/^\s*[^\s#-][^#]*:\s*(#.*)?$/.test(current)) continue;
    const next = lines.slice(i + 1).find((line) => line.trim() !== '');
    if (!next) continue;
    const step =
      next.length -
      next.trimStart().length -
      (current.length - current.trimStart().length);
    if (step > 0 && step <= 8) return ' '.repeat(step);
  }
  return '  ';
};

const keyText = (pair: Pair): string | null => {
  const key = pair.key;
  if (isScalar(key) && key.value !== null && key.value !== undefined) {
    return String(key.value);
  }
  return null;
};

const assertEditableMap = (map: YAMLMap, at: string) => {
  for (const pair of map.items) {
    const key = keyText(pair);
    if (key === null) {
      return refuse(`"${at}" has a complex or merge key; edit it in YAML.`);
    }
    if (key === '<<') {
      return refuse(`"${at}" uses a YAML merge key; edit it in YAML.`);
    }
    if (PREPROCESSOR_KEYS.includes(key)) {
      return refuse(`"${at}" uses ${key}; edit it in YAML.`);
    }
  }
};

type Location =
  | {
      kind: 'value';
      map: YAMLMap;
      /** The pair whose value is `map`, absent for the document. */
      parent?: Pair;
      pair: Pair;
    }
  | {
      kind: 'missing';
      /** The deepest existing map, or the pair whose empty value must become one. */
      map?: YAMLMap;
      parent?: Pair;
      emptyPair?: Pair;
      remaining: string[];
      siblingPrefix: boolean;
    };

/**
 * Finds where `path` lives, following dotted keys (`a.b: 1` counts as
 * `a: {b: 1}`). Refuses aliases, merge keys, preprocessor keys and paths that
 * two spellings both define.
 */
const locate = (root: YAMLMap, path: string[]): Location => {
  let map = root;
  let parent: Pair | undefined;
  let index = 0;
  for (;;) {
    const at = formatPath(path.slice(0, index)) || 'the document';
    assertEditableMap(map, at);
    const remaining = path.slice(index);
    const candidates = map.items.filter((pair) => {
      const segments = (keyText(pair) as string).split('.');
      return (
        segments.length <= remaining.length &&
        segments.every((segment, i) => segment === remaining[i])
      );
    });
    if (candidates.length > 1) {
      return refuse(
        `"${formatPath(path)}" is written in more than one place (dotted and nested keys); edit it in YAML.`
      );
    }
    if (!candidates.length) {
      const siblingPrefix = map.items.some(
        (pair) => (keyText(pair) as string).split('.')[0] === remaining[0]
      );
      return { kind: 'missing', map, parent, remaining, siblingPrefix };
    }
    const pair = candidates[0];
    const consumed = (keyText(pair) as string).split('.').length;
    index += consumed;
    if (index === path.length) {
      return { kind: 'value', map, parent, pair };
    }
    const value = pair.value as YamlNode | null;
    if (isAlias(value)) {
      return refuse(
        `"${formatPath(path.slice(0, index))}" is a YAML alias; edit it in YAML.`
      );
    }
    if (value === null || (isScalar(value) && value.value === null)) {
      return {
        kind: 'missing',
        emptyPair: pair,
        remaining: path.slice(index),
        siblingPrefix: false,
      };
    }
    if (!isMap(value)) {
      return refuse(
        `"${formatPath(path.slice(0, index))}" is not a mapping; edit it in YAML.`
      );
    }
    if (value.anchor) {
      return refuse(
        `"${formatPath(path.slice(0, index))}" has a YAML anchor that other keys may share; edit it in YAML.`
      );
    }
    map = value;
    parent = pair;
  }
};

const nestedValue = (remaining: string[], value: PatchValue): PatchValue =>
  remaining
    .slice(1)
    .reduceRight<PatchValue>((inner, key) => ({ [key]: inner }), value);

/** Inserts `remaining = value` as a new entry of a block or flow map. */
const insertIntoMap = (
  text: string,
  map: YAMLMap,
  remaining: string[],
  value: PatchValue,
  dotted: boolean,
  after: string | undefined
): string => {
  const eol = detectEol(text);
  const key = dotted ? remaining.join('.') : remaining[0];
  const entryValue = dotted ? value : nestedValue(remaining, value);
  const [start, valueEnd] = map.range as [number, number, number];

  if (map.flow) {
    const close = text.lastIndexOf('}', valueEnd - 1);
    if (close < start) return refuse('Unexpected flow mapping layout.');
    if (after !== undefined) {
      return refuse('Cannot insert in order into a flow mapping.');
    }
    const before = text.slice(start + 1, close);
    const separator = before.trim() === '' ? '' : ', ';
    const insertion = `${separator}${formatKey(key)}: ${formatFlow(entryValue)}`;
    const trimmedEnd = start + 1 + before.trimEnd().length;
    const trailingSpace = before.slice(before.trimEnd().length);
    return (
      text.slice(0, trimmedEnd) + insertion + trailingSpace + text.slice(close)
    );
  }

  const firstKey = map.items[0]?.key as YamlNode | undefined;
  if (!firstKey?.range) return refuse('Unexpected empty block mapping.');
  const indent = ' '.repeat(columnOf(text, firstKey.range[0]));
  if (
    text.slice(lineStart(text, firstKey.range[0]), firstKey.range[0]).trim()
  ) {
    return refuse('A mapping that starts mid-line cannot be extended safely.');
  }
  const floor = lineStart(text, firstKey.range[0]);
  let position = contentEnd(text, valueEnd, floor, indent.length);
  if (after !== undefined) {
    // The sibling may be spelled in dotted fragments (`ring.key.stagger: 6`);
    // insert after the last one. If other keys sit between its fragments,
    // the semantic check refuses the edit, as the order would differ.
    const sibling = [...map.items].reverse().find((pair) => {
      const name = keyText(pair) as string;
      return name === after || name.startsWith(`${after}.`);
    });
    if (!sibling) return refuse(`Cannot find "${after}" to insert after.`);
    position = pairEnd(text, sibling);
  }
  const unit = detectIndentUnit(text);
  const lines = formatBlockEntry(key, entryValue, indent, unit);
  const prefix = position === text.length && !text.endsWith('\n') ? eol : '';
  return (
    text.slice(0, position) +
    prefix +
    lines.join(eol) +
    eol +
    text.slice(position)
  );
};

/**
 * Writes `entries` as block children under `key:` whose value is empty, an
 * explicit null (`null` or `~`) or an empty `{}`, which is removed first.
 */
const fillEmptyPair = (
  text: string,
  pair: Pair,
  entries: { [key: string]: PatchValue }
): string => {
  const eol = detectEol(text);
  const keyNode = pair.key as YamlNode;
  const keyStart = keyNode.range![0];
  const keyEnd = keyNode.range![1];
  if (text.slice(lineStart(text, keyStart), keyStart).trim() !== '') {
    return refuse('A key that starts mid-line cannot be extended safely.');
  }
  let source = text;
  const valueNode = pair.value as YamlNode | null;
  const emptyFlowMap =
    isMap(valueNode) && valueNode.flow && !valueNode.items.length;
  if (valueNode && (isScalar(valueNode) || emptyFlowMap) && valueNode.range) {
    const [from, to] = valueNode.range;
    if (to > from) {
      const lineEnd = text.indexOf('\n', to);
      const rest = text.slice(to, lineEnd === -1 ? text.length : lineEnd);
      if (rest.trim() !== '' && !rest.trim().startsWith('#')) {
        return refuse('Cannot add nested values inside a flow mapping.');
      }
      source = text.slice(0, from).replace(/[ \t]+$/, '') + text.slice(to);
    }
  }
  const indent = ' '.repeat(columnOf(source, keyStart));
  const unit = detectIndentUnit(source);
  const position = afterLine(source, keyEnd);
  const lines = Object.entries(entries).flatMap(([key, value]) =>
    formatBlockEntry(key, value, indent + unit, unit)
  );
  const prefix =
    position === source.length && !source.endsWith('\n') ? eol : '';
  return (
    source.slice(0, position) +
    prefix +
    lines.join(eol) +
    eol +
    source.slice(position)
  );
};

/**
 * The lines of `value`, a non-empty list of scalars, written as the block
 * list `node` is: one `- item` per line at the indentation of its first
 * item. Null when `node` is not such a list, so the value is written in flow
 * style instead.
 */
const blockListItems = (
  text: string,
  node: YamlNode,
  value: PatchValue
): string[] | null => {
  if (!isSeq(node) || node.flow || !Array.isArray(value) || !value.length) {
    return null;
  }
  if (value.some((item) => item !== null && typeof item === 'object')) {
    return null;
  }
  const first = node.items[0] as YamlNode | undefined;
  if (!first?.range) return null;
  const start = lineStart(text, first.range[0]);
  const lead = text.slice(start, first.range[0]);
  const match = /^( *)- +$/.exec(lead);
  if (!match) return null;
  return value.map((item) => `${match[1]}- ${formatFlow(item)}`);
};

/**
 * Writes a non-empty list of scalars in block style under `key: []` (as a
 * block list that lost its last item is written), so the list keeps its
 * shape when it fills up again. Null when the pair is not laid out that way.
 */
const refillEmptyList = (
  text: string,
  pair: Pair,
  value: PatchValue
): string | null => {
  const valueNode = pair.value as YamlNode | null;
  const keyNode = pair.key as YamlNode;
  if (
    !isSeq(valueNode) ||
    !valueNode.flow ||
    valueNode.items.length ||
    !valueNode.range ||
    !Array.isArray(value) ||
    !value.length ||
    value.some((item) => item !== null && typeof item === 'object')
  ) {
    return null;
  }
  const keyStart = keyNode.range![0];
  const start = lineStart(text, keyStart);
  if (text.slice(start, keyStart).trim() !== '') return null;
  const [from, to] = valueNode.range;
  const lineEnd = text.indexOf('\n', from);
  const rest = text.slice(to, lineEnd === -1 ? text.length : lineEnd);
  if (
    rest.trim() !== '' ||
    text.slice(keyNode.range![1], from).trim() !== ':'
  ) {
    return null;
  }
  const eol = detectEol(text);
  const indent = ' '.repeat(keyStart - start) + detectIndentUnit(text);
  const lines = value.map((item) => `${indent}- ${formatFlow(item)}`);
  const colon = text.indexOf(':', keyNode.range![1]);
  return text.slice(0, colon + 1) + eol + lines.join(eol) + text.slice(to);
};

/** Replaces the value of an existing `key: value` pair. */
const replaceValue = (text: string, pair: Pair, value: PatchValue): string => {
  const valueNode = pair.value as YamlNode | null;
  const keyNode = pair.key as YamlNode;
  if (isAlias(valueNode)) {
    return refuse('The value is a YAML alias; edit it in YAML.');
  }
  if (valueNode?.anchor) {
    return refuse('The value has a YAML anchor; edit it in YAML.');
  }
  const isEmpty =
    !valueNode || (isScalar(valueNode) && valueNode.value === null);
  if (isPlainObject(value) && Object.keys(value).length) {
    if (!isEmpty) {
      return refuse('Replacing a structured value is not supported here.');
    }
    return fillEmptyPair(text, pair, value);
  }
  if (isListOfObjects(value)) {
    return refuse('Replacing a list of mappings is not supported here.');
  }
  const replacement = formatFlow(value);
  if (!valueNode?.range) {
    return refuse('Unexpected value layout.');
  }
  const refilled = refillEmptyList(text, pair, value);
  if (refilled !== null) return refilled;
  const [from, to] = valueNode.range;
  if (isCollection(valueNode) && !valueNode.flow) {
    // A block list or map: replace everything after the colon.
    const colon = text.indexOf(':', keyNode.range![1]);
    const end = pairEnd(text, pair);
    const newline = text.slice(from, end).endsWith('\n') ? detectEol(text) : '';
    const items = blockListItems(text, valueNode, value);
    if (items) {
      const eol = detectEol(text);
      return (
        text.slice(0, colon + 1) +
        eol +
        items.join(eol) +
        newline +
        text.slice(end)
      );
    }
    return (
      text.slice(0, colon + 1) + ' ' + replacement + newline + text.slice(end)
    );
  }
  if (from === to) {
    const needsSpace = text[from - 1] === ':';
    return (
      text.slice(0, from) +
      (needsSpace ? ' ' : '') +
      replacement +
      text.slice(to)
    );
  }
  return text.slice(0, from) + replacement + text.slice(to);
};

/**
 * The offset just after the last line of a pair (its key line and value
 * lines, with the comment at the end of those lines).
 */
const pairEnd = (text: string, pair: Pair) => {
  const keyNode = pair.key as YamlNode;
  const valueNode = pair.value as YamlNode | null;
  const start = lineStart(text, keyNode.range![0]);
  return contentEnd(
    text,
    valueNode?.range ? valueNode.range[1] : keyNode.range![1],
    start,
    columnOf(text, keyNode.range![0])
  );
};

/** Removes `key: value` pairs of a block map, with their trailing comments. */
const deletePairs = (text: string, map: YAMLMap, pairs: Pair[]): string => {
  if (map.flow) return refuse('Cannot remove entries from a flow mapping.');
  const ranges = pairs.map((pair) => {
    const keyNode = pair.key as YamlNode;
    const start = lineStart(text, keyNode.range![0]);
    if (text.slice(start, keyNode.range![0]).trim() !== '') {
      return refuse('A key that starts mid-line cannot be removed safely.');
    }
    return [start, pairEnd(text, pair)] as const;
  });
  let result = text;
  for (const [start, end] of ranges.sort((a, b) => b[0] - a[0])) {
    result = result.slice(0, start) + result.slice(end);
  }
  return result;
};

/**
 * Writes `{}` as the value of `parent`, whose block map has just lost its
 * last entry, so the now empty map does not turn into a null.
 */
const emptyBlockValue = (text: string, parent: Pair): string => {
  const keyNode = parent.key as YamlNode;
  const colon = text.indexOf(':', keyNode.range![1]);
  const lineEnd = text.indexOf('\n', colon);
  const rest = text.slice(colon + 1, lineEnd === -1 ? text.length : lineEnd);
  if (colon === -1 || !isTrivialLine(rest)) {
    return refuse('Unexpected mapping layout.');
  }
  return text.slice(0, colon + 1) + ' {}' + text.slice(colon + 1);
};

/**
 * Replaces a dotted `a.b.c: value` with `a.b: {}`, which removes `c` and
 * keeps the parents the dotted key also defined.
 */
const shortenDottedKey = (text: string, pair: Pair): string => {
  const keyNode = pair.key as YamlNode;
  const valueNode = pair.value as YamlNode | null;
  const segments = (keyText(pair) as string).split('.');
  const colon = text.indexOf(':', keyNode.range![1]);
  if (valueNode && isCollection(valueNode) && !valueNode.flow) {
    return refuse('Unexpected dotted key layout.');
  }
  const end = Math.max(colon + 1, valueNode?.range ? valueNode.range[1] : 0);
  return (
    text.slice(0, keyNode.range![0]) +
    `${formatKey(segments.slice(0, -1).join('.'))}: {}` +
    text.slice(end)
  );
};

/**
 * Ways to remove `path`, tried in order until one changes exactly that
 * value: removing its lines, then keeping the parents it would take along
 * as empty maps (a block map that loses its only entry, or the parents a
 * dotted key also spells).
 */
const deleteCandidates = (
  text: string,
  location: Location
): Array<() => string> => {
  if (location.kind === 'value') {
    const { map, pair, parent } = location;
    const plain = () => deletePairs(text, map, [pair]);
    if ((keyText(pair) as string).includes('.')) {
      return [plain, () => shortenDottedKey(text, pair)];
    }
    if (map.items.length === 1 && parent) {
      return [plain, () => emptyBlockValue(plain(), parent)];
    }
    return [plain];
  }
  const { map, parent, remaining } = location;
  if (!map || location.emptyPair) return [() => text];
  // `path` may only exist through longer dotted keys (`mirror.ref: …`).
  const spelled = map.items.filter((pair) => {
    const segments = (keyText(pair) as string).split('.');
    return (
      segments.length > remaining.length &&
      remaining.every((segment, i) => segments[i] === segment)
    );
  });
  if (!spelled.length) return [() => text];
  const plain = () => deletePairs(text, map, spelled);
  if (spelled.length === map.items.length && parent) {
    return [plain, () => emptyBlockValue(plain(), parent)];
  }
  return [plain];
};

const parseRoot = (text: string): YAMLMap => {
  const doc = parseDocument(text, { uniqueKeys: true });
  if (doc.errors.length) {
    return refuse(`The YAML has an error: ${doc.errors[0].message}`);
  }
  if (!isMap(doc.contents)) {
    return refuse('Only YAML or JSON mappings can be edited visually.');
  }
  return doc.contents;
};

const candidatesFor = (
  text: string,
  operation: PatchOperation
): Array<() => string> => {
  const root = parseRoot(text);
  const location = locate(root, operation.path);
  if (operation.type === 'delete') return deleteCandidates(text, location);
  return [() => applySet(text, location, operation)];
};

const applySet = (
  text: string,
  location: Location,
  operation: Extract<PatchOperation, { type: 'set' }>
): string => {
  if (location.kind === 'value') {
    return replaceValue(text, location.pair, operation.value);
  }
  if (location.emptyPair) {
    return fillEmptyPair(text, location.emptyPair, {
      [location.remaining[0]]: nestedValue(location.remaining, operation.value),
    });
  }
  const map = location.map as YAMLMap;
  if (!map.items.length) {
    // An empty `{}` under a key, such as one a removal left, becomes a block.
    if (map.flow && location.parent) {
      return fillEmptyPair(text, location.parent, {
        [location.remaining[0]]: nestedValue(
          location.remaining,
          operation.value
        ),
      });
    }
    if (!map.flow) {
      return refuse('Cannot add to an empty mapping; edit it in YAML.');
    }
  }
  return insertIntoMap(
    text,
    map,
    location.remaining,
    operation.value,
    location.siblingPrefix && location.remaining.length > 1,
    location.remaining.length === 1 ? operation.after : undefined
  );
};

/* Semantic check ---------------------------------------------------------- */

type Plain = unknown;

const loadExpanded = (text: string): Plain => {
  const parsed = yaml.load(text);
  return unnest(parsed);
};

const clone = (value: Plain): Plain =>
  value === undefined ? undefined : JSON.parse(JSON.stringify(value));

const expectMutation = (config: Plain, operation: PatchOperation): Plain => {
  const result = clone(config) as Record<string, unknown>;
  let parent: Record<string, unknown> = result;
  const path = operation.path;
  for (const segment of path.slice(0, -1)) {
    const next = parent[segment];
    if (typeof next !== 'object' || next === null || Array.isArray(next)) {
      if (operation.type === 'delete') return result;
      parent[segment] = {};
    }
    parent = parent[segment] as Record<string, unknown>;
  }
  const last = path[path.length - 1];
  if (operation.type === 'delete') {
    delete parent[last];
    return result;
  }
  const value = clone(normalizeValue(operation.value));
  if (operation.after !== undefined && !(last in parent)) {
    const entries = Object.entries(parent);
    const index = entries.findIndex(([key]) => key === operation.after);
    entries.splice(index + 1, 0, [last, value]);
    for (const key of Object.keys(parent)) delete parent[key];
    for (const [key, entry] of entries) parent[key] = entry;
  } else {
    parent[last] = value;
  }
  return result;
};

const normalizeValue = (value: PatchValue): PatchValue => {
  if (typeof value === 'number') return roundNumber(value);
  if (Array.isArray(value)) return value.map(normalizeValue);
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, normalizeValue(v)])
    );
  }
  return value;
};

const sameValue = (a: Plain, b: Plain) =>
  JSON.stringify(a) === JSON.stringify(b);

/**
 * Applies operations in order to `text` and returns the edited text, or the
 * reason the edit was refused. The input is never partially changed.
 */
export const applyPatch = (
  text: string,
  operations: PatchOperation[]
): PatchResult => {
  let current = text;
  try {
    for (const operation of operations) {
      if (!operation.path.length) return { ok: false, reason: 'Empty path.' };
      const expected = expectMutation(loadExpanded(current), operation);
      let accepted: string | null = null;
      let reason: string | null = null;
      for (const candidate of candidatesFor(current, operation)) {
        let next: string;
        try {
          next = candidate();
        } catch (error) {
          if (!(error instanceof PatchRefusal)) throw error;
          reason ??= error.message;
          continue;
        }
        let after: Plain;
        try {
          after = loadExpanded(next);
        } catch (error) {
          reason ??= `The edit would break the YAML (${(error as Error).message.split('\n')[0]}), so it was not applied.`;
          continue;
        }
        if (sameValue(after, expected)) {
          accepted = next;
          break;
        }
        reason ??= `Changing "${formatPath(operation.path)}" here would also change other values, so it was not applied; edit it in YAML.`;
      }
      if (accepted === null) {
        return { ok: false, reason: reason ?? 'The edit was not applied.' };
      }
      current = accepted;
    }
  } catch (error) {
    if (error instanceof PatchRefusal) {
      return { ok: false, reason: error.message };
    }
    if (error instanceof yaml.YAMLException) {
      return {
        ok: false,
        reason: `The YAML has an error: ${error.message.split('\n')[0]}`,
      };
    }
    throw error;
  }
  return { ok: true, text: current };
};
