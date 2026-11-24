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
// identifiers. Each weekly window resets at `resetsAt` and is 45% used, or 55%
// for a limit on some of the models.
const resetsAt = '2026-01-15T12:00:00Z';
const day = 24 * 60 * 60 * 1000;
const week = 7 * day;
const halfway = Date.parse(resetsAt) - 3.5 * day; // 50% of the week elapsed
const early = Date.parse(resetsAt) - 4.9 * day; // 30% of the week elapsed

const claudeUsage = {
  five_hour: { utilization: 95, resets_at: '2026-01-11T03:00:00Z' },
  seven_day: { utilization: 45, resets_at: resetsAt },
  seven_day_opus: null,
  limits: [
    { kind: 'session', percent: 95, resets_at: '2026-01-11T03:00:00Z' },
    { kind: 'weekly_all', percent: 45, resets_at: resetsAt, scope: null },
    {
      kind: 'weekly_scoped',
      percent: 55,
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
          remainingFraction: 0.55,
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
          remainingFraction: 0.45,
        },
      ],
    },
  ],
};

const codexLog = (readAt: number, resetsAtMs: number, usedPercent = 45) =>
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
            used_percent: usedPercent,
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

// At 30% of the week elapsed and 10 points allowed, a window 45% used turns
// to go at 35% of the week, 8.4 hours later. One 55% used turns to go at 45%,
// 25.2 hours later.
const wait45 = { goAt: Date.parse('2026-01-10T22:48:00Z'), waitHours: 9 };
const wait55 = { goAt: Date.parse('2026-01-11T15:36:00Z'), waitHours: 26 };

const readAt = early - 60 * 60 * 1000;
const providers: [
  string,
  () => Reading[],
  [string, number, typeof wait45][],
][] = [
  [
    'Claude',
    () => claudeReadings(claudeUsage, readAt),
    [
      ['all models', 45, wait45],
      ['Example Model', 55, wait55],
    ],
  ],
  [
    'Antigravity',
    () => antigravityReadings(antigravitySummary, readAt),
    [
      ['Gemini models', 45, wait45],
      ['Claude and GPT models', 55, wait55],
    ],
  ],
  [
    'Codex',
    () => [codexReading(codexLog(readAt, Date.parse(resetsAt)))!],
    [['all models', 45, wait45]],
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
    'gives %s go up to 10 points ahead of the pace, and wait beyond with the time and hours of the wait',
    (_provider, read, limits) => {
      // Arrange
      const weekly = read();

      // Act
      const atHalfway = weekly.map((reading) => assess(reading, halfway, 10));
      const atEarly = weekly.map((reading) => assess(reading, early, 10));

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

  it('compares the exact percents, so 10.4 points ahead is a wait', () => {
    // Act
    const atLimit = assess(claudeReading(60), halfway, 10);
    const beyond = assess(claudeReading(60.4), halfway, 10);

    // Assert
    expect(atLimit).toMatchObject({ result: 'go' });
    expect(beyond).toMatchObject({
      usedPercent: 60.4,
      elapsedPercent: 50,
      result: 'wait',
      goAt: Date.parse('2026-01-12T00:40:20Z'),
      waitHours: 1,
    });
  });

  it('gives go at exactly the allowance, despite floating-point error', () => {
    // Arrange: 100 * (1 - 0.7) is 30.000000000000004, at 20% of the week.
    const now = Date.parse(resetsAt) - 0.8 * week;
    const [gemini] = antigravityReadings(
      {
        groups: [
          {
            buckets: [
              {
                bucketId: 'gemini-weekly',
                window: 'weekly',
                resetTime: resetsAt,
                remainingFraction: 0.7,
              },
            ],
          },
        ],
      },
      now
    );

    // Act
    const line = assess(gemini, now, 10);

    // Assert
    expect(line).toMatchObject({ elapsedPercent: 20, result: 'go' });
  });

  it('gives unknown under its own limit to a reading from a window that has ended', () => {
    // Arrange
    const endedBeforeHalfway = '2026-01-08T12:00:00Z';
    const readings = claudeReadings(
      {
        ...claudeUsage,
        limits: [
          {
            kind: 'weekly_scoped',
            percent: 70,
            resets_at: endedBeforeHalfway,
            scope: { model: { id: null, display_name: 'Example Model' } },
          },
        ],
      },
      halfway
    );

    // Act
    const lines = readings.map((reading) => assess(reading, halfway, 10));

    // Assert
    expect(lines).toEqual([
      expect.objectContaining({ limit: 'all models', result: 'go' }),
      {
        provider: 'claude',
        limit: 'Example Model',
        result: 'unknown',
        note: `the newest reading is from the window that ended ${endedBeforeHalfway}`,
      },
    ]);
  });

  it.each(['2026-01-15T12:00:00Z', '2026-01-15T11:59:59.500Z'])(
    'ends a wait at the reset %s when the pace cannot catch up before it',
    (reset) => {
      // Act
      const line = assess(
        { ...claudeReading(100), resetsAt: Date.parse(reset) },
        early,
        -5
      );

      // Assert
      expect(line).toMatchObject({
        result: 'wait',
        goAt: Date.parse(reset),
        waitHours: 118,
      });
    }
  );
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
  // no saved sign-in and sends no request. The log reads `usedPercent` at 50%
  // of the week elapsed.
  function run(args: string[], usedPercent = 60, emptyFolders: string[] = []) {
    const home = mkdtempSync(join(tmpdir(), 'queue-quota-'));
    const now = Date.now();
    const resetsAtMs = Math.ceil(now / 1000) * 1000 + 3.5 * day;
    const sessions = join(home, '.codex', 'sessions');
    mkdirSync(sessions, { recursive: true });
    for (const folder of emptyFolders) {
      mkdirSync(join(home, folder), { recursive: true });
    }
    writeFileSync(
      join(sessions, 'rollout.jsonl'),
      codexLog(now, resetsAtMs, usedPercent)
    );
    const result = spawnSync(process.execPath, [script, ...args], {
      env: { PATH: process.env.PATH, HOME: home },
      encoding: 'utf8',
    });
    rmSync(home, { recursive: true, force: true });
    return { ...result, resetsAtMs };
  }

  const iso = (epochMs: number) =>
    new Date(epochMs).toISOString().replace('.000Z', 'Z');

  it('gives go up to 10 points ahead of the pace by default', () => {
    // Act
    const { status, stdout } = run([], 59.9);

    // Assert
    expect(status).toBe(0);
    const lines = stdout.trim().split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[1]).toMatch(
      /^codex\s+all models\s+59\.9%\s+50\.0%\s+go\s+-\s+resets /
    );
  });

  // The wait ends when the pace catches up to the percent used less the
  // allowance, rounded up to the second. At 65% used, that is 55% of the week.
  // A default of 10.00001 moves the pace 60 ms earlier and 9.99999 moves it 60
  // ms later, so one used percent cannot tell both apart. The first value
  // sits on a whole second and catches a default below 10. The second sits
  // 30 ms past it and catches a default above 10.
  it.each([
    ['exactly on a second', 65, 0],
    ['30 ms past a second', 65.000005, 1000],
  ])(
    'takes 10 points as the default allowance with the wait ending %s',
    (_position, usedPercent, roundUpMs) => {
      // Act
      const { status, stdout, resetsAtMs } = run([], usedPercent);

      // Assert
      expect(status).toBe(0);
      const windowStart = resetsAtMs - week;
      const goAt = iso(windowStart + (55 * week) / 100 + roundUpMs);
      expect(stdout.trim().split('\n')[1]).toMatch(
        new RegExp(
          `^codex\\s+all models\\s+65\\.0%\\s+50\\.0%\\s+wait 9h\\s+${goAt}\\s+resets ${iso(resetsAtMs)}$`
        )
      );
    }
  );

  it('prints one unknown line for all models of a provider whose read fails', () => {
    // Arrange
    const foldersWithoutSignIn = [
      '.claude',
      '.t3/userdata/providers/antigravity',
    ];

    // Act
    const { status, stdout } = run([], 55, foldersWithoutSignIn);

    // Assert
    expect(status).toBe(0);
    const lines = stdout.trim().split('\n');
    expect(lines).toHaveLength(4);
    expect(lines[1]).toMatch(
      /^claude\s+all models\s+-\s+-\s+unknown\s+-\s+no Claude sign-in in ~\/\.claude\/\.credentials\.json$/
    );
    expect(lines[2]).toMatch(
      /^antigravity\s+all models\s+-\s+-\s+unknown\s+-\s+no Antigravity sign-in in T3 Code$/
    );
    expect(lines[3]).toMatch(/^codex\s+all models\s+55\.0%\s+50\.0%\s+go\s/);
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

  // Each argument holds the escape sequence that clears a terminal.
  it.each(['--ahead=\u001b[2Jfive', '--\u001b[2J', '\u001b[2J'])(
    'rejects the argument %j without printing it',
    (argument) => {
      // Act
      const { status, stdout, stderr } = run([argument]);

      // Assert
      expect(status).toBe(2);
      expect(stdout).toBe('');
      expect(stderr).toContain('--ahead takes a number of points');
      expect(stderr).not.toContain('\u001b');
    }
  );
});
