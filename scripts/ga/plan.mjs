/**
 * Pure planning for the GA4 setup and teardown scripts.
 *
 * These functions compare the live property (`current`) with the declared
 * configuration (`desired`, see ga-config.mjs) and return the list of Admin
 * API actions needed. They never call the network, so the decisions can be
 * unit-tested and printed as a dry run before anything is changed.
 */

const EVENT_SCOPE = 'EVENT';

/** Fields we manage on each resource type, compared one by one. */
const DIMENSION_FIELDS = ['displayName', 'description'];
const METRIC_FIELDS = ['displayName', 'description', 'measurementUnit'];

const byParameterName = (items = []) =>
  new Map(items.map((item) => [item.parameterName, item]));

/**
 * Returns the managed fields whose desired value differs from the current one.
 * Fields the config leaves undefined are not managed, so they never cause an
 * update (for example, descriptions written by hand in the GA UI).
 */
const changedFields = (currentItem, desiredItem, fields) =>
  fields.filter(
    (field) =>
      desiredItem[field] !== undefined &&
      desiredItem[field] !== (currentItem[field] ?? '')
  );

const pick = (source, fields) =>
  Object.fromEntries(fields.map((field) => [field, source[field]]));

/**
 * Plans creates and updates for one registration type (dimensions or metrics).
 */
const planDefinitions = ({
  type,
  currentItems,
  otherTypeItems,
  desiredItems,
  fields,
  actions,
  warnings,
}) => {
  const label = type === 'Dimension' ? 'custom dimension' : 'custom metric';
  const otherLabel =
    type === 'Dimension' ? 'custom metric' : 'custom dimension';
  const current = byParameterName(currentItems);
  const otherType = byParameterName(otherTypeItems);

  for (const desiredItem of desiredItems) {
    const { parameterName } = desiredItem;
    const existing = current.get(parameterName);

    if (!existing) {
      if (otherType.has(parameterName)) {
        warnings.push(
          `"${parameterName}" should be a ${label} but is registered as a ${otherLabel}. Archive the ${otherLabel.replace('custom ', '')} in GA, then run setup again.`
        );
        continue;
      }
      actions.push({
        kind: `createCustom${type}`,
        body: { ...desiredItem, scope: EVENT_SCOPE },
      });
      continue;
    }

    if (existing.scope && existing.scope !== EVENT_SCOPE) {
      warnings.push(
        `Custom ${type.toLowerCase()} "${parameterName}" has scope ${existing.scope}, expected ${EVENT_SCOPE}. Scope cannot be changed; archive it and run setup again.`
      );
      continue;
    }

    const changed = changedFields(existing, desiredItem, fields);
    if (changed.length > 0) {
      actions.push({
        kind: `updateCustom${type}`,
        name: existing.name,
        body: pick(desiredItem, changed),
        updateMask: changed.join(','),
      });
    }
  }
};

/**
 * Plans archive actions for retired registrations that are still present.
 * Without pruning, it only warns, because archiving hides the history of a
 * dimension or metric from reports.
 */
const planRetiredDefinitions = ({
  type,
  currentItems,
  retiredNames,
  pruneRetired,
  actions,
  warnings,
}) => {
  const current = byParameterName(currentItems);
  const label = type === 'Dimension' ? 'custom dimension' : 'custom metric';
  for (const parameterName of retiredNames) {
    const existing = current.get(parameterName);
    if (!existing) continue;
    if (pruneRetired) {
      actions.push({
        kind: `archiveCustom${type}`,
        name: existing.name,
        label: parameterName,
      });
    } else {
      warnings.push(
        `Retired ${label} "${parameterName}" is still registered (use --prune-retired to archive it).`
      );
    }
  }
};

/**
 * Plans a settings PATCH (stream or property level) for the fields that differ.
 * Booleans GA omits from its response are treated as false.
 */
const planSettings = (kind, currentSettings, desiredSettings, actions) => {
  if (!currentSettings || !desiredSettings) return;
  const changed = Object.keys(desiredSettings).filter((field) => {
    const desiredValue = desiredSettings[field];
    const currentValue =
      currentSettings[field] ??
      (typeof desiredValue === 'boolean' ? false : undefined);
    return currentValue !== desiredValue;
  });
  if (changed.length > 0) {
    actions.push({
      kind,
      body: pick(desiredSettings, changed),
      updateMask: changed.join(','),
    });
  }
};

/**
 * Plans everything needed to bring the property in line with the config.
 *
 * @param {object} args
 * @param {object} args.current Live state read from the Admin API.
 * @param {object} args.desired The declared configuration.
 * @param {boolean} [args.pruneRetired] Archive or delete retired registrations.
 * @returns {{ actions: object[], warnings: string[] }}
 */
export const planSetup = ({ current, desired, pruneRetired = false }) => {
  const actions = [];
  const warnings = [];
  const retired = desired.retired ?? {};

  planDefinitions({
    type: 'Dimension',
    currentItems: current.customDimensions,
    otherTypeItems: current.customMetrics,
    desiredItems: desired.customDimensions,
    fields: DIMENSION_FIELDS,
    actions,
    warnings,
  });
  planDefinitions({
    type: 'Metric',
    currentItems: current.customMetrics,
    otherTypeItems: current.customDimensions,
    desiredItems: desired.customMetrics,
    fields: METRIC_FIELDS,
    actions,
    warnings,
  });

  const currentKeyEvents = new Map(
    (current.keyEvents ?? []).map((keyEvent) => [keyEvent.eventName, keyEvent])
  );
  for (const eventName of desired.keyEvents) {
    if (!currentKeyEvents.has(eventName)) {
      actions.push({
        kind: 'createKeyEvent',
        body: { eventName, countingMethod: 'ONCE_PER_EVENT' },
      });
    }
  }

  planSettings(
    'updateEnhancedMeasurement',
    current.enhancedMeasurement,
    desired.enhancedMeasurement,
    actions
  );
  planSettings(
    'updateDataRetention',
    current.dataRetention,
    desired.dataRetention,
    actions
  );

  planRetiredDefinitions({
    type: 'Dimension',
    currentItems: current.customDimensions,
    retiredNames: retired.customDimensions ?? [],
    pruneRetired,
    actions,
    warnings,
  });
  planRetiredDefinitions({
    type: 'Metric',
    currentItems: current.customMetrics,
    retiredNames: retired.customMetrics ?? [],
    pruneRetired,
    actions,
    warnings,
  });
  for (const eventName of retired.keyEvents ?? []) {
    const existing = currentKeyEvents.get(eventName);
    if (!existing) continue;
    if (pruneRetired) {
      actions.push({
        kind: 'deleteKeyEvent',
        name: existing.name,
        label: eventName,
      });
    } else {
      warnings.push(
        `Retired key event "${eventName}" is still registered (use --prune-retired to delete it).`
      );
    }
  }

  return { actions, warnings };
};

/**
 * Plans the removal of every registration this config manages, active or
 * retired. Registrations created by hand for other purposes are left alone,
 * and so are key events GA does not allow deleting (such as `purchase`).
 * Stream and retention settings are not reverted.
 *
 * @param {object} args
 * @param {object} args.current Live state read from the Admin API.
 * @param {object} args.desired The declared configuration.
 * @returns {{ actions: object[], warnings: string[] }}
 */
export const planTeardown = ({ current, desired }) => {
  const retired = desired.retired ?? {};
  const managed = (active, retiredNames = []) =>
    new Set([...active, ...retiredNames]);
  const managedDimensions = managed(
    desired.customDimensions.map((item) => item.parameterName),
    retired.customDimensions
  );
  const managedMetrics = managed(
    desired.customMetrics.map((item) => item.parameterName),
    retired.customMetrics
  );
  const managedKeyEvents = managed(desired.keyEvents, retired.keyEvents);

  const actions = [
    ...(current.customDimensions ?? [])
      .filter((item) => managedDimensions.has(item.parameterName))
      .map((item) => ({
        kind: 'archiveCustomDimension',
        name: item.name,
        label: item.parameterName,
      })),
    ...(current.customMetrics ?? [])
      .filter((item) => managedMetrics.has(item.parameterName))
      .map((item) => ({
        kind: 'archiveCustomMetric',
        name: item.name,
        label: item.parameterName,
      })),
    ...(current.keyEvents ?? [])
      .filter(
        (item) =>
          managedKeyEvents.has(item.eventName) && item.deletable !== false
      )
      .map((item) => ({
        kind: 'deleteKeyEvent',
        name: item.name,
        label: item.eventName,
      })),
  ];

  return { actions, warnings: [] };
};
