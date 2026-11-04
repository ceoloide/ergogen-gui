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
 * Helper to determine if analytics is enabled from local storage,
 * checking 'ergogen:settings' JSON first, then falling back to
 * legacy 'ergogen:config:sendUsageMetrics', defaulting to true on web and false on PWA.
 */
export const getSendUsageMetricsEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  const isPWA = checkIsPWA();

  try {
    // Primary: check ergogen:settings JSON object
    const settingsRaw = localStorage.getItem('ergogen:settings');
    if (settingsRaw !== null) {
      try {
        const parsed = JSON.parse(settingsRaw);
        if (
          parsed &&
          typeof parsed === 'object' &&
          typeof parsed.sendUsageMetrics === 'boolean'
        ) {
          return parsed.sendUsageMetrics;
        }
      } catch {
        // Fall through to legacy check on parse error
      }
    }

    // Fallback: check legacy ergogen:config:sendUsageMetrics
    const storedLegacy = localStorage.getItem(
      'ergogen:config:sendUsageMetrics'
    );
    if (storedLegacy !== null) {
      try {
        return JSON.parse(storedLegacy);
      } catch {
        return !isPWA;
      }
    }
  } catch {
    // Fall back cleanly if localStorage access is restricted (e.g. SecurityError in sandboxed iframe or private browsing)
    return !isPWA;
  }

  return !isPWA;
};

/**
 * Dynamically loads/initializes Google Analytics if enabled.
 * If disabled or environment is blocked, it sets the disable flag,
 * removes the script, deletes window variables, clears cookies, and unbinds error listeners.
 */
export const initAnalytics = (): void => {
  if (typeof window === 'undefined') return;

  const enabled = getSendUsageMetricsEnabled();
  const trackingId = import.meta.env.VITE_GTAG_ID;
  const blocked = isLiveTelemetryBlocked(trackingId);

  if (enabled && trackingId && !blocked) {
    // If previously disabled, remove disable flag
    delete (window as unknown as Record<string, unknown>)[
      'ga-disable-' + trackingId
    ];

    if (!document.getElementById('gtag-script')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      script.id = 'gtag-script';
      document.head.appendChild(script);

      const win = window as unknown as GAWindow;
      const dataLayer = win.dataLayer || [];
      win.dataLayer = dataLayer;

      win.gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        dataLayer.push(arguments);
      };
      win.gtag('js', new Date());
      win.gtag('config', trackingId, { send_page_view: false });

      setupGlobalErrorTracking();
    }
  } else {
    // Completely disable/remove GA4 scripts, cookies, listeners, and globals
    if (trackingId) {
      (window as unknown as Record<string, unknown>)[
        'ga-disable-' + trackingId
      ] = true;
    }

    const script = document.getElementById('gtag-script');
    if (script) {
      script.remove();
    }
    const win = window as unknown as GAWindow;
    delete win.gtag;
    delete win.dataLayer;

    clearGaCookies();
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
