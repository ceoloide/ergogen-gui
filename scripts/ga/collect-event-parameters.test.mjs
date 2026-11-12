import { describe, it, expect } from 'vitest';
import {
  collectFromSource,
  collectEventParameters,
} from './collect-event-parameters.mjs';

const CONTEXT_FILE = 'src/context/ConfigContext.tsx';

const scan = (text, relativeFile = 'src/example.tsx') =>
  collectFromSource({ relativeFile, text });

describe('collectFromSource', () => {
  it('reads literal keys, spreads and conditional spreads', () => {
    // Arrange
    const text = `
      trackEvent('a', { one: 1, two, ...(flag ? { three: 3 } : { four: 4 }) });
    `;

    // Act
    const { calls, unresolved } = scan(text);

    // Assert
    expect(calls.map((call) => call.keys)).toEqual([
      ['one', 'two', 'three', 'four'],
    ]);
    expect(unresolved).toEqual([]);
  });

  it('finds calls written with whitespace before the parenthesis', () => {
    // Arrange
    const text = `trackEvent ('probe', { unregistered_probe: true });`;

    // Act
    const { calls } = scan(text);

    // Assert
    expect(calls.map((call) => call.keys)).toEqual([['unregistered_probe']]);
  });

  it('reports a payload variable that is not an approved forwarding call', () => {
    // Arrange: same variable name as an approved site, different call.
    const text = `
      const payload = { unregistered_probe: true };
      trackEvent('probe', payload);
    `;

    // Act
    const { unresolved } = scan(text, CONTEXT_FILE);

    // Assert
    expect(unresolved).toEqual([
      `${CONTEXT_FILE}: trackEvent('probe', payload)`,
    ]);
  });

  it('accepts the approved forwarding calls only in their own file', () => {
    // Arrange
    const text = `trackEvent(name, payload);`;

    // Act
    const inContext = scan(text, CONTEXT_FILE);
    const elsewhere = scan(text, 'src/other.tsx');

    // Assert
    expect(inContext.unresolved).toEqual([]);
    expect(inContext.usedExemptions).toEqual([
      `${CONTEXT_FILE}: trackEvent(name, payload)`,
    ]);
    expect(elsewhere.unresolved).toEqual([
      'src/other.tsx: trackEvent(name, payload)',
    ]);
  });

  it('resolves the settings payload only for settings events', () => {
    // Arrange
    const text = `
      interface AppSettings { debug: boolean; sendUsageMetrics: boolean; }
      trackEvent('settings_loaded', reportedSettings);
      trackEvent('probe', reportedSettings);
    `;

    // Act
    const { calls, unresolved } = scan(text, CONTEXT_FILE);

    // Assert
    expect(calls[0].keys).toEqual(['debug']);
    expect(unresolved).toEqual([
      `${CONTEXT_FILE}: trackEvent('probe', reportedSettings)`,
    ]);
  });
});

describe('collectEventParameters', () => {
  it('uses every exemption, so stale entries are removed', () => {
    // Act
    const { unusedExemptions } = collectEventParameters();

    // Assert
    expect(unusedExemptions).toEqual([]);
  });
});
