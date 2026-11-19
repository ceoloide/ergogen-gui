import * as ergogen from 'ergogen';
import { describe, expect, it } from 'vitest';
import { supportedExampleOptions } from '../src/examples/supported';
import { installedEngineVersion } from '../src/utils/engineRequirements';

/**
 * Runs with every engine, including a deployment's override engine, where the
 * contract tests in tests/engine-contract/ are left out (see DEVELOPMENT.md,
 * "Deployment engine"). It checks only that the prepared engine loads and
 * generates every example the site offers with it; the contract tests check
 * what the canonical engine generates.
 *
 * src/setupTests.tsx leaves this file the real installed engine version, so
 * the list below is the one the Welcome page shows on this engine.
 */

const engineVersion = installedEngineVersion();

// The Welcome page also leaves out the empty example, which has nothing to draw.
const offeredExamples = supportedExampleOptions(engineVersion)
  .flatMap((group) => group.options)
  .filter((example) => example.label !== 'Empty YAML configuration');

describe(`prepared engine ${engineVersion}`, () => {
  it('loads and generates a one-key board', async () => {
    // Act
    const output = await ergogen.process(
      { points: { zones: { matrix: {} } } },
      { svg: true }
    );

    // Assert
    expect(Object.keys(output.points)).toEqual(['matrix']);
  });

  it.each(offeredExamples.map((example) => [example.label, example] as const))(
    'generates the %s example',
    async (_label, example) => {
      // Act
      const output = await ergogen.process(example.value, {
        svg: true,
        debug: true,
      });

      // Assert
      expect(Object.keys(output.points ?? {}).length).toBeGreaterThan(0);
    },
    20000
  );
});
