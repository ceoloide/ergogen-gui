/**
 * Reads the app's source and lists the event parameters passed to
 * trackEvent() and queueGenerationEvent(), so ga-config.test.mjs can check
 * each one is registered on the GA4 property.
 *
 * Object literals are read directly, including spreads of literals and of
 * conditional expressions. A payload held in a variable cannot be read
 * statically. It is accepted only at the exact calls listed in
 * FORWARDING_CALLS, or as one of the INTERFACE_PAYLOADS for the listed
 * events; anything else is reported as unresolved and fails the test.
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
 * Exact calls (`<file>: <call>`) that forward a payload built elsewhere, and
 * where that payload is checked. A new call with a variable payload, even
 * with the same variable name, is not covered by these entries.
 */
const FORWARDING_CALLS = {
  'src/context/ConfigContext.tsx: trackEvent(name, payload)':
    'queueGenerationEvent() sending its payload; its call sites are scanned',
  'src/context/ConfigContext.tsx: trackEvent(pendingGeneration.name, pendingGeneration.payload)':
    'a payload queued by a scanned queueGenerationEvent() call',
  "src/context/ConfigContext.tsx: trackEvent('keyboard_generated', payload)":
    'the analyzeConfiguration() result, whose keys ga-config.test.mjs checks',
};

/**
 * Payload variables whose keys are the members of an interface, accepted
 * only in the listed file and events.
 */
const INTERFACE_PAYLOADS = {
  'src/context/ConfigContext.tsx: reportedSettings': {
    events: ['settings_loaded', 'setting_changed'],
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

/** The call as `callee(arg, arg)`, independent of the original formatting. */
const callText = (call, sourceFile) =>
  `${call.expression.getText(sourceFile)}(${call.arguments
    .map((argument) => argument.getText(sourceFile).replace(/\s+/g, ' '))
    .join(', ')})`;

/**
 * Returns the parameter keys of a payload expression, adding anything it
 * cannot read to `unresolved`.
 */
const payloadKeys = (expression, context) => {
  const { sourceFile, relativeFile, call, unresolved, usedExemptions } =
    context;

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

  const eventArgument = call.arguments[0];
  const eventName =
    eventArgument && ts.isStringLiteral(eventArgument)
      ? eventArgument.text
      : null;
  const interfacePayload =
    INTERFACE_PAYLOADS[`${relativeFile}: ${expression.getText(sourceFile)}`];
  if (interfacePayload && interfacePayload.events.includes(eventName)) {
    const { interfaceName, omit } = interfacePayload;
    const members = interfaceMembers(sourceFile, interfaceName);
    if (members) return members.filter((member) => !omit.includes(member));
  }

  const callKey = `${relativeFile}: ${callText(call, sourceFile)}`;
  if (FORWARDING_CALLS[callKey]) {
    usedExemptions.push(callKey);
  } else {
    unresolved.push(callKey);
  }
  return [];
};

/**
 * Scans one source file.
 *
 * @param {{ relativeFile: string, text: string }} source
 * @returns {{ calls: { location: string, keys: string[] }[], unresolved: string[], usedExemptions: string[] }}
 */
export const collectFromSource = ({ relativeFile, text }) => {
  const calls = [];
  const unresolved = [];
  const usedExemptions = [];
  const sourceFile = ts.createSourceFile(
    relativeFile,
    text,
    ts.ScriptTarget.Latest,
    true,
    relativeFile.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );

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
      const context = {
        sourceFile,
        relativeFile,
        call: node,
        unresolved,
        usedExemptions,
      };
      calls.push({
        location: `${relativeFile}:${line + 1}`,
        keys: payload ? payloadKeys(payload, context) : [],
      });
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  return { calls, unresolved, usedExemptions };
};

/**
 * Scans every non-test source file under src/.
 *
 * @returns {{ calls: { location: string, keys: string[] }[], unresolved: string[], unusedExemptions: string[] }}
 */
export const collectEventParameters = () => {
  const calls = [];
  const unresolved = [];
  const used = new Set();

  for (const file of listSourceFiles()) {
    const relativeFile = path.relative(ROOT, file).split(path.sep).join('/');
    const result = collectFromSource({
      relativeFile,
      text: fs.readFileSync(file, 'utf8'),
    });
    calls.push(...result.calls);
    unresolved.push(...result.unresolved);
    result.usedExemptions.forEach((key) => used.add(key));
  }

  const unusedExemptions = Object.keys(FORWARDING_CALLS).filter(
    (key) => !used.has(key)
  );
  return { calls, unresolved, unusedExemptions };
};
