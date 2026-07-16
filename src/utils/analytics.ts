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
 * Helper to determine if analytics is enabled from local storage,
 * defaulting to true on web and false on PWA (standalone mode).
 */
export const getSendUsageMetricsEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  const isPWA = checkIsPWA();
  const stored = localStorage.getItem('ergogen:config:sendUsageMetrics');

  if (stored !== null) {
    try {
      return JSON.parse(stored);
    } catch {
      return !isPWA;
    }
  }
  return !isPWA;
};

/**
 * Dynamically loads/initializes Google Analytics if enabled.
 * If disabled, it removes the script and window variables.
 */
export const initAnalytics = (): void => {
  if (typeof window === 'undefined') return;

  const enabled = getSendUsageMetricsEnabled();
  const trackingId = process.env.REACT_APP_GTAG_ID;

  if (enabled && trackingId) {
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
      win.gtag('config', trackingId);

      setupGlobalErrorTracking();
    }
  } else {
    // Completely disable/remove GA4 scripts and objects
    const script = document.getElementById('gtag-script');
    if (script) {
      script.remove();
    }
    const win = window as unknown as GAWindow;
    delete win.gtag;
    delete win.dataLayer;

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
  if (getSendUsageMetricsEnabled() && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'user_action',
      gui_version: guiPkg.version,
      ergogen_version: getFullErgogenVersion(
        process.env.REACT_APP_ERGOGEN_VERSION
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
