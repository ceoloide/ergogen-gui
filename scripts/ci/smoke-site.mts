// Checks that a public site serves a published release. The deploy workflow's
// smoke job runs it after each release or rollback, with a read-only token:
//
//   node scripts/ci/smoke-site.mts --site <dir> --build-id <id> \
//     (--url <base URL> | --owner <owner> [--base <path>])
//
// <dir> holds the published files (the gh-pages commit). Until the timeout, it
// retries until the site serves that build ID, then checks that the base path
// and a client route (through the SPA fallback) serve the release's own bytes,
// as do index.html, 404.html, the service worker, the manifest and every local
// file index.html references. It exits 0 when all checks pass and 1 otherwise.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

/** A client route that only the SPA fallback (404.html) can serve. */
const clientRoute = 'new';

/** Files every release serves, besides those index.html references. */
const releaseFiles = [
  'index.html',
  '404.html',
  'build-id.txt',
  'service-worker.js',
  'manifest.json',
];

/**
 * Where GitHub Pages serves a site: its custom domain (CNAME) if it has one,
 * otherwise the owner's github.io host, below the build's base path.
 */
export function siteUrl(options: {
  cname?: string;
  owner: string;
  base?: string;
}): string {
  const base = options.base || '/';
  if (!base.startsWith('/') || !base.endsWith('/')) {
    throw new Error(`base path must start and end with "/": ${base}`);
  }
  const host =
    options.cname?.trim() || `${options.owner.toLowerCase()}.github.io`;
  return new URL(base, `https://${host}`).href;
}

/**
 * The site's own files that index.html loads, relative to the base path.
 * A same-origin reference outside the base path is a problem: the build was
 * made for another base.
 */
export function referencedFiles(
  indexHtml: string,
  basePath: string
): { files: string[]; problems: string[] } {
  const files = new Set<string>();
  const problems: string[] = [];
  for (const [, reference] of indexHtml.matchAll(
    /\s(?:src|href)=["']([^"']+)["']/g
  )) {
    if (/^[a-z][a-z\d+.-]*:|^\/\//i.test(reference)) continue;
    const path = reference.split(/[?#]/)[0];
    if (!path.startsWith(basePath)) {
      problems.push(`index.html references ${path} outside ${basePath}`);
    } else if (path.length > basePath.length) {
      files.add(decodeURIComponent(path.slice(basePath.length)));
    }
  }
  return { files: [...files].sort(), problems };
}

export interface SmokeOptions {
  /** The published files. */
  site: string;
  /** The base URL of the site, ending in "/". */
  url: string;
  buildId: string;
  timeoutMs: number;
  intervalMs: number;
  log?: (line: string) => void;
}

const metaTag = (buildId: string) =>
  `<meta name="ergogen-build-id" content="${buildId}">`;

/** Checks that do not need the network; their failure is permanent. */
function checkPublishedFiles(site: string, buildId: string): string[] {
  const problems: string[] = [];
  for (const file of releaseFiles) {
    if (!existsSync(join(site, file))) {
      problems.push(`the release has no ${file}`);
    }
  }
  if (problems.length) return problems;
  const id = readFileSync(join(site, 'build-id.txt'), 'utf8').trim();
  if (id !== buildId) {
    problems.push(`the release is build ${id}, not ${buildId}`);
  }
  if (
    !readFileSync(join(site, 'index.html'), 'utf8').includes(metaTag(buildId))
  ) {
    problems.push(`the release's index.html does not name build ${buildId}`);
  }
  return problems;
}

async function checkServedSite(options: SmokeOptions): Promise<string[]> {
  const base = new URL(options.url);
  const fetchFile = async (path: string) => {
    // A query string bypasses CDN caches of an earlier release.
    const url = new URL(path, base);
    url.searchParams.set('release', options.buildId);
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'cache-control': 'no-cache' },
    });
    return {
      url: url.href,
      status: response.status,
      host: new URL(response.url).host,
      body: Buffer.from(await response.arrayBuffer()),
    };
  };

  const buildId = await fetchFile('build-id.txt');
  const served = buildId.body.toString('utf8').trim();
  if (buildId.status !== 200 || served !== options.buildId) {
    return [
      `${buildId.url} returned HTTP ${buildId.status} "${served.slice(0, 80)}", not build ${options.buildId}`,
    ];
  }

  const index = readFileSync(join(options.site, 'index.html'), 'utf8');
  const references = referencedFiles(index, base.pathname);
  const problems = [...references.problems];
  const checks: { path: string; file: string; statuses: number[] }[] = [
    { path: '', file: 'index.html', statuses: [200] },
    // GitHub Pages answers a client route with 404.html and HTTP 404; other
    // static hosts may answer with HTTP 200.
    { path: clientRoute, file: '404.html', statuses: [200, 404] },
    ...[...new Set([...releaseFiles, ...references.files])].map((file) => ({
      path: file,
      file,
      statuses: [200],
    })),
  ];
  for (const check of checks) {
    const local = join(options.site, check.file);
    if (!existsSync(local)) {
      problems.push(
        `index.html references ${check.file}, which the release lacks`
      );
      continue;
    }
    const response = await fetchFile(check.path);
    if (response.host !== base.host) {
      problems.push(`${response.url} was redirected to ${response.host}`);
    } else if (!check.statuses.includes(response.status)) {
      problems.push(`${response.url} returned HTTP ${response.status}`);
    } else if (!response.body.equals(readFileSync(local))) {
      problems.push(
        `${response.url} does not serve the release's ${check.file}`
      );
    }
  }
  return problems;
}

/** Returns the problems that remain at the timeout; none means it passed. */
export async function smokeSite(options: SmokeOptions): Promise<string[]> {
  const log = options.log ?? (() => {});
  const permanent = checkPublishedFiles(options.site, options.buildId);
  if (permanent.length) return permanent;
  const deadline = Date.now() + options.timeoutMs;
  for (;;) {
    let problems: string[];
    try {
      problems = await checkServedSite(options);
    } catch (error) {
      problems = [`could not reach ${options.url}: ${String(error)}`];
    }
    if (!problems.length || Date.now() + options.intervalMs > deadline) {
      return problems;
    }
    log(`Not served yet (${problems[0]}); retrying.`);
    await new Promise((resolve) => setTimeout(resolve, options.intervalMs));
  }
}

async function main() {
  const { values } = parseArgs({
    options: {
      site: { type: 'string' },
      'build-id': { type: 'string' },
      url: { type: 'string' },
      owner: { type: 'string' },
      base: { type: 'string' },
      'timeout-seconds': { type: 'string', default: '600' },
      'interval-seconds': { type: 'string', default: '15' },
    },
  });
  const { site, owner } = values;
  const buildId = values['build-id'];
  if (!site || !buildId || (!values.url && !owner)) {
    console.error(
      'Usage: smoke-site.mts --site <dir> --build-id <id> (--url <base URL> | --owner <owner> [--base <path>])'
    );
    process.exit(2);
  }
  const cnamePath = join(site, 'CNAME');
  const url =
    values.url ??
    siteUrl({
      owner: owner!,
      base: values.base,
      cname: existsSync(cnamePath)
        ? readFileSync(cnamePath, 'utf8')
        : undefined,
    });
  console.log(`Checking that ${url} serves build ${buildId}.`);
  const problems = await smokeSite({
    site,
    url,
    buildId,
    timeoutMs: Number(values['timeout-seconds']) * 1000,
    intervalMs: Number(values['interval-seconds']) * 1000,
    log: (line) => console.log(line),
  });
  for (const problem of problems) console.error(`::error::${problem}`);
  if (problems.length) process.exit(1);
  console.log(`${url} serves build ${buildId}.`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  await main();
}
