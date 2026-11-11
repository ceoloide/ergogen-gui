import guiPkg from '../../package.json';
import { getFullErgogenVersion } from './version';

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

interface GAWindow extends Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}

/**
 * Detects if the app is currently running in PWA standalone/installed mode.
 */
export const checkIsPWA = (): boolean => {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator as NavigatorStandalone;
  return (
    (typeof window.matchMedia === 'function' &&
      window.matchMedia('(display-mode: standalone)').matches) ||
    nav.standalone === true
  );
};

/**
 * Determines whether telemetry transmission should be blocked
 * due to development environment or localhost hostname, unless explicitly allowed.
 */
export const isLiveTelemetryBlocked = (trackingId?: string): boolean => {
  if (typeof window === 'undefined') return true;

  // Allow explicit test overrides and test tracking IDs
  if (
    import.meta.env.MODE === 'test' ||
    import.meta.env.VITE_FORCE_ANALYTICS === 'true' ||
    (window as unknown as { __FORCE_ANALYTICS__?: boolean })
      .__FORCE_ANALYTICS__ === true ||
    (trackingId && trackingId.startsWith('G-TEST'))
  ) {
    return false;
  }

  const hostname = window.location.hostname;
  const isLocalhost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    hostname.endsWith('.localhost');

  if (Boolean(import.meta.env.DEV) || isLocalhost) {
    return true;
  }

  return false;
};

/**
 * Clears Google Analytics cookies (_ga and _ga_*) across current path and domains.
 */
const clearGaCookies = (): void => {
  if (typeof document === 'undefined' || !document.cookie) return;
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf('=');
    const name = (eqPos > -1 ? cookie.substring(0, eqPos) : cookie).trim();
    if (name.startsWith('_ga')) {
      document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`;
      const hostname = window.location.hostname;
      const hostParts = hostname.split('.');
      while (hostParts.length > 0) {
        const domain = hostParts.join('.');
        document.cookie = `${name}=; Path=/; Domain=.${domain}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`;
        document.cookie = `${name}=; Path=/; Domain=${domain}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`;
        hostParts.shift();
      }
    }
  }
};

/**
 * Best-effort request to delete the offline analytics queue left by builds
 * that used workbox-google-analytics. The service worker owns the real
 * cleanup: it deletes the database on activation and no longer queues hits.
 */
const clearOfflineAnalyticsQueue = (): void => {
  if (typeof indexedDB === 'undefined') return;
  try {
    indexedDB.deleteDatabase('workbox-background-sync');
  } catch {
    // Ignore restricted IndexedDB errors
  }
};

/**
 * Builds a sanitized page location URL stripping query parameters (e.g. ?github=...)
 * and hash fragments (#...) so repository URLs or shared payloads never leak via dl=.
 */
const getSanitizedPageLocation = (): string | undefined => {
  if (typeof window === 'undefined' || !window.location) return undefined;
  const origin =
    window.location.origin && window.location.origin !== 'null'
      ? window.location.origin
      : `${window.location.protocol || 'https:'}//${window.location.hostname || 'localhost'}`;
  return `${origin}${window.location.pathname || '/'}`;
};

/**
 * Storage key written only when the user explicitly toggles "Send Usage Metrics".
 */
const CONSENT_KEY = 'ergogen:consent:sendUsageMetrics';

/**
 * Older storage locations. Earlier builds wrote `true` to both of them
 * automatically (the legacy key on every mount until 211ff8a, the settings
 * object on first visit), so only a stored `false` there reflects a choice.
 */
const LEGACY_CONSENT_KEY = 'ergogen:config:sendUsageMetrics';
const SETTINGS_KEY = 'ergogen:settings';

/**
 * Consent chosen this session that could not be saved to localStorage.
 * It is cleared as soon as a save succeeds, so storage stays the source of
 * truth and changes made in other tabs are honored.
 */
let unsavedSessionConsent: boolean | undefined;

const readStoredBoolean = (key: string): boolean | undefined => {
  const raw = localStorage.getItem(key);
  if (raw === null) return undefined;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === 'boolean' ? parsed : undefined;
  } catch {
    return undefined;
  }
};

const readSettingsConsent = (): boolean | undefined => {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (raw === null) return undefined;
  try {
    const parsed = JSON.parse(raw);
    return parsed &&
      typeof parsed === 'object' &&
      typeof parsed.sendUsageMetrics === 'boolean'
      ? parsed.sendUsageMetrics
      : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Resolves whether usage metrics may be sent, in this order:
 * 1. A toggle from this session that could not be saved.
 * 2. The explicit consent key, written only by the settings toggle.
 * 3. A `false` in the legacy key or the settings object (an older opt-out).
 * 4. The default: enabled on the web, disabled in standalone PWA mode.
 * Fails closed if localStorage cannot be read.
 */
export const getSendUsageMetricsEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (unsavedSessionConsent !== undefined) return unsavedSessionConsent;

  try {
    const explicitConsent = readStoredBoolean(CONSENT_KEY);
    if (explicitConsent !== undefined) return explicitConsent;

    if (
      readStoredBoolean(LEGACY_CONSENT_KEY) === false ||
      readSettingsConsent() === false
    ) {
      return false;
    }
  } catch {
    return false;
  }

  return !checkIsPWA();
};

/**
 * Records an explicit "Send Usage Metrics" choice. If localStorage rejects
 * the write, the choice is kept in memory for the rest of the session.
 */
export const setSendUsageMetricsEnabled = (enabled: boolean): void => {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(enabled));
    unsavedSessionConsent = undefined;
  } catch {
    unsavedSessionConsent = enabled;
  }
};

let wasDisabledAfterLoad = false;

/**
 * Dynamically loads/initializes Google Analytics if enabled.
 * If disabled or environment is blocked, it sets the `ga-disable-<ID>` flag,
 * clears cookies and offline queues, and unbinds error listeners while keeping
 * any already-loaded `dataLayer`/`gtag` hook intact so re-enabling works without reload.
 */
export const initAnalytics = (): void => {
  if (typeof window === 'undefined') return;

  const enabled = getSendUsageMetricsEnabled();
  const trackingId = import.meta.env.VITE_GTAG_ID;
  const blocked = isLiveTelemetryBlocked(trackingId);
  const existingScript = document.getElementById('gtag-script');

  if (!existingScript) {
    wasDisabledAfterLoad = false;
  }

  if (enabled && trackingId && !blocked) {
    delete (window as unknown as Record<string, unknown>)[
      'ga-disable-' + trackingId
    ];

    const win = window as unknown as GAWindow;
    const configOptions = {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    };
    // Set page_location globally rather than in the config call: config
    // parameters stick to every later event, which would attribute them all
    // to the landing page. trackEvent() refreshes it on each event.
    const setCurrentPageLocation = () =>
      win.gtag?.('set', { page_location: getSanitizedPageLocation() });

    if (!existingScript) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      script.id = 'gtag-script';
      document.head.appendChild(script);

      const dataLayer = win.dataLayer || [];
      win.dataLayer = dataLayer;

      win.gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        dataLayer.push(arguments);
      };
      win.gtag('js', new Date());
      setCurrentPageLocation();
      win.gtag('config', trackingId, configOptions);
      wasDisabledAfterLoad = false;
    } else if (wasDisabledAfterLoad) {
      setCurrentPageLocation();
      win.gtag?.('config', trackingId, configOptions);
      wasDisabledAfterLoad = false;
    }

    setupGlobalErrorTracking();
  } else {
    if (trackingId) {
      (window as unknown as Record<string, unknown>)[
        'ga-disable-' + trackingId
      ] = true;
    }
    if (existingScript) {
      wasDisabledAfterLoad = true;
    }

    clearGaCookies();
    clearOfflineAnalyticsQueue();
    removeGlobalErrorTracking();
  }
};

/**
 * File extensions the app can load. Anything else is reported as `other`, so
 * no part of a user's filename is ever sent.
 */
const SUPPORTED_FILE_TYPES = new Set(['yaml', 'yml', 'json', 'zip', 'ekb']);

/**
 * Maps a filename to a fixed analytics file type.
 */
export const classifyFileType = (fileName: string): string => {
  const dotIndex = fileName.lastIndexOf('.');
  const extension =
    dotIndex >= 0 ? fileName.slice(dotIndex + 1).toLowerCase() : '';
  return SUPPORTED_FILE_TYPES.has(extension) ? extension : 'other';
};

/**
 * GA4 truncates event parameter values at 100 characters.
 */
const GA4_PARAM_VALUE_LIMIT = 100;

/**
 * Quoted segments in compiler and runtime errors usually echo user-written
 * config keys or values (zone names, field paths, footprint names).
 */
const QUOTED_TEXT = /"[^"\n]*"|'[^'\n]*'|`[^`\n]*`/g;

/**
 * A stack frame line in V8 (`at fn (url:1:2)`) or Firefox/Safari (`fn@url:1:2`).
 */
const STACK_FRAME = /^at\s|^[^\s@]*@\S+:\d+:\d+$/;

/**
 * Keeps the first line of an error, replaces quoted values with `*`, and
 * caps it at the GA4 limit. Later lines (such as YAML excerpts) are dropped.
 */
const scrubErrorText = (text: string): string =>
  text
    .split('\n')[0]
    .replace(QUOTED_TEXT, (quoted) => `${quoted[0]}*${quoted[0]}`)
    .trim()
    .slice(0, GA4_PARAM_VALUE_LIMIT);

/**
 * Keeps only stack frame lines, dropping the message line that V8 prepends.
 */
const scrubStack = (stack: string): string | undefined => {
  const frames = stack
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => STACK_FRAME.test(line));
  return frames.length > 0
    ? frames.join(' ').slice(0, GA4_PARAM_VALUE_LIMIT)
    : undefined;
};

type EventParams = { [key: string]: string | number | boolean | undefined };

/**
 * Applies the error scrubbing rules to any event that carries error text.
 */
const scrubEventParams = (params: EventParams): EventParams => {
  const scrubbed = { ...params };
  for (const key of ['error_message', 'description'] as const) {
    const value = scrubbed[key];
    if (typeof value === 'string') scrubbed[key] = scrubErrorText(value);
  }
  if (typeof scrubbed.error_stack === 'string') {
    scrubbed.error_stack = scrubStack(scrubbed.error_stack);
  }
  return scrubbed;
};

/**
 * Tracks a Google Analytics event if enabled and window.gtag is available.
 * @param eventName - The name of the event
 * @param eventParams - Optional parameters for the event
 */
export const trackEvent = (
  eventName: string,
  eventParams?: EventParams
): void => {
  const trackingId = import.meta.env.VITE_GTAG_ID;
  if (
    getSendUsageMetricsEnabled() &&
    !isLiveTelemetryBlocked(trackingId) &&
    window.gtag
  ) {
    // Keep the global value current so automatic Enhanced Measurement events
    // (scrolls, outbound clicks) are attributed to the page the user is on.
    const pageLocation = getSanitizedPageLocation();
    window.gtag('set', { page_location: pageLocation });
    window.gtag('event', eventName, {
      page_location: pageLocation,
      event_category: 'user_action',
      gui_version: guiPkg.version,
      ergogen_version: getFullErgogenVersion(
        import.meta.env.VITE_ERGOGEN_VERSION
      ),
      is_pwa: checkIsPWA(),
      ...scrubEventParams(eventParams ?? {}),
    });
  }
};

/**
 * Tracks a client-side exception or error via GA4.
 * @param error - The Error object or message
 * @param fatal - Whether the error is fatal / crashed the app/component
 * @param context - Additional context/location where the error occurred
 */
export const trackError = (
  error: Error | string,
  fatal: boolean = false,
  context?: string
): void => {
  const message = error instanceof Error ? error.message : error;
  const stack = error instanceof Error ? error.stack : undefined;

  trackEvent('exception', {
    description: context ? `[${context}] ${message}` : message,
    fatal,
    error_stack: stack,
  });
};

let listenersAttached = false;

const handleGlobalError = (event: ErrorEvent) => {
  trackError(event.error || event.message, false, 'unhandled_error');
};

const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  trackError(
    event.reason || 'Unhandled Promise Rejection',
    false,
    'unhandled_rejection'
  );
};

/**
 * Sets up global event listeners to automatically track unhandled exceptions.
 */
export const setupGlobalErrorTracking = (): void => {
  if (typeof window === 'undefined') return;
  if (listenersAttached) return;

  window.addEventListener('error', handleGlobalError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
  listenersAttached = true;
};

/**
 * Removes global event listeners for unhandled exceptions.
 */
export const removeGlobalErrorTracking = (): void => {
  if (typeof window === 'undefined') return;
  if (!listenersAttached) return;

  window.removeEventListener('error', handleGlobalError);
  window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  listenersAttached = false;
};
