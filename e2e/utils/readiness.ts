import os from 'node:os';

/** Machine state: CPU time summed over all CPUs (ms) and the 1-minute load. */
export interface MachineSample {
  cpu: { busy: number; idle: number };
  load: number;
}

export const sampleMachine = (): MachineSample => {
  const cpu = { busy: 0, idle: 0 };
  for (const { times } of os.cpus()) {
    cpu.busy += times.user + times.nice + times.sys + times.irq;
    cpu.idle += times.idle;
  }
  return { cpu, load: os.loadavg()[0] };
};

// The app's own console lines for worker start-up, generation and STL work.
const MILESTONE =
  /^(<-> (Ergogen|JSCAD) worker module starting|<<< Ergogen worker received a message|>>> Ergogen finished in worker|>>> Uncaught error in Ergogen worker|--- (Ergogen|JSCAD) worker error|\[JSCAD Worker\] Converting case)/;
const RECEIVED =
  /^<<< Ergogen worker received a message: .*"requestId":"([^"]+)"/;

/**
 * Records how far the app got and how busy the machine was during a browser
 * test, so that a failure shows whether it waited on a generation that was
 * still running on a saturated machine or on something that never came.
 */
export class ReadinessLog {
  private readonly milestones: [number, string][] = [];
  private received = 0;
  private finished = 0;
  private readonly start: number;
  private readonly before: MachineSample;

  constructor(start = Date.now(), before = sampleMachine()) {
    this.start = start;
    this.before = before;
  }

  record(text: string, at = Date.now()) {
    if (!MILESTONE.test(text)) return;
    const request = RECEIVED.exec(text);
    if (request) this.received += 1;
    if (text.startsWith('>>> Ergogen finished')) this.finished += 1;
    const line = request
      ? `Ergogen worker received ${request[1]}`
      : text.slice(0, 100);
    this.milestones.push([at, line]);
  }

  summary(at = Date.now(), after = sampleMachine(), cpus = os.cpus().length) {
    const busy = after.cpu.busy - this.before.cpu.busy;
    const total = busy + after.cpu.idle - this.before.cpu.idle;
    const share = total > 0 ? `${Math.round((100 * busy) / total)}%` : 'n/a';
    const seconds = (time: number) => ((time - this.start) / 1000).toFixed(1);
    return [
      `Machine during the test: CPU ${share} busy on ${cpus} CPUs, 1-minute load ${this.before.load.toFixed(1)} -> ${after.load.toFixed(1)}.`,
      `Generation requests the Ergogen worker received: ${this.received}, finished: ${this.finished}.`,
      'App worker milestones, in seconds after the page fixture started:',
      ...this.milestones.map(([time, line]) => `  ${seconds(time)} ${line}`),
      `  ${seconds(at)} test ended`,
    ].join('\n');
  }
}
