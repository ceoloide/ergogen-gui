import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { gaConfig } from './ga-config.mjs';
import { analyzeConfiguration } from '../../src/utils/configAnalyzer';
import { trackEvent, trackError } from '../../src/utils/analytics';

// Parameters GA4 understands natively, so they need no registration.
const BUILT_IN_PARAMETERS = new Set(['page_location', 'page_path']);

const dimensionNames = gaConfig.customDimensions.map((d) => d.parameterName);
const metricNames = gaConfig.customMetrics.map((m) => m.parameterName);
const registered = new Set([...dimensionNames, ...metricNames]);

const unregistered = (params) =>
  Object.keys(params).filter(
    (key) => !registered.has(key) && !BUILT_IN_PARAMETERS.has(key)
  );

describe('gaConfig', () => {
  it('registers each parameter once, as either a dimension or a metric', () => {
    // Arrange
    const all = [...dimensionNames, ...metricNames];

    // Act
    const duplicates = all.filter((name, index) => all.indexOf(name) !== index);

    // Assert
    expect(duplicates).toEqual([]);
  });

  it('never lists a retired parameter or key event as active', () => {
    // Arrange
    const { retired } = gaConfig;

    // Act
    const revived = [
      ...retired.customDimensions.filter((name) => registered.has(name)),
      ...retired.customMetrics.filter((name) => registered.has(name)),
      ...retired.keyEvents.filter((name) => gaConfig.keyEvents.includes(name)),
    ];

    // Assert
    expect(revived).toEqual([]);
  });

  it('stays within the GA4 standard property limits', () => {
    // Arrange
    const limit = 50;

    // Act
    const counts = [dimensionNames.length, metricNames.length];

    // Assert
    expect(counts[0]).toBeLessThanOrEqual(limit);
    expect(counts[1]).toBeLessThanOrEqual(limit);
    expect(gaConfig.keyEvents.length).toBeLessThanOrEqual(30);
  });

  it('keeps history-based page views off, since the app sends its own', () => {
    // Arrange / Act
    const { pageChangesEnabled } = gaConfig.enhancedMeasurement;

    // Assert
    expect(pageChangesEnabled).toBe(false);
  });

  it('registers every keyboard_generated parameter', () => {
    // Arrange
    const canonical =
      'points:\n  zones:\n    matrix:\n      columns:\n        a:\n      rows:\n        b:\n';

    // Act
    const payload = analyzeConfiguration(canonical, '{}', 10, 'previous');

    // Assert
    expect(unregistered(payload)).toEqual([]);
  });

  describe('parameters added by the analytics helpers', () => {
    let gtag;
    const originalGtag = window.gtag;

    beforeEach(() => {
      // Arrange
      vi.stubEnv('VITE_GTAG_ID', 'G-TEST12345');
      gtag = vi.fn();
      window.gtag = gtag;
    });

    afterEach(() => {
      vi.unstubAllEnvs();
      window.gtag = originalGtag;
    });

    const sentParams = () =>
      gtag.mock.calls
        .filter((call) => call[0] === 'event')
        .map((call) => call[2]);

    it('registers the parameters attached to every event', () => {
      // Act
      trackEvent('any_event', {});

      // Assert
      expect(sentParams()).toHaveLength(1);
      expect(unregistered(sentParams()[0])).toEqual([]);
    });

    it('registers the exception parameters', () => {
      // Act
      trackError(new Error('boom'), true, 'context');

      // Assert
      expect(sentParams()).toHaveLength(1);
      expect(unregistered(sentParams()[0])).toEqual([]);
    });
  });

  it('registers every app setting reported in settings events', () => {
    // Arrange: settings_loaded and setting_changed send these keys.
    const settings = [
      'debug',
      'autoGen',
      'autoGen3D',
      'kicanvasPreview',
      'stlPreview',
      'setting_name',
      'setting_value',
    ];

    // Act
    const missing = settings.filter((name) => !registered.has(name));

    // Assert
    expect(missing).toEqual([]);
  });

  it('registers the parameters of generation, bulk export and upload events', () => {
    // Arrange: payload keys built in ConfigContext, BulkDownloadDialog and Welcome.
    const params = [
      'trigger',
      'duration_ms',
      'points_count',
      'pcbs_count',
      'cases_count',
      'has_outlines',
      'stored_configs_count',
      'error_message',
      'selected_configs_count',
      'completed_configs_count',
      'failed_configs_count',
      'only_configs',
      'file_type',
      'file_size',
    ];

    // Act
    const missing = params.filter((name) => !registered.has(name));

    // Assert
    expect(missing).toEqual([]);
  });
});
