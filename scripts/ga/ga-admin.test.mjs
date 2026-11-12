import { describe, it, expect, afterEach, vi } from 'vitest';
import { parseArgs } from './ga-admin.mjs';

describe('parseArgs', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('defaults to a dry run without pruning', () => {
    // Act
    const options = parseArgs(['setup', '--property', '123']);

    // Assert
    expect(options).toEqual({
      command: 'setup',
      property: '123',
      apply: false,
      pruneRetired: false,
    });
  });

  it('ignores the "--" separator pnpm passes through', () => {
    // Act
    const options = parseArgs([
      'teardown',
      '--',
      '--property',
      '123',
      '--apply',
      '--confirm',
      '123',
    ]);

    // Assert
    expect(options).toMatchObject({
      command: 'teardown',
      property: '123',
      apply: true,
      confirm: '123',
    });
  });

  it('falls back to GA_PROPERTY_ID', () => {
    // Arrange
    vi.stubEnv('GA_PROPERTY_ID', '456');

    // Act
    const options = parseArgs(['setup', '--prune-retired', '--stream', '9']);

    // Assert
    expect(options).toMatchObject({
      property: '456',
      stream: '9',
      pruneRetired: true,
    });
  });

  it('rejects unknown options and missing values', () => {
    // Act / Assert
    expect(() => parseArgs(['setup', '--force'])).toThrow(
      'Unknown option --force.'
    );
    expect(() => parseArgs(['setup', '--property'])).toThrow(
      '--property needs a value.'
    );
    expect(() => parseArgs(['setup', '--property', '--apply'])).toThrow(
      '--property needs a value.'
    );
  });
});
