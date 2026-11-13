/**
 * A deliberately small evaluator for the subset of GitHub Actions expression
 * syntax used by this repository's workflows (`if:` and `concurrency.group`).
 *
 * Supported: string/boolean/null/number literals, dotted context lookups
 * (e.g. `github.ref`, `vars.CNAME_DOMAIN`), `==`, `!=`, `&&`, `||`, `!`,
 * parentheses and `format()`. Anything else throws, so a workflow that starts
 * using unsupported syntax fails the tests loudly instead of being misread.
 *
 * Semantics follow the GitHub docs: `&&`/`||` return operand values, empty
 * strings/0/null/false are falsy and string equality is case-insensitive.
 */

const TOKEN_PATTERN =
  /\s*(?:('(?:[^']|'')*')|(==|!=|&&|\|\||!|\(|\)|,)|([A-Za-z_][\w-]*(?:\.[\w-]+)*)|(\d+(?:\.\d+)?))/y;

const tokenize = (source) => {
  const tokens = [];
  TOKEN_PATTERN.lastIndex = 0;
  while (TOKEN_PATTERN.lastIndex < source.length) {
    if (/^\s*$/.test(source.slice(TOKEN_PATTERN.lastIndex))) break;
    const start = TOKEN_PATTERN.lastIndex;
    const match = TOKEN_PATTERN.exec(source);
    if (!match) {
      throw new Error(
        `Unsupported expression syntax at "${source.slice(start)}" in: ${source}`
      );
    }
    const [, string, operator, identifier, number] = match;
    if (string !== undefined) {
      tokens.push({
        type: 'value',
        value: string.slice(1, -1).replace(/''/g, "'"),
      });
    } else if (operator !== undefined) {
      tokens.push({ type: 'op', value: operator });
    } else if (number !== undefined) {
      tokens.push({ type: 'value', value: Number(number) });
    } else {
      tokens.push({ type: 'identifier', value: identifier });
    }
  }
  return tokens;
};

const isTruthy = (value) =>
  value !== null &&
  value !== undefined &&
  value !== false &&
  value !== '' &&
  value !== 0;

const areEqual = (left, right) => {
  if (typeof left === 'string' && typeof right === 'string') {
    return left.toLowerCase() === right.toLowerCase();
  }
  return (left ?? null) === (right ?? null);
};

const lookup = (path, context) => {
  if (path === 'true') return true;
  if (path === 'false') return false;
  if (path === 'null') return null;
  return path.split('.').reduce((value, key) => value?.[key], context) ?? null;
};

const format = (template, ...args) =>
  String(template).replace(/\{(\d+)\}/g, (_, index) =>
    String(args[Number(index)] ?? '')
  );

/** Evaluates a bare expression such as `github.ref == 'refs/heads/main'`. */
const evaluateBareExpression = (source, context) => {
  const tokens = tokenize(source);
  let position = 0;
  const peek = () => tokens[position];
  const consumeOperator = (value) => {
    const token = peek();
    if (token?.type === 'op' && token.value === value) {
      position += 1;
      return true;
    }
    return false;
  };

  const parsePrimary = () => {
    const token = tokens[position++];
    if (!token) throw new Error(`Unexpected end of expression: ${source}`);
    if (token.type === 'value') return token.value;
    if (token.type === 'op' && token.value === '(') {
      const value = parseOr();
      if (!consumeOperator(')')) throw new Error(`Missing ")" in: ${source}`);
      return value;
    }
    if (token.type === 'op' && token.value === '!')
      return !isTruthy(parsePrimary());
    if (token.type === 'identifier') {
      if (consumeOperator('(')) {
        if (token.value !== 'format') {
          throw new Error(
            `Unsupported function "${token.value}" in: ${source}`
          );
        }
        const args = [];
        if (!consumeOperator(')')) {
          do {
            args.push(parseOr());
          } while (consumeOperator(','));
          if (!consumeOperator(')'))
            throw new Error(`Missing ")" in: ${source}`);
        }
        return format(...args);
      }
      return lookup(token.value, context);
    }
    throw new Error(`Unexpected token "${token.value}" in: ${source}`);
  };

  const parseEquality = () => {
    let value = parsePrimary();
    for (;;) {
      if (consumeOperator('==')) value = areEqual(value, parsePrimary());
      else if (consumeOperator('!=')) value = !areEqual(value, parsePrimary());
      else return value;
    }
  };

  const parseAnd = () => {
    let value = parseEquality();
    while (consumeOperator('&&')) {
      const right = parseEquality();
      value = isTruthy(value) ? right : value;
    }
    return value;
  };

  function parseOr() {
    let value = parseAnd();
    while (consumeOperator('||')) {
      const right = parseAnd();
      value = isTruthy(value) ? value : right;
    }
    return value;
  }

  const result = parseOr();
  if (position !== tokens.length) {
    throw new Error(`Unexpected trailing tokens in: ${source}`);
  }
  return result;
};

const WHOLE_INTERPOLATION = /^\s*\$\{\{((?:(?!\$\{\{)[\s\S])*)\}\}\s*$/;

/**
 * Evaluates a workflow value (e.g. `concurrency.group`): plain strings are
 * literals, a value that is a single `${{ ... }}` keeps the expression's type
 * and anything else is string interpolation.
 */
export const evaluateValue = (source, context) => {
  if (typeof source !== 'string') return source;
  const whole = source.match(WHOLE_INTERPOLATION);
  if (whole) return evaluateBareExpression(whole[1], context);
  return source.replace(/\$\{\{([\s\S]*?)\}\}/g, (_, inner) =>
    String(evaluateBareExpression(inner, context) ?? '')
  );
};

/**
 * Evaluates a job/step `if:`, which may be a bare expression or wrapped in
 * `${{ }}`. An absent condition always runs (when the job's needs succeed).
 */
export const evaluateCondition = (condition, context) => {
  if (condition === undefined) return true;
  if (typeof condition !== 'string') return isTruthy(condition);
  const whole = condition.match(WHOLE_INTERPOLATION);
  return isTruthy(
    evaluateBareExpression(whole ? whole[1] : condition, context)
  );
};
