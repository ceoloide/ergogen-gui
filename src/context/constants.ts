/**
 * Constants used by the ConfigContext.
 */

/**
 * The key used to store the main configuration in local storage.
 */
export const CONFIG_LOCAL_STORAGE_KEY = 'ergogen:config';
export const MULTI_CONFIG_STORAGE_KEY = 'ergogen:multi-config';
export const LEGACY_STORAGE_CONFIG_KEY = 'LOCAL_STORAGE_CONFIG';

/**
 * The debounce delay (in milliseconds) used for GA4 analytics configuration metrics tracking.
 */
export const ANALYTICS_DEBOUNCE_DELAY = 5000;

/**
 * Breadth-First Search (BFS) caps for Git Provider repository traversal
 */
export const GIT_BFS_MAX_REQUESTS = 40;
export const GIT_BFS_MAX_DEPTH = 3;
