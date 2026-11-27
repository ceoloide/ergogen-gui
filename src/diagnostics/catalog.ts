/**
 * Every code that the app reports with an error. docs/diagnostics.md explains
 * each code, and .agents/skills/ergogen-gui-diagnostics/SKILL.md tells an agent
 * how to repair it. tests/diagnostics-docs.test.ts fails when a code lacks a
 * section in either file.
 */

/** `app` is a defect of the app. `config` is an error in a configuration. */
type DiagnosticKind = 'app' | 'config';

interface DiagnosticEntry {
  kind: DiagnosticKind;
  /** What went wrong. It is sent to analytics, so it holds no user data. */
  message: string;
  /** What the person who reads the console does next. */
  fix: string;
}

export const diagnosticCatalog = {
  GENERATION_WORKER_FAILED: {
    kind: 'app',
    message: 'The generation worker failed to load or threw an uncaught error.',
    fix: 'Reload the page. If the error comes back, report it with this console output.',
  },
  STL_WORKER_FAILED: {
    kind: 'app',
    message:
      'The STL conversion worker failed to load or threw an uncaught error.',
    fix: 'Reload the page. If the error comes back, turn off STL Preview in the settings and report the error with this console output.',
  },
  STL_PREVIEW_FAILED: {
    kind: 'app',
    message: 'The 3D preview of a case failed to render.',
    fix: 'Check that the browser has WebGL turned on. If the error comes back, turn off STL Preview in the settings and report the error with this console output.',
  },
  UNCLASSIFIED: {
    kind: 'app',
    message: 'The app caught an error that has no diagnostic code.',
    fix: 'Report the error with this console output, so that a maintainer can give it a code.',
  },
} as const satisfies Record<string, DiagnosticEntry>;

export type DiagnosticCode = keyof typeof diagnosticCatalog;
