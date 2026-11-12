/**
 * Declared GA4 configuration for Ergogen Web UI.
 *
 * This is the single source of truth for what the GA4 property must register
 * so the events sent by `src/utils/analytics.ts` show up in reports. Run
 * `pnpm ga:setup` to apply it and `pnpm ga:teardown` to remove it (see
 * DEVELOPMENT.md, "Google Analytics property setup").
 *
 * When the app starts sending a new event parameter, add it here. When it
 * stops sending one, move it to `retired` rather than deleting the line, so
 * setup can warn about (or prune) the stale registration.
 */
export const gaConfig = {
  /** Event-scoped custom dimensions (text values). */
  customDimensions: [
    // Attached to every event by trackEvent()
    { parameterName: 'gui_version', displayName: 'GUI Version' },
    { parameterName: 'ergogen_version', displayName: 'Ergogen Version' },
    { parameterName: 'is_pwa', displayName: 'Is PWA Standalone' },

    // Generation
    { parameterName: 'trigger', displayName: 'Generation Trigger' },
    { parameterName: 'has_outlines', displayName: 'Has Outlines' },
    { parameterName: 'error_message', displayName: 'Error Message' },

    // keyboard_generated (src/utils/configAnalyzer.ts)
    { parameterName: 'config_id', displayName: 'Config ID' },
    { parameterName: 'previous_config_id', displayName: 'Previous Config ID' },
    { parameterName: 'is_reversible', displayName: 'Is Reversible' },
    { parameterName: 'is_mirrored', displayName: 'Is Mirrored' },
    { parameterName: 'has_matrix', displayName: 'Has Matrix' },
    { parameterName: 'matrix_col_counts', displayName: 'Matrix Col Counts' },
    { parameterName: 'matrix_row_counts', displayName: 'Matrix Row Counts' },
    { parameterName: 'matrix_key_counts', displayName: 'Matrix Key Counts' },

    // Exceptions (trackError)
    { parameterName: 'description', displayName: 'Exception Description' },
    { parameterName: 'fatal', displayName: 'Exception Fatal' },
    { parameterName: 'error_stack', displayName: 'Error Stack' },

    // Settings (settings_loaded, setting_changed)
    { parameterName: 'setting_name', displayName: 'Setting Name' },
    { parameterName: 'setting_value', displayName: 'Setting Value' },
    { parameterName: 'debug', displayName: 'Setting Debug' },
    { parameterName: 'autoGen', displayName: 'Setting Auto Generate' },
    { parameterName: 'autoGen3D', displayName: 'Setting Auto Generate 3D' },
    {
      parameterName: 'kicanvasPreview',
      displayName: 'Setting KiCanvas Preview',
    },
    { parameterName: 'stlPreview', displayName: 'Setting STL Preview' },

    // Loading, sharing and downloading
    { parameterName: 'source', displayName: 'Event Source' },
    { parameterName: 'file_type', displayName: 'File Type' },
    { parameterName: 'provider', displayName: 'Git Provider' },
    { parameterName: 'example_name', displayName: 'Example Name' },
    { parameterName: 'is_empty', displayName: 'Is Empty Config' },
    { parameterName: 'has_injections', displayName: 'Has Injections' },
    { parameterName: 'injection_type', displayName: 'Injection Type' },
    { parameterName: 'download_type', displayName: 'Download Type' },
    { parameterName: 'only_configs', displayName: 'Only Configs' },
    { parameterName: 'preview_type', displayName: 'Preview Type' },
    { parameterName: 'preview_key', displayName: 'Preview Key' },
    { parameterName: 'strategy', displayName: 'Conflict Strategy' },
    { parameterName: 'apply_to_all', displayName: 'Apply To All' },
    { parameterName: 'action', displayName: 'Action Name' },
  ],

  /** Event-scoped custom metrics (numeric values). */
  customMetrics: [
    {
      parameterName: 'duration_ms',
      displayName: 'Generation Duration MS',
      measurementUnit: 'MILLISECONDS',
    },
    {
      parameterName: 'total_generation_time_ms',
      displayName: 'Total Gen Time MS',
      measurementUnit: 'MILLISECONDS',
    },
    {
      parameterName: 'points_count',
      displayName: 'Points Count',
      measurementUnit: 'STANDARD',
    },
    {
      parameterName: 'pcbs_count',
      displayName: 'PCBs Count',
      measurementUnit: 'STANDARD',
    },
    {
      parameterName: 'cases_count',
      displayName: 'Cases Count',
      measurementUnit: 'STANDARD',
    },
    {
      parameterName: 'stored_configs_count',
      displayName: 'Stored Configs Count',
      measurementUnit: 'STANDARD',
    },
    {
      parameterName: 'count_outlines',
      displayName: 'Exported Outlines Count',
      measurementUnit: 'STANDARD',
    },
    {
      parameterName: 'count_raw_outlines',
      displayName: 'Raw Outlines Count',
      measurementUnit: 'STANDARD',
    },
    {
      parameterName: 'count_pcbs',
      displayName: 'Config PCBs Count',
      measurementUnit: 'STANDARD',
    },
    {
      parameterName: 'count_cases',
      displayName: 'Config Cases Count',
      measurementUnit: 'STANDARD',
    },
    {
      parameterName: 'count_zones',
      displayName: 'Zones Count',
      measurementUnit: 'STANDARD',
    },
    {
      parameterName: 'matrix_zones',
      displayName: 'Matrix Zones Count',
      measurementUnit: 'STANDARD',
    },
    {
      parameterName: 'matrix_keys',
      displayName: 'Matrix Keys Count',
      measurementUnit: 'STANDARD',
    },
    {
      parameterName: 'keyboard_keys',
      displayName: 'Keyboard Keys Count',
      measurementUnit: 'STANDARD',
    },
    {
      parameterName: 'selected_configs_count',
      displayName: 'Selected Configs Count',
      measurementUnit: 'STANDARD',
    },
    {
      parameterName: 'completed_configs_count',
      displayName: 'Completed Configs Count',
      measurementUnit: 'STANDARD',
    },
    {
      parameterName: 'failed_configs_count',
      displayName: 'Failed Configs Count',
      measurementUnit: 'STANDARD',
    },
    {
      parameterName: 'injections_count',
      displayName: 'Injections Count',
      measurementUnit: 'STANDARD',
    },
    {
      parameterName: 'file_count',
      displayName: 'Uploaded File Count',
      measurementUnit: 'STANDARD',
    },
    {
      parameterName: 'file_size',
      displayName: 'File Size Bytes',
      measurementUnit: 'STANDARD',
    },
    {
      parameterName: 'query_length',
      displayName: 'Search Query Length',
      measurementUnit: 'STANDARD',
    },
    {
      parameterName: 'conflict_count',
      displayName: 'Conflict Count',
      measurementUnit: 'STANDARD',
    },
    {
      parameterName: 'remaining_count',
      displayName: 'Remaining Conflict Count',
      measurementUnit: 'STANDARD',
    },
  ],

  /**
   * Events counted as key events (conversions): results, not clicks.
   * GA's built-in `purchase` key event is left alone.
   */
  keyEvents: [
    'keyboard_generated',
    'archive_single_downloaded',
    'download_button_clicked',
    'share_link_copied',
    'bulk_download_completed',
  ],

  /**
   * Registrations the app no longer sends. Setup warns while they are still
   * registered and archives or deletes them with --prune-retired. Archiving
   * removes a dimension or metric from reports, including its history.
   */
  retired: {
    customDimensions: [
      'matrix_zone_names',
      'matrix_col_names',
      'matrix_row_names',
      'sendUsageMetrics',
      'event_category',
    ],
    customMetrics: [],
    keyEvents: ['share_button_clicked', 'bulk_download_started'],
  },

  /**
   * Web stream Enhanced Measurement. History-based page views stay off
   * because App.tsx sends its own page_view on every route change.
   */
  enhancedMeasurement: {
    streamEnabled: true,
    pageChangesEnabled: false,
    scrollsEnabled: true,
    outboundClicksEnabled: true,
    siteSearchEnabled: true,
    videoEngagementEnabled: true,
    fileDownloadsEnabled: true,
    formInteractionsEnabled: true,
  },

  /** Property data retention. */
  dataRetention: {
    eventDataRetention: 'FOURTEEN_MONTHS',
    resetUserDataOnNewActivity: true,
  },
};
