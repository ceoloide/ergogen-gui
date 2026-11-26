// @vitest-environment node
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';
import { beforeAll, describe, expect, it } from 'vitest';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const KIND_SOURCES = {
  script: 'script in package.json',
  eslint: 'rule that eslint.config.mjs turns on',
  budget: 'key of budgets.json',
  test: 'test file',
} as const;

type Kind = keyof typeof KIND_SOURCES;
type Lookup = Record<Kind, (name: string) => boolean>;
type Row = { line: number; rule: string; check: string };

const isKind = (kind: string): kind is Kind =>
  Object.hasOwn(KIND_SOURCES, kind);

const kindPrefixes = new Intl.ListFormat('en', { type: 'disjunction' }).format(
  Object.keys(KIND_SOURCES).map((kind) => `${kind}:`)
);

const readJson = (file: string): Record<string, unknown> =>
  JSON.parse(readFileSync(join(root, file), 'utf8'));

async function repositoryLookup(): Promise<Lookup> {
  const files = execFileSync(
    'git',
    ['ls-files', '-z', '--cached', '--others', '--exclude-standard'],
    { cwd: root, encoding: 'utf8' }
  )
    .split('\0')
    .filter((file) => file !== '');
  const scripts = readJson('package.json').scripts as Record<string, string>;
  const budgets = readJson('budgets.json');
  const eslint = new ESLint({ cwd: root });
  const rulesOn = new Set<string>();
  for (const file of files) {
    const path = join(root, file);
    if (await eslint.isPathIgnored(path)) continue;
    const { rules = {} } = await eslint.calculateConfigForFile(path);
    for (const [rule, entry] of Object.entries(rules)) {
      const severity = Array.isArray(entry) ? entry[0] : entry;
      if (severity !== 0 && severity !== 'off') rulesOn.add(rule);
    }
  }
  return {
    script: (name) => Object.hasOwn(scripts, name),
    eslint: (name) => rulesOn.has(name),
    budget: (name) => Object.hasOwn(budgets, name),
    test: (name) =>
      files.includes(name) && /\.(test|spec)\.[cm]?[jt]sx?$/.test(name),
  };
}

const cells = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim());

function tableRows(markdown: string): Row[] {
  const lines = markdown.split('\n');
  const header = lines.findIndex(
    (line) => cells(line).join('|') === 'Rule|Check|Status'
  );
  if (header === -1) return [];
  const rows: Row[] = [];
  for (let index = header + 2; lines[index]?.startsWith('|'); index++) {
    const [rule, check] = cells(lines[index]);
    rows.push({ line: index + 1, rule, check });
  }
  return rows;
}

function problems(markdown: string, lookup: Lookup): string[] {
  const rows = tableRows(markdown);
  if (rows.length === 0) {
    return ['AGENTS.md has no row under the header | Rule | Check | Status |.'];
  }
  return rows.flatMap(({ line, rule, check }) => {
    const row = `AGENTS.md:${line} "${rule}"`;
    if (check === 'none') return [];
    if (!/^`[^`]+`(, `[^`]+`)*$/.test(check)) {
      return [
        `${row}: write the Check cell as none, or as check IDs in backticks separated by commas.`,
      ];
    }
    return [...check.matchAll(/`([^`]+)`/g)].flatMap(([, id]) => {
      const colon = id.indexOf(':');
      const kind = id.slice(0, colon);
      if (colon === -1 || !isKind(kind)) {
        return [
          `${row} names ${id}, which is not a check ID. Start it with ${kindPrefixes}.`,
        ];
      }
      return lookup[kind](id.slice(colon + 1))
        ? []
        : [`${row} names ${id}, but no ${KIND_SOURCES[kind]} has that name.`];
    });
  });
}

describe('checks for each rule in AGENTS.md', () => {
  let lookup: Lookup;

  beforeAll(async () => {
    lookup = await repositoryLookup();
  }, 120_000);

  it('finds the check that each ID of the table names', () => {
    const agents = readFileSync(join(root, 'AGENTS.md'), 'utf8');

    expect(problems(agents, lookup)).toEqual([]);
  });

  it('fails for each row that names an unknown check', () => {
    const markdown = [
      '| Rule | Check | Status |',
      '| --- | --- | --- |',
      '| Known | `script:typecheck`, `eslint:import/no-cycle`, `budget:by_test_id`, `test:tests/checked-files.test.ts` | enforced. |',
      '| Unenforced | none | unenforced. |',
      '| Script | `script:no-such-script` | enforced. |',
      '| Lint | `eslint:no-such-rule` | enforced. |',
      '| Budget | `budget:no_such_budget` | enforced. |',
      '| Missing test | `test:tests/no-such.test.ts` | enforced. |',
      '| Not a test | `test:README.md` | enforced. |',
      '| No kind | `lint:budgets` | enforced. |',
      '| Prose | Knip | enforced. |',
    ].join('\n');

    const result = problems(markdown, lookup);

    expect(result).toEqual([
      'AGENTS.md:5 "Script" names script:no-such-script, but no script in package.json has that name.',
      'AGENTS.md:6 "Lint" names eslint:no-such-rule, but no rule that eslint.config.mjs turns on has that name.',
      'AGENTS.md:7 "Budget" names budget:no_such_budget, but no key of budgets.json has that name.',
      'AGENTS.md:8 "Missing test" names test:tests/no-such.test.ts, but no test file has that name.',
      'AGENTS.md:9 "Not a test" names test:README.md, but no test file has that name.',
      'AGENTS.md:10 "No kind" names lint:budgets, which is not a check ID. Start it with script:, eslint:, budget:, or test:.',
      'AGENTS.md:11 "Prose": write the Check cell as none, or as check IDs in backticks separated by commas.',
    ]);
  });

  it('fails when the table is missing', () => {
    const result = problems('# Rules\n\n- A rule.\n', lookup);

    expect(result).toEqual([
      'AGENTS.md has no row under the header | Rule | Check | Status |.',
    ]);
  });
});
