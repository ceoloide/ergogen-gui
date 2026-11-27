import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { stripVTControlCharacters } from 'node:util';
import type { Page } from '@playwright/test';
import { test as base, expect } from '../fixtures';
import { ReadinessLog } from '../utils/readiness';
import type { JourneyResult, StepProof } from '../../scripts/verify/proof.mts';

/** What scripts/verify/playwright.config.mts gives each journey. */
interface JourneyMetadata {
  buildId: string;
  baseURL: string;
  proofDir: string;
  commit: string;
  dirty: boolean;
}

export interface Journey {
  /**
   * Runs one user action and the check of its result, then saves a
   * screenshot and an ARIA snapshot of the page as the proof of the step.
   */
  step(name: string, body: () => Promise<void>): Promise<void>;
  /** Keeps a value that the journey read from the page in result.json. */
  observe(name: string, value: unknown): void;
}

// A file name for a step, such as `04-choose-generate`.
function stepFileName(index: number, name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
  return `${String(index).padStart(2, '0')}-${slug}`;
}

// Saves `<name>.png` and `<name>.aria.yml` in the folder.
async function capture(page: Page, folder: string, name: string) {
  const screenshot = `${name}.png`;
  const aria = `${name}.aria.yml`;
  await page.screenshot({ path: join(folder, screenshot) });
  writeFileSync(
    join(folder, aria),
    await page.locator('body').ariaSnapshot({ timeout: 5000 })
  );
  return { screenshot, aria };
}

/**
 * A journey is a file e2e/journeys/<feature>.journey.ts with one test that
 * drives one user path through the feature. The `journey` fixture writes the
 * proof of the test to reports/verify/<feature>/, also when the test fails.
 */
export const test = base.extend<{ journey: Journey }>({
  journey: async ({ page }, use, testInfo) => {
    const { proofDir, buildId, baseURL, commit, dirty } = testInfo.project
      .metadata as JourneyMetadata;
    const feature = basename(testInfo.file, '.journey.ts');
    const folder = join(proofDir, feature);
    rmSync(folder, { recursive: true, force: true });
    mkdirSync(folder, { recursive: true });

    const readiness = new ReadinessLog();
    const pageErrors: string[] = [];
    page.on('console', (message) => readiness.record(message.text()));
    page.on('pageerror', (error) => pageErrors.push(error.message));
    const steps: StepProof[] = [];
    // The step that runs now. A closure sets it, so TypeScript must not narrow
    // it to null.
    let running = null as { proof: StepProof; started: number } | null;
    const observed: Record<string, unknown> = {};
    const startedAt = new Date();

    await use({
      step: (name, body) =>
        base.step(name, async () => {
          const started = Date.now();
          const proof: StepProof = { name, status: 'failed', durationMs: 0 };
          steps.push(proof);
          running = { proof, started };
          try {
            await body();
          } finally {
            proof.durationMs = Date.now() - started;
            running = null;
          }
          proof.status = 'passed';
          Object.assign(
            proof,
            await capture(page, folder, stepFileName(steps.length, name))
          );
        }),
      observe: (name, value) => {
        observed[name] = value;
      },
    });

    // A test that timed out stopped inside a step, which stays failed.
    if (running) running.proof.durationMs = Date.now() - running.started;
    const passed = testInfo.status === 'passed';
    let failure: JourneyResult['failure'];
    if (!passed) {
      try {
        failure = await capture(page, folder, 'failed');
      } catch (error) {
        failure = { captureError: String(error) };
      }
    }
    const result: JourneyResult = {
      feature,
      journey: testInfo.title,
      status: passed ? 'passed' : 'failed',
      error: passed
        ? null
        : stripVTControlCharacters(
            testInfo.errors.map((error) => error.message).join('\n\n') ||
              `The journey ended with the status ${testInfo.status}.`
          ),
      commit,
      dirty,
      buildId,
      baseURL,
      startedAt: startedAt.toISOString(),
      finishedAt: new Date().toISOString(),
      steps,
      observed,
      pageErrors,
      readiness: readiness.summary(),
      ...(failure && { failure }),
    };
    writeFileSync(
      join(folder, 'result.json'),
      `${JSON.stringify(result, null, 2)}\n`
    );
  },
});
export { expect };
