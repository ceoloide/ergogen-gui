import { isFeatureEnabled } from './featureFlags';

/**
 * Filter injections list based on feature flags enabled in the application.
 */
export const filterInjectionsByFeatureFlags = (
  injections: string[][] | undefined
): string[][] | undefined => {
  if (!injections || !Array.isArray(injections)) return injections;
  return injections.filter((injection) => {
    if (!Array.isArray(injection) || injection.length !== 3) return true;
    const [type] = injection;
    if (type === 'outline' && !isFeatureEnabled('outlines')) return false;
    if (type === 'template' && !isFeatureEnabled('templates')) return false;
    return true;
  });
};

/**
 * Check if custom outline/template injections are defined but their feature flags are disabled.
 * Returns a warning string if any are skipped, or null otherwise.
 */
export const getSkippedInjectionsWarning = (
  injections: string[][] | undefined
): string | null => {
  if (!injections || !Array.isArray(injections)) return null;
  const hasOutlines = injections.some(
    (i) => Array.isArray(i) && i[0] === 'outline'
  );
  const hasTemplates = injections.some(
    (i) => Array.isArray(i) && i[0] === 'template'
  );
  const outlinesSkipped = hasOutlines && !isFeatureEnabled('outlines');
  const templatesSkipped = hasTemplates && !isFeatureEnabled('templates');

  if (outlinesSkipped || templatesSkipped) {
    const skippedTypes: string[] = [];
    if (outlinesSkipped) skippedTypes.push('outlines');
    if (templatesSkipped) skippedTypes.push('templates');
    return `Custom ${skippedTypes.join(' and ')} were skipped because the respective feature flags are disabled in settings.`;
  }
  return null;
};

/**
 * Scan the parsed configuration object for KiCad 5 footprints and templates.
 * Returns a deprecation warning string if KiCad 5 is found, or null otherwise.
 */
export const checkForDeprecationWarnings = (
  parsedConfig: unknown
): string | null => {
  if (!parsedConfig || typeof parsedConfig !== 'object') return null;
  const configObj = parsedConfig as Record<string, unknown>;
  if (!configObj.pcbs || typeof configObj.pcbs !== 'object') return null;
  const pcbs = configObj.pcbs as Record<
    string,
    { template?: string; footprints?: Record<string, { what?: string }> }
  >;
  for (const pcb of Object.values(pcbs)) {
    if (
      pcb &&
      typeof pcb === 'object' &&
      (!pcb.template || pcb.template === 'kicad5')
    ) {
      const footprints = pcb.footprints;
      if (footprints && typeof footprints === 'object') {
        for (const footprint of Object.values(footprints)) {
          if (
            footprint &&
            typeof footprint === 'object' &&
            typeof footprint.what === 'string' &&
            footprint.what.startsWith('ceoloide')
          ) {
            return 'KiCad 5 is deprecated. Please add "template: kicad8" to your PCB definitions to avoid errors when opening PCB files with KiCad 8 or newer.';
          }
        }
      }
    }
  }
  return null;
};

/**
 * Strip case and PCB structures from the configuration if pointsonly option is enabled.
 */
export const preparePreviewConfig = (
  parsedConfig: unknown,
  pointsonly?: boolean
): unknown => {
  if (parsedConfig && typeof parsedConfig === 'object') {
    const configObj = parsedConfig as Record<string, unknown>;
    if (configObj.points && pointsonly) {
      return {
        ...configObj,
        pcbs: undefined,
        cases: undefined,
      };
    }
    return configObj;
  }
  return parsedConfig;
};
