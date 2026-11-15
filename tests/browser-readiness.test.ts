import { describe, expect, it } from 'vitest';
import { ReadinessLog } from '../e2e/utils/readiness';

const machine = (busy: number, idle: number, load: number) => ({
  cpu: { busy, idle },
  load,
});

describe('browser test readiness log', () => {
  it('reports a generation still running on a saturated machine', () => {
    // Arrange: the worker started late and never finished its request
    const log = new ReadinessLog(1000, machine(0, 0, 10.8));
    log.record('Version 1 or legacy configuration detected on load.', 2000);
    log.record('<-> JSCAD worker module starting...', 18_400);
    log.record('<-> Ergogen worker module starting...', 20_400);
    log.record(
      '<<< Ergogen worker received a message: {"type":"generate","inputConfig":"points: {}","requestId":"ergogen-generate-1-1794768228013","options":{}}',
      20_600
    );

    // Act
    const summary = log.summary(31_800, machine(97_000, 3_000, 20.8), 4);

    // Assert
    expect(summary).toBe(
      [
        'Machine during the test: CPU 97% busy on 4 CPUs, 1-minute load 10.8 -> 20.8.',
        'Generation requests the Ergogen worker received: 1, finished: 0.',
        'App worker milestones, in seconds after the page fixture started:',
        '  17.4 <-> JSCAD worker module starting...',
        '  19.4 <-> Ergogen worker module starting...',
        '  19.6 Ergogen worker received ergogen-generate-1-1794768228013',
        '  30.8 test ended',
      ].join('\n')
    );
  });

  it('reports finished generations, worker errors and an idle machine', () => {
    // Arrange
    const log = new ReadinessLog(0, machine(0, 0, 0.5));
    log.record(
      '<<< Ergogen worker received a message: {"requestId":"ergogen-generate-1-1"}',
      1500
    );
    log.record('>>> Ergogen finished in worker', 2500);
    log.record('[JSCAD Worker] Converting case: prototype format stlb', 2600);
    log.record('--- JSCAD worker error: out of memory', 2700);

    // Act
    const summary = log.summary(4000, machine(1000, 3000, 0.4), 4);

    // Assert
    expect(summary.split('\n')).toEqual([
      'Machine during the test: CPU 25% busy on 4 CPUs, 1-minute load 0.5 -> 0.4.',
      'Generation requests the Ergogen worker received: 1, finished: 1.',
      'App worker milestones, in seconds after the page fixture started:',
      '  1.5 Ergogen worker received ergogen-generate-1-1',
      '  2.5 >>> Ergogen finished in worker',
      '  2.6 [JSCAD Worker] Converting case: prototype format stlb',
      '  2.7 --- JSCAD worker error: out of memory',
      '  4.0 test ended',
    ]);
  });
});
