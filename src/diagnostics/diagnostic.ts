import { diagnosticCatalog, type DiagnosticCode } from './catalog';

/**
 * The place in the app that reports an error. Each name also prefixes the
 * `description` of the `exception` event, so renaming one splits the analytics
 * history of its errors.
 */
export type DiagnosticLocation =
  | 'ergogen_worker'
  | 'jscad_worker'
  | 'canvas_renderer'
  | 'unhandled_error'
  | 'unhandled_rejection';

/**
 * An error that app code throws with a code of the catalog. Its message is the
 * message of the catalog entry. Put any detail in `cause`.
 *
 * A worker cannot send one to the main thread. The structured clone of
 * `postMessage` keeps the message and drops the class and `code`, so a worker
 * sends the code as a separate field of its message.
 */
export class DiagnosticError extends Error {
  readonly code: DiagnosticCode;

  constructor(code: DiagnosticCode, options?: ErrorOptions) {
    super(diagnosticCatalog[code].message, options);
    this.name = 'DiagnosticError';
    this.code = code;
  }
}

const DOCS_URL =
  'https://github.com/ceoloide/ergogen-gui/blob/main/docs/diagnostics.md';
const SKILL_PATH = '.agents/skills/ergogen-gui-diagnostics/SKILL.md';

/**
 * The anchor that GitHub gives the heading of a code: the code in lowercase,
 * with its underscores kept.
 */
export const diagnosticAnchor = (code: DiagnosticCode): string =>
  code.toLowerCase();

/**
 * The console text for an error. The lines are the code and its message, the
 * error's own message when it differs, the location, the fix, the link to the
 * documentation, and last the repair guide for agents.
 */
export const formatDiagnostic = (
  code: DiagnosticCode,
  location: DiagnosticLocation,
  message: string
): string => {
  const entry = diagnosticCatalog[code];
  const anchor = diagnosticAnchor(code);
  return [
    `${code}: ${entry.message}`,
    ...(message === entry.message ? [] : [`Error: ${message}`]),
    `Location: ${location}`,
    `Fix: ${entry.fix}`,
    `Docs: ${DOCS_URL}#${anchor}`,
    `Agents: ${SKILL_PATH}#${anchor}`,
  ].join('\n');
};
