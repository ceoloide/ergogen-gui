import guiPkg from '../../package.json';
import { getFullErgogenVersion } from './version';

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

interface GAWindow extends Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  __ergogenSendUsageMetrics?: boolean;
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
 * Purges any offline-queued Google Analytics hits stored by Workbox Background Sync.
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
 * Helper to determine if analytics is enabled from local storage.
 * Checks session-memory override first, then explicit user toggle key
 * ('ergogen:config:sendUsageMetrics'), then 'ergogen:settings' opt-outs,
 * defaulting to true on web and false in standalone PWA mode.
 * Fails closed (false) if localStorage throws a SecurityError.
 */
export const getSendUsageMetricsEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;

  const win = window as unknown as GAWindow;
  if (typeof win.__ergogenSendUsageMetrics === 'boolean') {
    return win.__ergogenSendUsageMetrics;
  }

  const isPWA = checkIsPWA();

  try {
    // 1. Explicit user toggle key (written only when the user toggles the setting)
    const explicitToggle = localStorage.getItem(
      'ergogen:config:sendUsageMetrics'
    );
    if (explicitToggle !== null) {
      try {
        const parsedToggle = JSON.parse(explicitToggle);
        if (typeof parsedToggle === 'boolean') {
          return parsedToggle;
        }
      } catch {
        // Fall through on malformed value
      }
    }

    // 2. Settings JSON object: honor explicit opt-out anywhere, but do not let
    // pre-install browser default (`true`) override standalone PWA default (`false`).
    const settingsRaw = localStorage.getItem('ergogen:settings');
    if (settingsRaw !== null) {
      try {
        const parsed = JSON.parse(settingsRaw);
        if (
          parsed &&
          typeof parsed === 'object' &&
          typeof parsed.sendUsageMetrics === 'boolean'
        ) {
          if (parsed.sendUsageMetrics === false) {
            return false;
          }
          if (!isPWA) {
            return true;
          }
        }
      } catch {
        // Fall through to environment default on parse error
      }
    }
  } catch {
    // Fail closed if localStorage access is blocked (e.g. SecurityError in sandboxed contexts)
    return false;
  }

  return !isPWA;
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
      page_location: getSanitizedPageLocation(),
    };

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
      win.gtag('config', trackingId, configOptions);
      wasDisabledAfterLoad = false;
    } else if (wasDisabledAfterLoad) {
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
 * Tracks a Google Analytics event if enabled and window.gtag is available.
 * @param eventName - The name of the event
 * @param eventParams - Optional parameters for the event
 */
export const trackEvent = (
  eventName: string,
  eventParams?: { [key: string]: string | number | boolean | undefined }
): void => {
  const trackingId = import.meta.env.VITE_GTAG_ID;
  if (
    getSendUsageMetricsEnabled() &&
    !isLiveTelemetryBlocked(trackingId) &&
    window.gtag
  ) {
    window.gtag('event', eventName, {
      event_category: 'user_action',
      gui_version: guiPkg.version,
      ergogen_version: getFullErgogenVersion(
        import.meta.env.VITE_ERGOGEN_VERSION
      ),
      is_pwa: checkIsPWA(),
      ...eventParams,
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
    error_stack: stack?.substring(0, 250) || undefined, // limit length
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
