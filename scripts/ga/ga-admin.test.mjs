import { describe, it, expect, afterEach, vi } from 'vitest';
import { parseArgs, readCurrentState, applyAction } from './ga-admin.mjs';

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

/** A fake Admin API client that records every request. */
const fakeClient = (responses = {}) => {
  const requests = [];
  return {
    requests,
    list: async (path, field) => {
      requests.push(['LIST', path]);
      return responses[field] ?? [];
    },
    call: async (method, path, body) => {
      requests.push([method, path, body]);
      return responses[path] ?? {};
    },
  };
};

const webStream = {
  name: 'properties/1/dataStreams/7',
  type: 'WEB_DATA_STREAM',
  webStreamData: { defaultUri: 'https://example.com' },
};

describe('readCurrentState', () => {
  it('reads registrations, the web stream and retention for setup', async () => {
    // Arrange
    const client = fakeClient({ dataStreams: [webStream] });

    // Act
    const state = await readCurrentState(client, 'properties/1', {
      includeSettings: true,
    });

    // Assert
    expect(state.stream).toEqual(webStream);
    expect(
      client.requests.map(([method, path]) => `${method} ${path}`)
    ).toEqual([
      'LIST v1beta/properties/1/customDimensions',
      'LIST v1beta/properties/1/customMetrics',
      'LIST v1beta/properties/1/keyEvents',
      'LIST v1beta/properties/1/dataStreams',
      'GET v1beta/properties/1/dataRetentionSettings',
      'GET v1alpha/properties/1/dataStreams/7/enhancedMeasurementSettings',
    ]);
  });

  it('reads only registrations for teardown, even with several web streams', async () => {
    // Arrange
    const client = fakeClient({
      dataStreams: [
        webStream,
        { ...webStream, name: 'properties/1/dataStreams/8' },
      ],
    });

    // Act
    const state = await readCurrentState(client, 'properties/1', {
      includeSettings: false,
    });

    // Assert
    expect(state.stream).toBeNull();
    expect(state.enhancedMeasurement).toBeNull();
    expect(state.dataRetention).toBeNull();
    expect(
      client.requests.map(([method, path]) => `${method} ${path}`)
    ).toEqual([
      'LIST v1beta/properties/1/customDimensions',
      'LIST v1beta/properties/1/customMetrics',
      'LIST v1beta/properties/1/keyEvents',
    ]);
  });

  it('asks for --stream when setup finds several web streams', async () => {
    // Arrange
    const client = fakeClient({
      dataStreams: [
        webStream,
        { ...webStream, name: 'properties/1/dataStreams/8' },
      ],
    });

    // Act / Assert
    await expect(
      readCurrentState(client, 'properties/1', { includeSettings: true })
    ).rejects.toThrow('Several web streams found; pass --stream');
  });
});

describe('applyAction', () => {
  const current = { stream: webStream };

  it.each([
    [
      { kind: 'createCustomDimension', body: { parameterName: 'a' } },
      ['POST', 'v1beta/properties/1/customDimensions', { parameterName: 'a' }],
    ],
    [
      { kind: 'createCustomMetric', body: { parameterName: 'b' } },
      ['POST', 'v1beta/properties/1/customMetrics', { parameterName: 'b' }],
    ],
    [
      { kind: 'createKeyEvent', body: { eventName: 'c' } },
      ['POST', 'v1beta/properties/1/keyEvents', { eventName: 'c' }],
    ],
    [
      {
        kind: 'updateCustomDimension',
        name: 'properties/1/customDimensions/9',
        body: { displayName: 'D' },
        updateMask: 'displayName',
      },
      [
        'PATCH',
        'v1beta/properties/1/customDimensions/9?updateMask=displayName',
        { displayName: 'D' },
      ],
    ],
    [
      {
        kind: 'updateCustomMetric',
        name: 'properties/1/customMetrics/9',
        body: { displayName: 'M', measurementUnit: 'STANDARD' },
        updateMask: 'displayName,measurementUnit',
      },
      [
        'PATCH',
        'v1beta/properties/1/customMetrics/9?updateMask=displayName%2CmeasurementUnit',
        { displayName: 'M', measurementUnit: 'STANDARD' },
      ],
    ],
    [
      {
        kind: 'archiveCustomDimension',
        name: 'properties/1/customDimensions/9',
      },
      ['POST', 'v1beta/properties/1/customDimensions/9:archive', {}],
    ],
    [
      { kind: 'archiveCustomMetric', name: 'properties/1/customMetrics/9' },
      ['POST', 'v1beta/properties/1/customMetrics/9:archive', {}],
    ],
    [
      { kind: 'deleteKeyEvent', name: 'properties/1/keyEvents/9' },
      ['DELETE', 'v1beta/properties/1/keyEvents/9', undefined],
    ],
    [
      {
        kind: 'updateEnhancedMeasurement',
        body: { pageChangesEnabled: false },
        updateMask: 'pageChangesEnabled',
      },
      [
        'PATCH',
        'v1alpha/properties/1/dataStreams/7/enhancedMeasurementSettings?updateMask=pageChangesEnabled',
        { pageChangesEnabled: false },
      ],
    ],
    [
      {
        kind: 'updateDataRetention',
        body: { eventDataRetention: 'FOURTEEN_MONTHS' },
        updateMask: 'eventDataRetention',
      },
      [
        'PATCH',
        'v1beta/properties/1/dataRetentionSettings?updateMask=eventDataRetention',
        { eventDataRetention: 'FOURTEEN_MONTHS' },
      ],
    ],
  ])('sends %o as the matching Admin API request', async (action, expected) => {
    // Arrange
    const client = fakeClient();

    // Act
    await applyAction(client, 'properties/1', current, action);

    // Assert
    expect(client.requests).toEqual([expected]);
  });

  it('rejects unknown actions', async () => {
    // Act / Assert
    await expect(
      applyAction(fakeClient(), 'properties/1', current, {
        kind: 'dropProperty',
      })
    ).rejects.toThrow('Unknown action dropProperty');
  });
});
