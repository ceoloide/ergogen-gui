// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createServer, type RequestListener, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import {
  antigravityReadings,
  assess,
  claudeReadings,
  codexReading,
  requestJson,
  Unreadable,
  type Reading,
} from '../scripts/queue/quota.mts';

// Replies in the recorded shapes, with invented numbers and placeholder
// identifiers. Each weekly window resets at `resetsAt` and is 60% used, or 70%
// for a limit on some of the models.
const resetsAt = '2026-01-15T12:00:00Z';
const day = 24 * 60 * 60 * 1000;
const week = 7 * day;
const halfway = Date.parse(resetsAt) - 3.5 * day; // 50% of the week elapsed
const early = Date.parse(resetsAt) - 4.9 * day; // 30% of the week elapsed

const claudeUsage = {
  five_hour: { utilization: 95, resets_at: '2026-01-11T03:00:00Z' },
  seven_day: { utilization: 60, resets_at: resetsAt },
  seven_day_opus: null,
  limits: [
    { kind: 'session', percent: 95, resets_at: '2026-01-11T03:00:00Z' },
    { kind: 'weekly_all', percent: 60, resets_at: resetsAt, scope: null },
    {
      kind: 'weekly_scoped',
      percent: 70,
      resets_at: resetsAt,
      scope: { model: { id: null, display_name: 'Example Model' } },
    },
  ],
};

const antigravitySummary = {
  description: 'Within each group, models share a weekly limit.',
  groups: [
    {
      displayName: 'Gemini Models',
      buckets: [
        {
          bucketId: 'gemini-weekly',
          window: 'weekly',
          resetTime: resetsAt,
          remainingFraction: 0.4,
        },
        {
          bucketId: 'gemini-5h',
          window: '5h',
          resetTime: '2026-01-11T03:00:00Z',
          remainingFraction: 0.05,
        },
      ],
    },
    {
      displayName: 'Claude and GPT models',
      buckets: [
        {
          bucketId: '3p-weekly',
          window: 'weekly',
          resetTime: resetsAt,
          remainingFraction: 0.3,
        },
      ],
    },
  ],
};

const codexLog = (readAt: number, resetsAtMs: number) =>
  [
    {
      timestamp: new Date(readAt - 60 * 60 * 1000).toISOString(),
      type: 'session_meta',
      payload: { id: 'session-placeholder' },
    },
    {
      timestamp: new Date(readAt).toISOString(),
      type: 'event_msg',
      payload: {
        type: 'token_count',
        rate_limits: {
          limit_id: 'codex',
          primary: {
            used_percent: 60,
            window_minutes: 10080,
            resets_at: resetsAtMs / 1000,
          },
          secondary: null,
        },
      },
    },
    {
      timestamp: new Date(readAt + 60 * 1000).toISOString(),
      type: 'response_item',
      payload: { type: 'message' },
    },
  ]
    .map((entry) => JSON.stringify(entry))
    .join('\n');

// At 30% of the week elapsed and 25 points allowed, a window 60% used turns
// to go at 35% of the week, 8.4 hours later. One 70% used turns to go at 45%,
// 25.2 hours later.
const wait60 = { goAt: Date.parse('2026-01-10T22:48:00Z'), waitHours: 9 };
const wait70 = { goAt: Date.parse('2026-01-11T15:36:00Z'), waitHours: 26 };

const readAt = early - 60 * 60 * 1000;
const providers: [
  string,
  () => Reading[],
  [string, number, typeof wait60][],
][] = [
  [
    'Claude',
    () => claudeReadings(claudeUsage, readAt),
    [
      ['all models', 60, wait60],
      ['Example Model', 70, wait70],
    ],
  ],
  [
    'Antigravity',
    () => antigravityReadings(antigravitySummary, readAt),
    [
      ['Gemini models', 60, wait60],
      ['Claude and GPT models', 70, wait70],
    ],
  ],
  [
    'Codex',
    () => [codexReading(codexLog(readAt, Date.parse(resetsAt)))!],
    [['all models', 60, wait60]],
  ],
];

const claudeReading = (usedPercent: number): Reading => ({
  provider: 'claude',
  limit: 'all models',
  usedPercent,
  resetsAt: Date.parse(resetsAt),
  readAt: halfway,
});

describe('the pace rule', () => {
  it.each(providers)(
    'gives %s go up to 25 points ahead of the pace, and wait beyond with the time and hours of the wait',
    (_provider, read, limits) => {
      // Arrange
      const weekly = read();

      // Act
      const atHalfway = weekly.map((reading) => assess(reading, halfway, 25));
      const atEarly = weekly.map((reading) => assess(reading, early, 25));

      // Assert
      expect(atHalfway).toMatchObject(
        limits.map(([limit, usedPercent]) => ({
          limit,
          usedPercent: expect.closeTo(usedPercent, 9),
          elapsedPercent: 50,
          result: 'go',
        }))
      );
      expect(atEarly).toMatchObject(
        limits.map(([limit, usedPercent, wait]) => ({
          limit,
          usedPercent: expect.closeTo(usedPercent, 9),
          elapsedPercent: expect.closeTo(30, 9),
          result: 'wait',
          ...wait,
        }))
      );
    }
  );

  it('compares the exact percents, so 25.4 points ahead is a wait', () => {
    // Act
    const atLimit = assess(claudeReading(75), halfway, 25);
    const beyond = assess(claudeReading(75.4), halfway, 25);

    // Assert
    expect(atLimit).toMatchObject({ result: 'go' });
    expect(beyond).toMatchObject({
      usedPercent: 75.4,
      elapsedPercent: 50,
      result: 'wait',
      goAt: Date.parse('2026-01-12T00:40:20Z'),
      waitHours: 1,
    });
  });

  it('ends a wait at the reset when the pace cannot catch up before it', () => {
    // Act
    const line = assess(claudeReading(100), early, -5);

    // Assert
    expect(line).toMatchObject({
      result: 'wait',
      goAt: Date.parse(resetsAt),
      waitHours: 118,
    });
  });
});

describe('requestJson', () => {
  const servers: Server[] = [];
  afterEach(() => {
    for (const server of servers.splice(0)) server.close();
  });

  async function listen(handler: RequestListener): Promise<string> {
    const server = createServer(handler);
    servers.push(server);
    await new Promise<void>((resolve) =>
      server.listen(0, '127.0.0.1', resolve)
    );
    return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  }

  it.each([301, 302, 307, 308])(
    'refuses a %i redirect to another origin and sends it nothing',
    async (status) => {
      // Arrange
      const received: string[] = [];
      const target = await listen((request, response) => {
        let body = '';
        request.on('data', (chunk: Buffer) => (body += chunk));
        request.on('end', () => {
          received.push(`${request.method} ${body}`);
          response.end('{}');
        });
      });
      const redirect = await listen((_request, response) => {
        response.writeHead(status, { Location: `${target}/token` });
        response.end();
      });
      const request = {
        method: 'POST',
        headers: { Authorization: 'Bearer placeholder' },
        body: 'secret=placeholder',
      };

      // Act
      const reply = requestJson(redirect, request);

      // Assert
      await expect(reply).rejects.toBeInstanceOf(Unreadable);
      expect(received).toEqual([]);
      // A fetch that follows the same redirect does reach the target.
      await fetch(redirect, request);
      expect(received).toHaveLength(1);
    }
  );
});

describe('pnpm queue:quota', () => {
  const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const script = join(projectRoot, 'scripts', 'queue', 'quota.mts');

  // Runs the command in a home folder with one Codex session log, so it reads
  // no saved sign-in and sends no request. The log reads 60% used at 50% of
  // the week elapsed.
  function run(args: string[]) {
    const home = mkdtempSync(join(tmpdir(), 'queue-quota-'));
    const now = Date.now();
    const resetsAtMs = Math.ceil(now / 1000) * 1000 + 3.5 * day;
    const sessions = join(home, '.codex', 'sessions');
    mkdirSync(sessions, { recursive: true });
    writeFileSync(join(sessions, 'rollout.jsonl'), codexLog(now, resetsAtMs));
    const result = spawnSync(process.execPath, [script, ...args], {
      env: { PATH: process.env.PATH, HOME: home },
      encoding: 'utf8',
    });
    rmSync(home, { recursive: true, force: true });
    return { ...result, resetsAtMs };
  }

  const iso = (epochMs: number) =>
    new Date(epochMs).toISOString().replace('.000Z', 'Z');

  it('gives go up to 25 points ahead of the pace by default', () => {
    // Act
    const { status, stdout } = run([]);

    // Assert
    expect(status).toBe(0);
    const lines = stdout.trim().split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[1]).toMatch(
      /^codex\s+all models\s+60\.0%\s+50\.0%\s+go\s+-\s+resets /
    );
  });

  it('takes the allowance from --ahead and prints when a wait ends', () => {
    // Act
    const { status, stdout, resetsAtMs } = run(['--ahead=5']);

    // Assert
    expect(status).toBe(0);
    const windowStart = resetsAtMs - week;
    const goAt = iso(windowStart + 0.55 * week); // 60% used, less 5 points
    expect(stdout.trim().split('\n')[1]).toMatch(
      new RegExp(
        `^codex\\s+all models\\s+60\\.0%\\s+50\\.0%\\s+wait 9h\\s+${goAt}\\s+resets ${iso(resetsAtMs)}$`
      )
    );
  });

  it('rejects an --ahead that is not a number', () => {
    // Act
    const { status, stdout, stderr } = run(['--ahead=five']);

    // Assert
    expect(status).toBe(2);
    expect(stdout).toBe('');
    expect(stderr).toContain('--ahead takes a number of points');
  });
});
