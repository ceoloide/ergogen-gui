/**
 * Keeps a board hull, which the Build view owns, around every key.
 *
 * Ergogen's `hull` outline only takes an explicit list of points, so a hull
 * meant to enclose the whole keyboard goes stale whenever keys are added,
 * removed, skipped or mirrored. A configuration hands one hull to the builder
 * with a marker naming the outline part under `outlines`:
 *
 *   meta:
 *     builder:
 *       hull: board.hull
 *
 * After each edit it checks, the builder rewrites that part's `points` to
 * name every key the engine produces (mirrored keys included, skipped keys
 * left out). Nothing else is touched, and configurations without the marker
 * are never changed: removing it makes the list the user's own again.
 */
import yaml from 'js-yaml';
import type { Layout } from './pointsPreview';
import type { PatchOperation } from './yamlPatch';
import { unnest } from './unnest';

type Plain = Record<string, unknown>;

const asObject = (value: unknown): Plain | undefined =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Plain)
    : undefined;

/**
 * The `points` path of the hull the builder owns in `text`, or null when
 * there is no marker or it does not name a `what: hull` part with a list of
 * point names.
 */
export const managedHullPath = (text: string): string[] | null => {
  let config: Plain | undefined;
  try {
    config = asObject(unnest(yaml.load(text)));
  } catch {
    return null;
  }
  const marker = asObject(asObject(config?.meta)?.builder)?.hull;
  if (typeof marker !== 'string') return null;
  const segments = marker.split('.');
  if (segments.length !== 2 || segments.some((segment) => !segment)) {
    return null;
  }
  const [outline, part] = segments;
  const hull = asObject(
    asObject(asObject(config?.outlines)?.[outline])?.[part]
  );
  if (hull?.what !== 'hull') return null;
  const points = hull.points;
  if (
    !Array.isArray(points) ||
    !points.every((point) => typeof point === 'string')
  ) {
    return null;
  }
  return ['outlines', outline, part, 'points'];
};

/**
 * The operation that makes the managed hull of `text` list every key of
 * `layout` (the engine's layout of the same text), or none when it already
 * does or nothing is managed.
 */
export const syncManagedHull = (
  text: string,
  layout: Layout
): PatchOperation[] => {
  const path = managedHullPath(text);
  if (!path) return [];
  const wanted = layout.keys
    .filter((key) => !key.skipped)
    .map((key) => key.name);
  let current: unknown;
  try {
    current = path.reduce<unknown>(
      (value, segment) => asObject(value)?.[segment],
      unnest(yaml.load(text))
    );
  } catch {
    return [];
  }
  if (JSON.stringify(current) === JSON.stringify(wanted)) return [];
  return [{ type: 'set', path, value: wanted }];
};
