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
export const getAnalyticsEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('ergogen:config:enableAnalytics');
  if (stored !== null) {
    try {
      return JSON.parse(stored);
    } catch {
      return true;
    }
  }
  return !checkIsPWA();
};

/**
 * Dynamically loads/initializes Google Analytics if enabled.
 * If disabled, it removes the script and window variables.
 */
export const initAnalytics = (): void => {
  if (typeof window === 'undefined') return;

  const enabled = getAnalyticsEnabled();
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
  if (getAnalyticsEnabled() && window.gtag) {
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
