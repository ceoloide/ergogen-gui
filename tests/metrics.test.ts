// @vitest-environment node
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  countPatterns,
  stageNames,
  summarizeUnitTests,
  timeStages,
  type SourceFile,
  type StageRun,
} from '../scripts/ci/metrics.mts';

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
  it('times the steps of pnpm validate', () => {
    // Arrange
    const { scripts } = JSON.parse(
      readFileSync(join(projectRoot, 'package.json'), 'utf8')
    ) as { scripts: Record<string, string> };
    const steps = (script: string) =>
      scripts[script].split(' && ').map((step) => step.replace(/^pnpm /, ''));

    // Act
    const validateSteps = steps('validate').flatMap((step) =>
      step === 'validate:fast' ? steps(step) : [step]
    );

    // Assert
    expect(stageNames).toEqual(validateSteps);
  });

  it('runs all stages in each round and keeps the median of each', () => {
    // Arrange
    const calls: string[] = [];
    const lintTimes = [300, 100, 200];
    const run = (name: string, round: number): StageRun => {
      calls.push(`${round} ${name}`);
      return {
        milliseconds: name === 'lint' ? lintTimes[round - 1] : 50,
        exitCode: name === 'build' && round === 2 ? 1 : 0,
      };
    };

    // Act
    const stages = timeStages(3, run);

    // Assert
    expect(calls.slice(0, stageNames.length + 1)).toEqual([
      ...stageNames.map((name) => `1 ${name}`),
      `2 ${stageNames[0]}`,
    ]);
    expect(stages.find(({ name }) => name === 'lint')).toEqual({
      name: 'lint',
      milliseconds: 200,
      samples: [300, 100, 200],
      passed: true,
    });
    expect(stages.find(({ name }) => name === 'build')?.passed).toBe(false);
  });
});
