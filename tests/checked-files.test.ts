// @vitest-environment node
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, matchesGlob, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';
import { getFileInfo } from 'prettier';
import { beforeAll, describe, expect, it } from 'vitest';

/**
 * Each file that Git lists, tracked or untracked and not ignored, must belong
 * to a check or appear in UNCHECKED. The checks answer for themselves: Prettier
 * and ESLint through their APIs, with the ignore files and configuration that
 * `prettier --check .` and `eslint .` use, and ShellCheck through the paths
 * that `pnpm lint:shell` passes to it. The other checks, such as markdownlint
 * and tsc, cover only files that Prettier or ESLint also cover.
 */

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// The files that no check covers, by reason. An entry is a path or a glob for
// matchesGlob from node:path. Its first segment must be a literal name, so no
// entry can match a file in a new top-level folder.
const UNCHECKED: Record<string, readonly string[]> = {
  'Plain text that no check parses': [
    '.gitignore',
    '.markdownlintignore',
    '.node-version',
    '.prettierignore',
    'LICENSE',
    'public/robots.txt',
  ],
  'pnpm writes it': ['pnpm-lock.yaml'],
  'Vendored third-party bundles': ['public/dependencies/*.js'],
  Images: [
    'public/ergogen.png',
    'public/favicon.ico',
    'public/icons/*.png',
    'public/images/changelog/*.png',
    'public/images/examples/*.png',
  ],
  'Keyboard previews that pnpm generate-previews writes': [
    'public/images/previews/*.svg',
  ],
  'JUnit report fixtures, which Prettier cannot parse': [
    'tests/ci/reports/*.xml',
  ],
  'Byte-exact engine fixtures. invalid-syntax.yaml is invalid on purpose': [
    'tests/engine-contract/corpus/*.yaml',
  ],
};

type Coverage = { file: string; checks: readonly string[] };

// The paths and globs that `pnpm lint:shell` passes to ShellCheck. The shell
// expands each glob the way matchesGlob reads it.
function shellCheckPatterns(): string[] {
  const { scripts } = JSON.parse(
    readFileSync(join(root, 'package.json'), 'utf8')
  ) as { scripts: Record<string, string> };
  const script = scripts['lint:shell'];
  const [command, ...patterns] = script.split(' ');
  if (
    command !== 'shellcheck' ||
    patterns.some((pattern) => !/^[\w./*-]+$/.test(pattern))
  ) {
    throw new Error(
      `lint:shell must be "shellcheck" followed by paths and globs, not "${script}".`
    );
  }
  return patterns;
}

// Returns a function that names the checks that cover a file, given its path
// from the repository root. The file need not exist.
async function coverageLookup(): Promise<(file: string) => Promise<Coverage>> {
  const eslint = new ESLint({ cwd: root });
  const ignorePath = [join(root, '.gitignore'), join(root, '.prettierignore')];
  const shellPatterns = shellCheckPatterns();
  return async (file) => {
    const absolute = join(root, file);
    const checks: string[] = [];
    const prettier = await getFileInfo(absolute, { ignorePath });
    if (!prettier.ignored && prettier.inferredParser !== null) {
      checks.push('Prettier');
    }
    // True both for an ignored file and for one that no configuration matches.
    if (!(await eslint.isPathIgnored(absolute))) checks.push('ESLint');
    if (shellPatterns.some((pattern) => matchesGlob(file, pattern))) {
      checks.push('ShellCheck');
    }
    return { file, checks };
  };
}

// Each way the files and the unchecked entries disagree, as one message.
function problems(
  coverage: readonly Coverage[],
  unchecked: Record<string, readonly string[]>
): string[] {
  const entries = Object.values(unchecked).flat();
  return [
    ...entries
      .filter((entry) => !/^[\w.-]+$/.test(entry.split('/')[0]))
      .map(
        (entry) =>
          `${entry}: an UNCHECKED entry must start with a literal folder or file name.`
      ),
    ...entries
      .filter((entry) => !coverage.some(({ file }) => matchesGlob(file, entry)))
      .map((entry) => `${entry}: no file matches this UNCHECKED entry.`),
    ...coverage.flatMap(({ file, checks }) => {
      const matches = entries.filter((entry) => matchesGlob(file, entry));
      if (checks.length === 0 && matches.length === 0) {
        return [
          `${file}: no check covers this file. Make a check cover it, or add it to UNCHECKED in tests/checked-files.test.ts with the reason.`,
        ];
      }
      if (checks.length > 0 && matches.length > 0) {
        return [
          `${file}: ${checks.join(', ')} checks this file, so UNCHECKED must not match it with ${matches.join(', ')}.`,
        ];
      }
      return [];
    }),
  ];
}

describe('checked files', () => {
  let coverageOf: (file: string) => Promise<Coverage>;
  let coverage: Coverage[];

  beforeAll(async () => {
    coverageOf = await coverageLookup();
    const files = execFileSync(
      'git',
      ['ls-files', '-z', '--cached', '--others', '--exclude-standard'],
      { cwd: root, encoding: 'utf8' }
    )
      .split('\0')
      .filter((file) => file !== '');
    coverage = await Promise.all(files.map(coverageOf));
  }, 120_000);

  it('finds each file that Git lists in a check or in UNCHECKED', () => {
    expect(problems(coverage, UNCHECKED)).toEqual([]);
  });

  it('fails for a new file in a new top-level folder until it is classified', async () => {
    const file = 'new-top-level-folder/notes.unknown-extension';
    const withNewFile = [...coverage, await coverageOf(file)];
    const before = problems(coverage, UNCHECKED);

    const unclassified = problems(withNewFile, UNCHECKED);
    const classified = problems(withNewFile, {
      ...UNCHECKED,
      'Notes for a test': [file],
    });

    expect(unclassified).toEqual([
      ...before,
      `${file}: no check covers this file. Make a check cover it, or add it to UNCHECKED in tests/checked-files.test.ts with the reason.`,
    ]);
    expect(classified).toEqual(before);
  });

  it('counts a TypeScript file in a new top-level folder as checked', async () => {
    const file = 'new-top-level-folder/module.ts';

    const result = await coverageOf(file);

    expect(result.checks).toEqual(['Prettier', 'ESLint']);
  });

  it('rejects an entry that matches no file, matches a checked file, or can match a new top-level folder', () => {
    const files: Coverage[] = [
      { file: 'docs/guide.md', checks: ['Prettier'] },
      { file: 'public/logo.png', checks: [] },
    ];

    const result = problems(files, {
      Images: ['public/logo.png', 'public/missing.png', '*/logo.png'],
      Docs: ['docs/guide.md'],
    });

    expect(result).toEqual([
      '*/logo.png: an UNCHECKED entry must start with a literal folder or file name.',
      'public/missing.png: no file matches this UNCHECKED entry.',
      'docs/guide.md: Prettier checks this file, so UNCHECKED must not match it with docs/guide.md.',
    ]);
  });
});
