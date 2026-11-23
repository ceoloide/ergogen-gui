// Tells whether each provider's weekly quota leaves room for new work:
//
//   pnpm queue:quota [--ahead=<points>]
//
// For each provider it prints the percent of the weekly window used, the
// percent of the window elapsed, and a result:
//
// - go: the percent used is at most 25 points above the percent elapsed, or
//   the number of points that --ahead gives;
// - wait: the percent used is further ahead. The line also prints the time,
//   in UTC, at which it turns to go if no more quota is used, and the hours
//   until then;
// - unknown: the quota could not be read, and the line says why.
//
// The percent elapsed is the pace. There is no reserve, so a provider used at
// that pace can spend its whole weekly quota. A weekly limit that a provider
// reports for some of its models gets its own line.
//
// The script uses the sign-in that each tool saved on this machine:
//
// - Claude: Claude Code's sign-in, sent to the Anthropic usage endpoint.
// - Antigravity: the Antigravity sign-in in T3 Code's data folder, sent to the
//   Antigravity quota summary. When its access token has expired, the script
//   gets a new one with the saved refresh credentials and keeps it in memory.
// - Codex: no request; it reads the newest rate limit entry that Codex wrote
//   to its session logs, which can be hours old. The line then shows its age.
//
// Each token goes only to the provider that issued it, and the script never
// prints one. A provider whose tool has no folder in the home directory gets
// no line.
import { existsSync } from 'node:fs';
import { readdir, readFile, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

export type Provider = 'claude' | 'antigravity' | 'codex';

/** One weekly window, as a provider reported it at `readAt`. */
export interface Reading {
  provider: Provider;
  /** The models whose use counts against the window. */
  limit: string;
  usedPercent: number;
  /** Epoch milliseconds, or undefined while the window has not started. */
  resetsAt: number | undefined;
  readAt: number;
}

export type Line = { provider: Provider; limit: string; note: string } & (
  | { result: 'go'; usedPercent: number; elapsedPercent: number }
  | {
      result: 'wait';
      usedPercent: number;
      elapsedPercent: number;
      /** Epoch milliseconds at which the line turns to go. */
      goAt: number;
      waitHours: number;
    }
  | { result: 'unknown' }
);

/** Thrown when a quota cannot be read. Its message is safe to print. */
export class Unreadable extends Error {}

const HOUR_MS = 60 * 60 * 1000;
const WEEK_MS = 7 * 24 * HOUR_MS;
const DEFAULT_POINTS_AHEAD = 25;
const ALL_MODELS = 'all models';
const GEMINI_MODELS = 'Gemini models';

const iso = (epochMs: number) =>
  new Date(epochMs).toISOString().replace(/\.\d{3}Z$/, 'Z');

function age(ms: number): string {
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return hours < 48 ? `${hours} h` : `${Math.floor(hours / 24)} days`;
}

/**
 * Applies the pace rule to a reading at the time `now`: go while the percent
 * used is at most `pointsAhead` points above the percent elapsed.
 */
export function assess(
  reading: Reading,
  now: number,
  pointsAhead: number
): Line {
  const { provider, limit, usedPercent } = reading;
  if (reading.resetsAt !== undefined && reading.resetsAt <= now) {
    return {
      provider,
      limit,
      result: 'unknown',
      note: `the newest reading is from the window that ended ${iso(reading.resetsAt)}`,
    };
  }
  const notes = [
    reading.resetsAt === undefined
      ? 'window not started'
      : `resets ${iso(reading.resetsAt)}`,
  ];
  if (now - reading.readAt >= 60_000) {
    notes.push(`read ${age(now - reading.readAt)} ago`);
  }
  // A window that has not started starts with the next request.
  const resetsAt = reading.resetsAt ?? now + WEEK_MS;
  const windowStart = resetsAt - WEEK_MS;
  const elapsedPercent = Math.max(0, (100 * (now - windowStart)) / WEEK_MS);
  const line = {
    provider,
    limit,
    usedPercent,
    elapsedPercent,
    note: notes.join(', '),
  };
  if (usedPercent - elapsedPercent <= pointsAhead) {
    return { ...line, result: 'go' };
  }
  const paceCatchesUp =
    windowStart + (WEEK_MS * (usedPercent - pointsAhead)) / 100;
  const goAt = Math.ceil(Math.min(paceCatchesUp, resetsAt) / 1000) * 1000;
  return {
    ...line,
    result: 'wait',
    goAt,
    waitHours: Math.ceil((goAt - now) / HOUR_MS),
  };
}

function at(value: unknown, ...path: string[]): unknown {
  for (const key of path) {
    if (typeof value !== 'object' || value === null) return undefined;
    value = (value as Record<string, unknown>)[key];
  }
  return value;
}

const list = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

function instant(value: unknown): number | undefined {
  const epochMs = typeof value === 'string' ? Date.parse(value) : NaN;
  return Number.isFinite(epochMs) ? epochMs : undefined;
}

/**
 * Reads the reply of Anthropic's `api/oauth/usage`: the `seven_day` window
 * for all models, then each weekly limit for one model.
 */
export function claudeReadings(body: unknown, readAt: number): Reading[] {
  const used = at(body, 'seven_day', 'utilization');
  if (typeof used !== 'number') {
    throw new Unreadable('the reply has no seven_day utilization');
  }
  const readings: Reading[] = [
    {
      provider: 'claude',
      limit: ALL_MODELS,
      usedPercent: used,
      resetsAt: instant(at(body, 'seven_day', 'resets_at')),
      readAt,
    },
  ];
  for (const limit of list(at(body, 'limits'))) {
    const model = at(limit, 'scope', 'model', 'display_name');
    const percent = at(limit, 'percent');
    if (
      at(limit, 'kind') === 'weekly_scoped' &&
      typeof model === 'string' &&
      typeof percent === 'number'
    ) {
      readings.push({
        provider: 'claude',
        limit: model,
        usedPercent: percent,
        resetsAt: instant(at(limit, 'resets_at')),
        readAt,
      });
    }
  }
  return readings;
}

/**
 * Reads the reply of Antigravity's `retrieveUserQuotaSummary`: the weekly
 * bucket for Gemini models, then every other weekly bucket under the name of
 * its group of models.
 */
export function antigravityReadings(body: unknown, readAt: number): Reading[] {
  const readings: Reading[] = [];
  for (const group of list(at(body, 'groups'))) {
    for (const bucket of list(at(group, 'buckets'))) {
      const remaining = at(bucket, 'remainingFraction');
      if (
        at(bucket, 'window') !== 'weekly' ||
        at(bucket, 'disabled') === true ||
        typeof remaining !== 'number'
      ) {
        continue;
      }
      const groupName = at(group, 'displayName');
      readings.push({
        provider: 'antigravity',
        limit:
          at(bucket, 'bucketId') === 'gemini-weekly'
            ? GEMINI_MODELS
            : typeof groupName === 'string'
              ? groupName
              : String(at(bucket, 'bucketId')),
        usedPercent: 100 * (1 - Math.min(1, Math.max(0, remaining))),
        resetsAt: instant(at(bucket, 'resetTime')),
        readAt,
      });
    }
  }
  const gemini = readings.filter((reading) => reading.limit === GEMINI_MODELS);
  if (gemini.length === 0) {
    throw new Unreadable('the reply has no weekly bucket for Gemini models');
  }
  return [
    ...gemini,
    ...readings.filter((reading) => reading.limit !== GEMINI_MODELS),
  ];
}

/**
 * Reads the last `rate_limits` entry of a Codex session log, in JSON Lines,
 * and its window of 10080 minutes (one week).
 */
export function codexReading(log: string): Reading | undefined {
  const lines = log.split('\n');
  for (let index = lines.length - 1; index >= 0; index--) {
    if (!lines[index].includes('"rate_limits"')) continue;
    let entry: unknown;
    try {
      entry = JSON.parse(lines[index]);
    } catch {
      continue; // A line that Codex is still writing.
    }
    const limits = at(entry, 'payload', 'rate_limits');
    if (at(limits, 'limit_id') !== 'codex') continue;
    const window = [at(limits, 'primary'), at(limits, 'secondary')].find(
      (candidate) => at(candidate, 'window_minutes') === 10080
    );
    const used = at(window, 'used_percent');
    const resetsAt = at(window, 'resets_at');
    const readAt = instant(at(entry, 'timestamp'));
    if (
      typeof used === 'number' &&
      typeof resetsAt === 'number' &&
      readAt !== undefined
    ) {
      return {
        provider: 'codex',
        limit: ALL_MODELS,
        usedPercent: used,
        resetsAt: resetsAt * 1000,
        readAt,
      };
    }
  }
  return undefined;
}

const home = homedir();
const claudeFolder = join(home, '.claude');
const antigravityFolder = join(home, '.t3/userdata/providers/antigravity');
const codexFolder = join(home, '.codex');

/**
 * Sends a request that carries a credential. It refuses a redirect, because
 * fetch would send the body of a 307 or 308, which can hold the refresh
 * credentials, to the new address.
 */
export async function requestJson(
  url: string,
  init: RequestInit
): Promise<unknown> {
  const { host } = new URL(url);
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      redirect: 'manual',
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new Unreadable(`no reply from ${host}`);
  }
  if (!response.ok) {
    throw new Unreadable(`HTTP ${response.status} from ${host}`);
  }
  try {
    return await response.json();
  } catch {
    throw new Unreadable(`the reply from ${host} is not JSON`);
  }
}

async function readJsonFile(path: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return undefined;
  }
}

async function readClaude(): Promise<Reading[]> {
  const credentials = await readJsonFile(
    join(claudeFolder, '.credentials.json')
  );
  const token = at(credentials, 'claudeAiOauth', 'accessToken');
  if (typeof token !== 'string') {
    throw new Unreadable('no Claude sign-in in ~/.claude/.credentials.json');
  }
  const body = await requestJson('https://api.anthropic.com/api/oauth/usage', {
    headers: {
      Authorization: `Bearer ${token}`,
      'anthropic-beta': 'oauth-2025-04-20',
    },
  });
  return claudeReadings(body, Date.now());
}

async function lastUsedAntigravitySignIn(): Promise<string> {
  let newest: { folder: string; modifiedMs: number } | undefined;
  for (const profile of await readdir(antigravityFolder)) {
    const folder = join(antigravityFolder, profile, 'antigravity-acp');
    const modifiedMs = await stat(folder).then(
      (stats) => stats.mtimeMs,
      () => -1
    );
    if (modifiedMs >= 0 && (!newest || modifiedMs > newest.modifiedMs)) {
      newest = { folder, modifiedMs };
    }
  }
  if (!newest) throw new Unreadable('no Antigravity sign-in in T3 Code');
  return newest.folder;
}

async function readAntigravity(): Promise<Reading[]> {
  const folder = await lastUsedAntigravitySignIn();
  const saved = await readJsonFile(join(folder, 'antigravity-oauth-token'));
  const refresh = await readJsonFile(join(folder, 'acp_token.json'));
  let token = at(saved, 'token', 'access_token');
  const expiresAt = instant(at(saved, 'token', 'expiry'));
  if (
    typeof token !== 'string' ||
    expiresAt === undefined ||
    expiresAt < Date.now() + 60_000
  ) {
    const params = new URLSearchParams({ grant_type: 'refresh_token' });
    for (const key of ['client_id', 'client_secret', 'refresh_token']) {
      const value = at(refresh, key);
      if (typeof value !== 'string') {
        throw new Unreadable('the saved Antigravity sign-in has expired');
      }
      params.set(key, value);
    }
    const reply = await requestJson('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: params,
    });
    token = at(reply, 'access_token');
    if (typeof token !== 'string') {
      throw new Unreadable('Google returned no access token');
    }
  }
  const project = at(refresh, 'project_id');
  const body = await requestJson(
    'https://daily-cloudcode-pa.googleapis.com/v1internal:retrieveUserQuotaSummary',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        // The summary leaves out the Gemini group unless the User-Agent names
        // an Antigravity client of version 2.9 or later, and refuses a request
        // that does not name Antigravity. T3 Code sends this one.
        'User-Agent': `antigravity/hub/2.24.0 (aidev_client; os_type=${process.platform}; arch=${process.arch}; cl=963137146)`,
      },
      body: JSON.stringify(typeof project === 'string' ? { project } : {}),
    }
  );
  return antigravityReadings(body, Date.now());
}

async function readCodex(): Promise<Reading[]> {
  const sessions = join(codexFolder, 'sessions');
  const weekAgo = Date.now() - WEEK_MS;
  const recentLogs: { path: string; modifiedMs: number }[] = [];
  const names = await readdir(sessions, { recursive: true }).catch(() => []);
  for (const name of names) {
    if (!name.endsWith('.jsonl')) continue;
    const path = join(sessions, name);
    const { mtimeMs } = await stat(path);
    if (mtimeMs > weekAgo) recentLogs.push({ path, modifiedMs: mtimeMs });
  }
  recentLogs.sort((a, b) => b.modifiedMs - a.modifiedMs);
  let newest: Reading | undefined;
  for (const log of recentLogs) {
    if (newest && log.modifiedMs < newest.readAt) break;
    const reading = codexReading(await readFile(log.path, 'utf8'));
    if (reading && (!newest || reading.readAt > newest.readAt)) {
      newest = reading;
    }
  }
  if (!newest) {
    throw new Unreadable('no rate limit entry in ~/.codex/sessions this week');
  }
  return [newest];
}

const providers: {
  provider: Provider;
  mainLimit: string;
  folder: string;
  read: () => Promise<Reading[]>;
}[] = [
  {
    provider: 'claude',
    mainLimit: ALL_MODELS,
    folder: claudeFolder,
    read: readClaude,
  },
  {
    provider: 'antigravity',
    mainLimit: GEMINI_MODELS,
    folder: antigravityFolder,
    read: readAntigravity,
  },
  {
    provider: 'codex',
    mainLimit: ALL_MODELS,
    folder: codexFolder,
    read: readCodex,
  },
];

const percent = (value: number) => `${value.toFixed(1)}%`;

function render(lines: Line[]): string {
  const rows = [
    ['provider', 'limit', 'used', 'elapsed', 'result', 'go at', 'note'],
    ...lines.map((line) => [
      line.provider,
      line.limit,
      line.result === 'unknown' ? '-' : percent(line.usedPercent),
      line.result === 'unknown' ? '-' : percent(line.elapsedPercent),
      line.result === 'wait' ? `wait ${line.waitHours}h` : line.result,
      line.result === 'wait' ? iso(line.goAt) : '-',
      line.note,
    ]),
  ];
  const widths = rows[0].map((_, column) =>
    Math.max(...rows.map((row) => row[column].length))
  );
  const numeric = new Set([2, 3]);
  return rows
    .map((row) =>
      row
        .map((cell, column) =>
          column === row.length - 1
            ? cell
            : numeric.has(column)
              ? cell.padStart(widths[column])
              : cell.padEnd(widths[column])
        )
        .join('  ')
    )
    .join('\n');
}

function parsePointsAhead(args: string[]): number {
  const { values } = parseArgs({
    args,
    options: { ahead: { type: 'string' } },
  });
  if (values.ahead === undefined) return DEFAULT_POINTS_AHEAD;
  if (!/^-?\d+(\.\d+)?$/.test(values.ahead)) {
    throw new Error(
      `--ahead takes a number of points, such as --ahead=25, not "${values.ahead}".`
    );
  }
  return Number(values.ahead);
}

async function main(pointsAhead: number) {
  const enabled = providers.filter(({ folder }) => existsSync(folder));
  const lines = await Promise.all(
    enabled.map(async ({ provider, mainLimit, read }): Promise<Line[]> => {
      try {
        const readings = await read();
        const now = Date.now();
        return readings.map((reading) => assess(reading, now, pointsAhead));
      } catch (error) {
        const note =
          error instanceof Unreadable
            ? error.message
            : `failed with ${error instanceof Error ? error.name : 'an error'}`;
        return [{ provider, limit: mainLimit, result: 'unknown', note }];
      }
    })
  );
  console.log(render(lines.flat()));
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  let pointsAhead: number;
  try {
    pointsAhead = parsePointsAhead(process.argv.slice(2));
  } catch (error) {
    console.error(
      `${(error as Error).message}\nUsage: pnpm queue:quota [--ahead=<points>]`
    );
    process.exit(2);
  }
  await main(pointsAhead);
}
