// @vitest-environment node
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Checks the relative links in every Markdown file that Git lists. Each target
 * file must exist, and a fragment that points into a Markdown file must match
 * one of its headings, using GitHub's anchor rules. External URLs are not
 * fetched.
 */

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Blanks front matter and fenced code blocks, keeping line numbers.
const withoutCodeBlocks = (text: string): string => {
  const lines = text.split('\n');
  let fence: string | undefined;
  return lines
    .map((line, index) => {
      if (index === 0 && line === '---') {
        fence = '---';
        return '';
      }
      if (fence === '---') {
        if (line === '---') fence = undefined;
        return '';
      }
      const marker = /^\s*(`{3,}|~{3,})/.exec(line)?.[1];
      if (fence === undefined) {
        if (marker !== undefined) fence = marker;
        return marker === undefined ? line : '';
      }
      if (
        marker !== undefined &&
        marker[0] === fence[0] &&
        marker.length >= fence.length &&
        /^\s*[`~]+\s*$/.test(line)
      ) {
        fence = undefined;
      }
      return '';
    })
    .join('\n');
};

// Blanks inline code spans, keeping offsets and line breaks.
const withoutInlineCode = (text: string): string =>
  text.replace(/(`+)(?!`)[\s\S]*?(?<!`)\1(?!`)/g, (span) =>
    span.replace(/[^\n]/g, ' ')
  );

// The anchor GitHub gives a heading, before duplicates get a numeric suffix.
const headingSlug = (heading: string): string =>
  heading
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
    .replace(/ /g, '-');

const anchorsOf = (text: string): Set<string> => {
  const anchors = new Set<string>();
  for (const line of withoutCodeBlocks(text).split('\n')) {
    const heading = /^ {0,3}#{1,6}[ \t]+(.*?)(?:[ \t]+#+)?[ \t]*$/.exec(line);
    if (heading === null) continue;
    const base = headingSlug(heading[1]);
    let anchor = base;
    for (let suffix = 1; anchors.has(anchor); suffix += 1) {
      anchor = `${base}-${suffix}`;
    }
    anchors.add(anchor);
  }
  return anchors;
};

const linkPatterns = [
  // Inline links and images: [text](target "title"), with a title in double
  // quotes, single quotes, or parentheses.
  /!?\[(?:[^[\]]|\[[^[\]]*\])*\]\(\s*(<[^>\n]*>|[^\s()]*(?:\([^\s()]*\)[^\s()]*)*)(?:\s+(?:"[^"]*"|'[^']*'|\([^()]*\)))?\s*\)/g,
  // Reference definitions: [label]: target.
  /^ {0,3}\[[^\]\n]+\]:[ \t]*(<[^>\n]*>|\S+)/gm,
];

const linksOf = (text: string): { target: string; line: number }[] => {
  const prose = withoutInlineCode(withoutCodeBlocks(text));
  return linkPatterns.flatMap((pattern) =>
    [...prose.matchAll(pattern)].map((match) => ({
      target: match[1].replace(/^<(.*)>$/, '$1'),
      line: prose.slice(0, match.index).split('\n').length,
    }))
  );
};

/**
 * Returns one line per broken link. `markdown` maps each repository-relative
 * Markdown path to its text, and `exists` reports whether any path exists.
 */
const findBrokenLinks = (
  markdown: Map<string, string>,
  exists: (path: string) => boolean
): string[] => {
  const anchors = new Map<string, Set<string>>();
  const anchorsIn = (path: string, text: string): Set<string> => {
    const known = anchors.get(path) ?? anchorsOf(text);
    anchors.set(path, known);
    return known;
  };
  const problems: string[] = [];
  for (const [file, text] of markdown) {
    for (const { target, line } of linksOf(text)) {
      if (/^[a-z][a-z\d+.-]*:/i.test(target)) continue;
      const hash = target.indexOf('#');
      const path = decodeURI(hash === -1 ? target : target.slice(0, hash));
      const fragment =
        hash === -1 ? undefined : decodeURIComponent(target.slice(hash + 1));
      let resolved = file;
      if (path.startsWith('/')) resolved = posix.normalize(path.slice(1));
      else if (path !== '')
        resolved = posix.normalize(posix.join(posix.dirname(file), path));
      const where = `${file}:${line}: ${target}`;
      if (!exists(resolved)) {
        problems.push(`${where} (no file ${resolved})`);
        continue;
      }
      const targetText = markdown.get(resolved);
      if (
        fragment !== undefined &&
        targetText !== undefined &&
        !anchorsIn(resolved, targetText).has(fragment)
      ) {
        problems.push(`${where} (no heading #${fragment} in ${resolved})`);
      }
    }
  }
  return problems;
};

describe('Markdown links', () => {
  it('reports missing files and headings, and ignores code', () => {
    const markdown = new Map([
      [
        'README.md',
        [
          '# Guide',
          '',
          '## Set up `pnpm` (Linux)',
          '',
          '## Set up `pnpm` (Linux)',
          '',
          'See [setup](#set-up-pnpm-linux), [again](#set-up-pnpm-linux-1),',
          '[the notes](docs/notes.md#first-step), and [license](LICENSE).',
          'Broken: [gone](docs/gone.md), [no heading](docs/notes.md#third).',
          'External: [site](https://example.com/#missing).',
          'Titled: [quoted](docs/gone.md "Title"), [single](docs/gone.md \'Title\'),',
          '[parenthesized](docs/gone.md (Title)).',
          'Ignored: `[code](docs/gone.md)`.',
          '',
          '```markdown',
          '# Not a heading',
          '[code block](docs/gone.md)',
          '```',
        ].join('\n'),
      ],
      [
        'docs/notes.md',
        '# Notes\n\n## First step\n\n[Up](../README.md#guide)\n\n[Self](#nope)\n',
      ],
    ]);
    const others = new Set(['LICENSE']);
    const exists = (path: string) => markdown.has(path) || others.has(path);

    const problems = findBrokenLinks(markdown, exists);

    expect(problems).toEqual([
      'README.md:9: docs/gone.md (no file docs/gone.md)',
      'README.md:9: docs/notes.md#third (no heading #third in docs/notes.md)',
      'README.md:11: docs/gone.md (no file docs/gone.md)',
      'README.md:11: docs/gone.md (no file docs/gone.md)',
      'README.md:12: docs/gone.md (no file docs/gone.md)',
      'docs/notes.md:7: #nope (no heading #nope in docs/notes.md)',
    ]);
  });

  it('finds no broken link in the repository', () => {
    const files = execFileSync(
      'git',
      [
        'ls-files',
        '-z',
        '--cached',
        '--others',
        '--exclude-standard',
        '--',
        '*.md',
      ],
      { cwd: root, encoding: 'utf8' }
    )
      .split('\0')
      .filter((path) => path !== '' && existsSync(join(root, path)));
    const markdown = new Map(
      files.map((path) => [path, readFileSync(join(root, path), 'utf8')])
    );

    const problems = findBrokenLinks(markdown, (path) =>
      existsSync(join(root, path))
    );

    expect(markdown.has('DEVELOPMENT.md')).toBe(true);
    expect(problems).toEqual([]);
  });
});
