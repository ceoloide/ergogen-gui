import { describe, expect, it, vi } from 'vitest';
import packageJson from '../../package.json';
import { installedEngineVersion } from '../utils/engineRequirements';
import { getSemverFromErgogenVersion } from '../utils/version';
import { exampleOptions } from './index';
import {
  isExampleSupported,
  requiredEngine,
  supportedExampleOptions,
} from './supported';

const labels = (groups: readonly { options: readonly { label: string }[] }[]) =>
  groups.flatMap((group) => group.options).map((example) => example.label);

const example = (value: string) => ({ label: 'Fixture', value });

describe('example engine requirements', () => {
  it('reads the requirement an example declares in meta.engine', () => {
    // Act / Assert
    expect(requiredEngine(example('meta:\n  engine: 4.3.0\n'))).toBe('4.3.0');
    expect(requiredEngine(example('meta:\n  engine: 4.3\n'))).toBe('4.3');
    expect(requiredEngine(example('points: {}\n'))).toBeUndefined();
    expect(requiredEngine(example(''))).toBeUndefined();
  });

  it('supports an example only on an engine that meets its requirement', () => {
    // Arrange
    const needsNewer = example('meta:\n  engine: 4.3.0\n');
    // Act / Assert
    expect(isExampleSupported(needsNewer, '4.3.0')).toBe(true);
    expect(isExampleSupported(needsNewer, '4.4.1')).toBe(true);
    expect(isExampleSupported(needsNewer, '4.2.1')).toBe(false);
    expect(isExampleSupported(needsNewer, '5.0.0')).toBe(false);
    expect(isExampleSupported(example('points: {}\n'), '4.2.1')).toBe(true);
  });

  it('offers an older engine only the examples it can generate', () => {
    // Act
    const offered = labels(supportedExampleOptions('4.2.1'));
    // Assert
    expect(offered).toContain('Absolem');
    expect(offered).not.toContain('Briefs 56');
    expect(offered).not.toContain('Willy 50');
  });

  it('offers what the engine this build uses can generate by default', () => {
    // Arrange: setupTests fixes the canonical version; ask for an older one.
    vi.mocked(installedEngineVersion).mockReturnValueOnce('4.2.1');
    // Act
    const offered = labels(supportedExampleOptions());
    // Assert
    expect(offered).toContain('Absolem');
    expect(offered).not.toContain('Briefs 56');
  });

  it('offers every example on the canonical engine', () => {
    // Arrange: the engine that package.json pins, whatever is installed now.
    const canonical = getSemverFromErgogenVersion(
      packageJson.dependencies.ergogen
    );
    expect(canonical).not.toBeNull();
    // Act / Assert
    expect(labels(supportedExampleOptions(canonical as string))).toEqual(
      labels(exampleOptions)
    );
  });
});
