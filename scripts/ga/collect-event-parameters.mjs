/**
 * Reads the app's source and lists the event parameters passed to
 * trackEvent() and queueGenerationEvent(), so ga-config.test.mjs can check
 * each one is registered on the GA4 property.
 *
 * Object literals are read directly, including spreads of literals and of
 * conditional expressions. A payload held in a variable cannot be read
 * statically; it must be listed in RESOLVED_ELSEWHERE with the reason it is
 * covered, otherwise it is reported as unresolved.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);
const SOURCE_DIR = path.join(ROOT, 'src');
const TRACKING_FUNCTIONS = new Set(['trackEvent', 'queueGenerationEvent']);

/**
 * Non-literal payloads and why they need no direct check. Keys are
 * `<file>: <expression>`.
 */
const RESOLVED_ELSEWHERE = {
  // queueGenerationEvent() forwards its payload; its call sites are scanned.
  'src/context/ConfigContext.tsx: payload':
    'generation payloads come from scanned queueGenerationEvent() calls, and keyboard_generated from analyzeConfiguration(), checked in ga-config.test.mjs',
  'src/context/ConfigContext.tsx: pendingGeneration.payload':
    'a queued payload from a scanned queueGenerationEvent() call',
};

/** Payload variables whose keys are the members of an interface. */
const INTERFACE_PAYLOADS = {
  'src/context/ConfigContext.tsx: reportedSettings': {
    interfaceName: 'AppSettings',
    // Destructured out before sending, see ConfigContext.tsx.
    omit: ['sendUsageMetrics'],
  },
};

const listSourceFiles = () =>
  fs
    .readdirSync(SOURCE_DIR, { recursive: true })
    .map((file) => path.join(SOURCE_DIR, String(file)))
    .filter(
      (file) =>
        /\.(ts|tsx)$/.test(file) &&
        !/\.test\.(ts|tsx)$/.test(file) &&
        !file.endsWith('.d.ts')
    );

const propertyName = (name) =>
  ts.isIdentifier(name) || ts.isStringLiteral(name) ? name.text : null;

const interfaceMembers = (sourceFile, interfaceName) => {
  let members = null;
  const visit = (node) => {
    if (ts.isInterfaceDeclaration(node) && node.name.text === interfaceName) {
      members = node.members
        .map((member) => propertyName(member.name))
        .filter(Boolean);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return members;
};

/**
 * Returns the parameter keys of a payload expression, adding anything it
 * cannot read to `unresolved`.
 */
const payloadKeys = (expression, context) => {
  const { sourceFile, relativeFile, unresolved } = context;

  if (ts.isParenthesizedExpression(expression)) {
    return payloadKeys(expression.expression, context);
  }
  if (ts.isConditionalExpression(expression)) {
    return [
      ...payloadKeys(expression.whenTrue, context),
      ...payloadKeys(expression.whenFalse, context),
    ];
  }
  if (ts.isObjectLiteralExpression(expression)) {
    return expression.properties.flatMap((property) => {
      if (ts.isSpreadAssignment(property)) {
        return payloadKeys(property.expression, context);
      }
      if (
        ts.isPropertyAssignment(property) ||
        ts.isShorthandPropertyAssignment(property)
      ) {
        const name = propertyName(property.name);
        if (name) return [name];
      }
      unresolved.push(
        `${relativeFile}: computed key ${property.getText(sourceFile)}`
      );
      return [];
    });
  }

  const key = `${relativeFile}: ${expression.getText(sourceFile)}`;
  if (INTERFACE_PAYLOADS[key]) {
    const { interfaceName, omit } = INTERFACE_PAYLOADS[key];
    const members = interfaceMembers(sourceFile, interfaceName);
    if (!members) {
      unresolved.push(`${key} (interface ${interfaceName} not found)`);
      return [];
    }
    return members.filter((member) => !omit.includes(member));
  }
  if (!RESOLVED_ELSEWHERE[key]) unresolved.push(key);
  return [];
};

/**
 * @returns {{ calls: { location: string, keys: string[] }[], unresolved: string[] }}
 */
export const collectEventParameters = () => {
  const calls = [];
  const unresolved = [];

  for (const file of listSourceFiles()) {
    const text = fs.readFileSync(file, 'utf8');
    if (![...TRACKING_FUNCTIONS].some((name) => text.includes(`${name}(`)))
      continue;

    const relativeFile = path.relative(ROOT, file).split(path.sep).join('/');
    const sourceFile = ts.createSourceFile(
      file,
      text,
      ts.ScriptTarget.Latest,
      true
    );
    const context = { sourceFile, relativeFile, unresolved };

    const visit = (node) => {
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        TRACKING_FUNCTIONS.has(node.expression.text)
      ) {
        const payload = node.arguments[1];
        const { line } = sourceFile.getLineAndCharacterOfPosition(
          node.getStart(sourceFile)
        );
        calls.push({
          location: `${relativeFile}:${line + 1}`,
          keys: payload ? payloadKeys(payload, context) : [],
        });
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
  }

  return { calls, unresolved };
};
