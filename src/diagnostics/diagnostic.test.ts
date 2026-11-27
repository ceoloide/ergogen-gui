import { diagnosticCatalog, type DiagnosticCode } from './catalog';
import { DiagnosticError, formatDiagnostic } from './diagnostic';

describe('DiagnosticError', () => {
  it('keeps its code and takes its message from the catalog', () => {
    // Arrange
    const cause = new Error('WebGL is off');

    // Act
    const error = new DiagnosticError('STL_PREVIEW_FAILED', { cause });

    // Assert
    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe('STL_PREVIEW_FAILED');
    expect(error.message).toBe('The 3D preview of a case failed to render.');
    expect(error.cause).toBe(cause);
  });

  it('accepts only a code of the catalog', () => {
    // Arrange
    const plainString: string = 'UNCLASSIFIED';

    // Act
    // pnpm typecheck fails when a line under @ts-expect-error compiles.
    const misuses = [
      // @ts-expect-error UNKNOWN_CODE is not a code of the catalog.
      () => new DiagnosticError('UNKNOWN_CODE'),
      // @ts-expect-error A plain string is not a DiagnosticCode.
      () => new DiagnosticError(plainString),
    ];

    // Assert
    expect(misuses).toHaveLength(2);
  });
});

describe('diagnostic codes', () => {
  it('fit a GA4 parameter value without a cut', () => {
    // Arrange
    const codes = Object.keys(diagnosticCatalog) as DiagnosticCode[];

    // Act
    const invalid = codes.filter(
      (code) => !/^[A-Z][A-Z0-9_]*$/.test(code) || code.length > 100
    );

    // Assert
    expect(invalid).toEqual([]);
  });
});

describe('formatDiagnostic', () => {
  it('prints the code, the messages, the location, the fix, and both links in order', () => {
    // Arrange
    const code = 'GENERATION_WORKER_FAILED';

    // Act
    const lines = formatDiagnostic(
      code,
      'ergogen_worker',
      'Worker crash'
    ).split('\n');

    // Assert
    expect(lines).toEqual([
      `GENERATION_WORKER_FAILED: ${diagnosticCatalog[code].message}`,
      'Error: Worker crash',
      'Location: ergogen_worker',
      `Fix: ${diagnosticCatalog[code].fix}`,
      'Docs: https://github.com/ceoloide/ergogen-gui/blob/main/docs/diagnostics.md#generation_worker_failed',
      'Agents: .agents/skills/ergogen-gui-diagnostics/SKILL.md#generation_worker_failed',
    ]);
  });

  it('prints the message once when the error has the catalog message', () => {
    // Arrange
    const error = new DiagnosticError('STL_PREVIEW_FAILED');

    // Act
    const lines = formatDiagnostic(
      error.code,
      'canvas_renderer',
      error.message
    ).split('\n');

    // Assert
    expect(lines[0]).toBe(
      'STL_PREVIEW_FAILED: The 3D preview of a case failed to render.'
    );
    expect(lines[1]).toBe('Location: canvas_renderer');
  });
});
