// @vitest-environment node
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  countPatterns,
  summarizeRounds,
  summarizeUnitTests,
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
