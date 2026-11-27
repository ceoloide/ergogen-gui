// @vitest-environment node
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  countPatterns,
  renderTable,
  summarizeMutation,
  summarizeRounds,
  summarizeUnitTests,
  type Metrics,
  type SourceFile,
} from '../scripts/ci/metrics.mts';
import {
  validationStages,
  type StageRun,
  type ValidationRun,
} from '../scripts/ci/validate.mts';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const file = (path: string, text: string): SourceFile => ({
  path,
  text,
  bytes: Buffer.byteLength(text),
});

// Each file holds a case where measure.sh includes, excludes or counts twice.
const files = [
  file(
    'src/App.tsx',
    "useEffect(() => {}); useEffect(() => {});\nlocalStorage.getItem('a');\nconst color = '#fff';\n"
  ),
  file(
    'src/App.test.tsx',
    "useEffect(() => {});\nscreen.getByTestId('a'); screen.getAllByRole('button');\nconst value: any = 1;\n"
  ),
  file('src/theme/theme.ts', "export const color = '#123456';\n"),
  file('src/examples/big.ts', `${'\n'.repeat(700)}'#abcdef'`),
  file(
    'src/utils/zip.ts',
    `import worker from '../workers/zip';\n${'line\n'.repeat(600)}`
  ),
  file('src/atoms/Header.tsx', "import Dialog from '../molecules/Dialog';\n"),
  file(
    'e2e/app.spec.ts',
    "test('a', () => {});\n  test('b', () => {});\ntest.describe('c', () => {});\n"
  ),
  file('e2e/nested/other.spec.ts', "test('d', () => {});\n"),
  file('DEVELOPMENT.md', '# Development\n\nÄ\n'),
];

describe('pattern counts', () => {
  it('counts as source/measure.sh does', () => {
    // Act
    const counts = countPatterns(files);

    // Assert
    expect(counts).toMatchObject({
      production_files: 5,
      production_lines: 1306,
      files_over_600_lines: 1,
      use_effect: 2,
      local_storage: 1,
      local_storage_files: 1,
      hex_colors_outside_theme: 1,
      by_test_id: 1,
      by_role: 1,
      any_in_tests: 1,
      browser_tests: 2,
      browser_specs: 1,
      layer_inversions: 2,
      development_md_lines: 3,
      development_md_bytes: 18,
    });
  });

  it('gives the same counts whatever order the files come in', () => {
    // Act
    const forward = countPatterns(files);
    const reversed = countPatterns([...files].reverse());

    // Assert
    expect(reversed).toEqual(forward);
  });
});

describe('unit tests', () => {
  it('counts test files, tests and failures from the Vitest report', () => {
    // Arrange
    const xml = readFileSync(
      join(projectRoot, 'tests/ci/reports/unit-load-error.xml'),
      'utf8'
    );

    // Act
    const unitTests = summarizeUnitTests(xml);

    // Assert
    expect(unitTests).toEqual({
      files: 2,
      tests: 2,
      failures: 1,
      errors: 0,
      skipped: 0,
    });
  });
});

describe('stage times', () => {
  it('keeps the median of each stage and of the whole round', () => {
    // Arrange: lint takes 300, 100 and 200 ms, build fails in round 2, and
    // test:unit does not run in round 3.
    const round = (index: number): ValidationRun => ({
      stages: validationStages.map(({ name }): StageRun => {
        const timing = { startMilliseconds: 0, milliseconds: 50 };
        if (name === 'lint') {
          return {
            name,
            result: 'passed',
            ...timing,
            milliseconds: [300, 100, 200][index],
          };
        }
        if (name === 'build' && index === 1) {
          return { name, result: 'failed', reason: 'exit code 1', ...timing };
        }
        if (name === 'test:unit' && index === 2) {
          return {
            name,
            result: 'not run',
            reason: 'build-ergogen did not pass',
          };
        }
        return { name, result: 'passed', ...timing };
      }),
      milliseconds: [400, 500, 900][index],
      stopped: false,
    });

    // Act
    const { stages, totalMilliseconds } = summarizeRounds([0, 1, 2].map(round));

    // Assert
    const stage = (name: string) => stages.find((each) => each.name === name);
    expect(stages.map(({ name }) => name)).toEqual(
      validationStages.map(({ name }) => name)
    );
    expect(stage('lint')).toEqual({
      name: 'lint',
      milliseconds: 200,
      samples: [300, 100, 200],
      passed: true,
    });
    expect(stage('build')?.passed).toBe(false);
    expect(stage('test:unit')).toEqual({
      name: 'test:unit',
      milliseconds: 50,
      samples: [50, 50, 0],
      passed: false,
    });
    expect(totalMilliseconds).toBe(500);
  });
});

describe('mutation score', () => {
  /** A Stryker JSON report with one mutant for each status. */
  const report = (files: Record<string, string[]>) =>
    JSON.stringify({
      schemaVersion: '2',
      thresholds: { high: 80, low: 60 },
      files: Object.fromEntries(
        Object.entries(files).map(([path, statuses]) => [
          path,
          {
            language: 'typescript',
            source: 'export const a = true;\n',
            mutants: statuses.map((status, index) => ({
              id: String(index),
              mutatorName: 'BooleanLiteral',
              replacement: 'false',
              location: {
                start: { line: 1, column: 18 },
                end: { line: 1, column: 22 },
              },
              status,
            })),
          },
        ])
      ),
    });

  it('scores detected mutants against detected and undetected ones, as Stryker does', () => {
    // Arrange: share.ts has 3 detected and 1 undetected mutants, and one of
    // each status that the score leaves out. zip.ts has 1 and 2.
    const json = report({
      'src/utils/share.ts': [
        'Killed',
        'Killed',
        'Timeout',
        'Survived',
        'CompileError',
        'RuntimeError',
        'Ignored',
        'Pending',
      ],
      'src/utils/zip.ts': ['Killed', 'NoCoverage', 'Survived'],
    });

    // Act
    const mutation = summarizeMutation(json);

    // Assert: 4 of 7, 3 of 4 and 1 of 3 detected.
    expect(mutation).toEqual({
      score: 57.14,
      detected: 4,
      undetected: 3,
      files: {
        'src/utils/share.ts': { score: 75, detected: 3, undetected: 1 },
        'src/utils/zip.ts': { score: 33.33, detected: 1, undetected: 2 },
      },
    });
  });

  it('gives no score to a file without a detected or undetected mutant', () => {
    // Act
    const mutation = summarizeMutation(
      report({
        'src/utils/share.ts': ['Killed'],
        'src/utils/zip.ts': ['Ignored', 'CompileError'],
      })
    );

    // Assert
    expect(mutation.score).toBe(100);
    expect(mutation.files['src/utils/zip.ts']).toEqual({
      score: null,
      detected: 0,
      undetected: 0,
    });
  });

  it('fails on a status that the score does not know', () => {
    // Arrange
    const json = report({ 'src/utils/share.ts': ['Killed', 'Equivalent'] });

    // Act and assert
    expect(() => summarizeMutation(json)).toThrow(
      'Unknown mutant status Equivalent'
    );
  });

  it('prints the score in the table, or that none was recorded', () => {
    // Arrange
    const metrics: Metrics = {
      schema: 2,
      commit: 'a'.repeat(40),
      dirty: false,
      counts: countPatterns(files),
      unitTests: null,
      bundle: null,
      mutation: summarizeMutation(
        report({ 'src/utils/share.ts': ['Killed', 'Killed', 'Survived'] })
      ),
      stages: [],
      totalMilliseconds: 0,
      machine: {
        node: 'v24.0.0',
        platform: 'linux',
        cpus: 4,
        cpuModel: 'test',
        loadAverage: 0,
      },
    };

    // Act
    const withScore = renderTable(metrics);
    const withoutScore = renderTable({ ...metrics, mutation: null });

    // Assert
    expect(withScore).toContain(
      '| Mutation score | 66.67%, 1 of 3 mutants undetected |'
    );
    expect(withoutScore).toContain('| Mutation score | not recorded |');
  });
});
