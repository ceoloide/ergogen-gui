// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  antigravityReadings,
  assess,
  claudeReadings,
  codexReading,
  type Reading,
} from '../scripts/queue/quota.mts';

// Replies in the recorded shapes, with invented numbers and placeholder
// identifiers. Each weekly window resets at `resetsAt` and is 60% used, or 70%
// for a limit on some of the models.
const resetsAt = '2026-01-15T12:00:00Z';
const day = 24 * 60 * 60 * 1000;
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

const codexLog = [
  {
    timestamp: '2026-01-10T08:00:00.000Z',
    type: 'session_meta',
    payload: { id: 'session-placeholder' },
  },
  {
    timestamp: '2026-01-10T09:00:00.000Z',
    type: 'event_msg',
    payload: {
      type: 'token_count',
      rate_limits: {
        limit_id: 'codex',
        primary: {
          used_percent: 60,
          window_minutes: 10080,
          resets_at: Date.parse(resetsAt) / 1000,
        },
        secondary: null,
      },
    },
  },
  {
    timestamp: '2026-01-10T09:01:00.000Z',
    type: 'response_item',
    payload: { type: 'message' },
  },
]
  .map((entry) => JSON.stringify(entry))
  .join('\n');

const readAt = early - 60 * 60 * 1000;
const providers: [string, () => Reading[], [string, number][]][] = [
  [
    'Claude',
    () => claudeReadings(claudeUsage, readAt),
    [
      ['all models', 60],
      ['Example Model', 70],
    ],
  ],
  [
    'Antigravity',
    () => antigravityReadings(antigravitySummary, readAt),
    [
      ['Gemini models', 60],
      ['Claude and GPT models', 70],
    ],
  ],
  ['Codex', () => [codexReading(codexLog)!], [['all models', 60]]],
];

describe('pnpm queue:quota', () => {
  it.each(providers)(
    'gives %s go up to 20 points ahead of the pace, and wait beyond',
    (_provider, read, limits) => {
      // Arrange
      const weekly = read();

      // Act
      const atHalfway = weekly.map((reading) => assess(reading, halfway));
      const atEarly = weekly.map((reading) => assess(reading, early));

      // Assert
      expect(atHalfway).toMatchObject(
        limits.map(([limit, usedPercent]) => ({
          limit,
          usedPercent,
          elapsedPercent: 50,
          result: 'go',
        }))
      );
      expect(atEarly).toMatchObject(
        limits.map(([limit, usedPercent]) => ({
          limit,
          usedPercent,
          elapsedPercent: 30,
          result: 'wait',
        }))
      );
    }
  );
});
