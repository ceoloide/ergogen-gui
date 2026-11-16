/**
 * Ergogen's `prepare.unnest`, which expands dotted keys (`a.b: 1` becomes
 * `a: {b: 1}`) in the order they are written, so a later key can replace an
 * earlier one. The engine module is not imported on the main thread because
 * it pulls in the engine's geometry dependencies; `unnest.test.ts` checks
 * that both give the same result.
 */
type Plain = unknown;

const isObject = (value: Plain): value is Record<string, Plain> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const setDeep = (target: Record<string, Plain>, key: string, value: Plain) => {
  const levels = key.split('.');
  const last = levels.pop() as string;
  let step = target;
  for (const level of levels) {
    step[level] = step[level] || {};
    step = step[level] as Record<string, Plain>;
  }
  step[last] = value;
};

export const unnest = (config: Plain): Plain => {
  if (isObject(config)) {
    const result: Record<string, Plain> = {};
    for (const [key, value] of Object.entries(config)) {
      setDeep(result, key, unnest(value));
    }
    return result;
  }
  if (Array.isArray(config)) {
    return config.map((item) => unnest(item));
  }
  return config;
};
