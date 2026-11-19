import { describe, expect, it } from 'vitest';
import { supportedExampleOptions } from '../src/examples/supported';
import { installedEngineVersion } from '../src/utils/engineRequirements';
import type { WorkerResponse } from '../src/workers/ergogen.worker.types';
import { generate } from './engine-contract/corpus/inProcessWorker';

/**
 * Runs with every engine, including a deployment's override engine, where the
 * contract tests in tests/engine-contract/ are left out (see DEVELOPMENT.md,
 * "Deployment engine"). It checks only that the app's worker handler, with the
 * prepared engine, generates every example the site offers with it; the
 * contract tests check what the canonical engine generates.
 *
 * src/setupTests.tsx leaves this file the real installed engine version, so
 * the list below is the one the Welcome page shows on this engine.
 */

const engineVersion = installedEngineVersion();

// The Welcome page also leaves out the empty example, which has nothing to draw.
const offeredExamples = supportedExampleOptions(engineVersion)
  .flatMap((group) => group.options)
  .filter((example) => example.label !== 'Empty YAML configuration');

// The points of a reply, failing with the engine's message if it is an error.
const generatedPoints = (response: WorkerResponse): string[] => {
  if (response.type !== 'success') {
    throw new Error(`Generation failed: ${response.error}`);
  }
  const results = response.results as { points?: Record<string, unknown> };
  return Object.keys(results.points ?? {});
};

describe(`prepared engine ${engineVersion} through the app worker`, () => {
  it('loads and generates a one-key board', async () => {
    // Act
    const response = await generate('points:\n  zones:\n    matrix: {}\n');

    // Assert
    expect(generatedPoints(response)).toEqual(['matrix']);
  }, 20000);

  it.each(offeredExamples.map((example) => [example.label, example] as const))(
    'generates the %s example',
    async (_label, example) => {
      // Act
      const response = await generate(example.value);

      // Assert
      expect(generatedPoints(response).length).toBeGreaterThan(0);
    },
    20000
  );
});
