import { describe, it, expect } from 'vitest';
import { planSetup, planTeardown } from './plan.mjs';

const desired = {
  customDimensions: [
    { parameterName: 'trigger', displayName: 'Generation Trigger' },
    { parameterName: 'gui_version', displayName: 'GUI Version' },
  ],
  customMetrics: [
    {
      parameterName: 'duration_ms',
      displayName: 'Generation Duration MS',
      measurementUnit: 'MILLISECONDS',
    },
  ],
  keyEvents: ['keyboard_generated'],
  retired: {
    customDimensions: ['matrix_zone_names'],
    customMetrics: [],
    keyEvents: ['share_button_clicked'],
  },
  enhancedMeasurement: { streamEnabled: true, pageChangesEnabled: false },
  dataRetention: { eventDataRetention: 'FOURTEEN_MONTHS' },
};

const dimension = (parameterName, displayName, extra = {}) => ({
  name: `properties/1/customDimensions/${parameterName}`,
  parameterName,
  displayName,
  scope: 'EVENT',
  ...extra,
});
const metric = (parameterName, displayName, measurementUnit, extra = {}) => ({
  name: `properties/1/customMetrics/${parameterName}`,
  parameterName,
  displayName,
  measurementUnit,
  scope: 'EVENT',
  ...extra,
});
const keyEvent = (eventName, extra = {}) => ({
  name: `properties/1/keyEvents/${eventName}`,
  eventName,
  deletable: true,
  ...extra,
});

/** A property that already matches `desired` exactly. */
const inSync = () => ({
  customDimensions: [
    dimension('trigger', 'Generation Trigger'),
    dimension('gui_version', 'GUI Version'),
  ],
  customMetrics: [
    metric('duration_ms', 'Generation Duration MS', 'MILLISECONDS'),
  ],
  keyEvents: [keyEvent('keyboard_generated')],
  enhancedMeasurement: { streamEnabled: true },
  dataRetention: { eventDataRetention: 'FOURTEEN_MONTHS' },
});

const kinds = (plan) => plan.actions.map((action) => action.kind);

describe('planSetup', () => {
  it('plans nothing when the property already matches', () => {
    // Arrange
    const current = inSync();

    // Act
    const plan = planSetup({ current, desired });

    // Assert
    expect(plan.actions).toEqual([]);
    expect(plan.warnings).toEqual([]);
  });

  it('creates missing dimensions, metrics and key events', () => {
    // Arrange
    const current = {
      ...inSync(),
      customDimensions: [dimension('gui_version', 'GUI Version')],
      customMetrics: [],
      keyEvents: [],
    };

    // Act
    const plan = planSetup({ current, desired });

    // Assert
    expect(plan.actions).toEqual([
      {
        kind: 'createCustomDimension',
        body: {
          parameterName: 'trigger',
          displayName: 'Generation Trigger',
          scope: 'EVENT',
        },
      },
      {
        kind: 'createCustomMetric',
        body: {
          parameterName: 'duration_ms',
          displayName: 'Generation Duration MS',
          measurementUnit: 'MILLISECONDS',
          scope: 'EVENT',
        },
      },
      {
        kind: 'createKeyEvent',
        body: {
          eventName: 'keyboard_generated',
          countingMethod: 'ONCE_PER_EVENT',
        },
      },
    ]);
  });

  it('updates only the fields that differ', () => {
    // Arrange
    const current = {
      ...inSync(),
      customDimensions: [
        dimension('trigger', 'Old Name'),
        dimension('gui_version', 'GUI Version'),
      ],
      customMetrics: [
        metric('duration_ms', 'Generation Duration MS', 'STANDARD'),
      ],
    };

    // Act
    const plan = planSetup({ current, desired });

    // Assert
    expect(plan.actions).toEqual([
      {
        kind: 'updateCustomDimension',
        name: 'properties/1/customDimensions/trigger',
        body: { displayName: 'Generation Trigger' },
        updateMask: 'displayName',
      },
      {
        kind: 'updateCustomMetric',
        name: 'properties/1/customMetrics/duration_ms',
        body: { measurementUnit: 'MILLISECONDS' },
        updateMask: 'measurementUnit',
      },
    ]);
  });

  it('turns off history-based page views so they do not double count', () => {
    // Arrange
    const current = {
      ...inSync(),
      enhancedMeasurement: { streamEnabled: true, pageChangesEnabled: true },
    };

    // Act
    const plan = planSetup({ current, desired });

    // Assert
    expect(plan.actions).toEqual([
      {
        kind: 'updateEnhancedMeasurement',
        body: { pageChangesEnabled: false },
        updateMask: 'pageChangesEnabled',
      },
    ]);
  });

  it('updates data retention when it differs', () => {
    // Arrange
    const current = {
      ...inSync(),
      dataRetention: { eventDataRetention: 'TWO_MONTHS' },
    };

    // Act
    const plan = planSetup({ current, desired });

    // Assert
    expect(kinds(plan)).toEqual(['updateDataRetention']);
    expect(plan.actions[0].updateMask).toBe('eventDataRetention');
  });

  it('skips stream settings it could not read', () => {
    // Arrange
    const current = { ...inSync(), enhancedMeasurement: null };

    // Act
    const plan = planSetup({ current, desired });

    // Assert
    expect(plan.actions).toEqual([]);
  });

  it('leaves retired registrations alone unless pruning is requested', () => {
    // Arrange
    const current = {
      ...inSync(),
      customDimensions: [
        ...inSync().customDimensions,
        dimension('matrix_zone_names', 'Matrix Zone Names'),
      ],
      keyEvents: [...inSync().keyEvents, keyEvent('share_button_clicked')],
    };

    // Act
    const kept = planSetup({ current, desired });
    const pruned = planSetup({ current, desired, pruneRetired: true });

    // Assert
    expect(kept.actions).toEqual([]);
    expect(kept.warnings).toEqual([
      'Retired custom dimension "matrix_zone_names" is still registered (use --prune-retired to archive it).',
      'Retired key event "share_button_clicked" is still registered (use --prune-retired to delete it).',
    ]);
    expect(pruned.actions).toEqual([
      {
        kind: 'archiveCustomDimension',
        name: 'properties/1/customDimensions/matrix_zone_names',
        label: 'matrix_zone_names',
      },
      {
        kind: 'deleteKeyEvent',
        name: 'properties/1/keyEvents/share_button_clicked',
        label: 'share_button_clicked',
      },
    ]);
  });

  it('warns instead of acting when a parameter is registered as the other type', () => {
    // Arrange
    const current = {
      ...inSync(),
      customDimensions: [dimension('gui_version', 'GUI Version')],
      customMetrics: [
        metric('duration_ms', 'Generation Duration MS', 'MILLISECONDS'),
        metric('trigger', 'Generation Trigger', 'STANDARD'),
      ],
    };

    // Act
    const plan = planSetup({ current, desired });

    // Assert
    expect(plan.actions).toEqual([]);
    expect(plan.warnings).toEqual([
      '"trigger" should be a custom dimension but is registered as a custom metric. Archive the metric in GA, then run setup again.',
    ]);
  });

  it('warns when a dimension has a non-event scope', () => {
    // Arrange
    const current = {
      ...inSync(),
      customDimensions: [
        dimension('trigger', 'Generation Trigger', { scope: 'USER' }),
        dimension('gui_version', 'GUI Version'),
      ],
    };

    // Act
    const plan = planSetup({ current, desired });

    // Assert
    expect(plan.actions).toEqual([]);
    expect(plan.warnings).toEqual([
      'Custom dimension "trigger" has scope USER, expected EVENT. Scope cannot be changed; archive it and run setup again.',
    ]);
  });
});

describe('planTeardown', () => {
  it('archives and deletes only the registrations this config manages', () => {
    // Arrange
    const current = {
      ...inSync(),
      customDimensions: [
        ...inSync().customDimensions,
        dimension('matrix_zone_names', 'Matrix Zone Names'),
        dimension('someone_elses', 'Unmanaged'),
      ],
      keyEvents: [
        keyEvent('keyboard_generated'),
        keyEvent('share_button_clicked'),
        keyEvent('purchase', { deletable: false }),
      ],
    };

    // Act
    const plan = planTeardown({ current, desired });

    // Assert
    expect(plan.actions).toEqual([
      {
        kind: 'archiveCustomDimension',
        name: 'properties/1/customDimensions/trigger',
        label: 'trigger',
      },
      {
        kind: 'archiveCustomDimension',
        name: 'properties/1/customDimensions/gui_version',
        label: 'gui_version',
      },
      {
        kind: 'archiveCustomDimension',
        name: 'properties/1/customDimensions/matrix_zone_names',
        label: 'matrix_zone_names',
      },
      {
        kind: 'archiveCustomMetric',
        name: 'properties/1/customMetrics/duration_ms',
        label: 'duration_ms',
      },
      {
        kind: 'deleteKeyEvent',
        name: 'properties/1/keyEvents/keyboard_generated',
        label: 'keyboard_generated',
      },
      {
        kind: 'deleteKeyEvent',
        name: 'properties/1/keyEvents/share_button_clicked',
        label: 'share_button_clicked',
      },
    ]);
  });

  it('plans nothing on an empty property', () => {
    // Arrange
    const current = { customDimensions: [], customMetrics: [], keyEvents: [] };

    // Act
    const plan = planTeardown({ current, desired });

    // Assert
    expect(plan.actions).toEqual([]);
  });
});
