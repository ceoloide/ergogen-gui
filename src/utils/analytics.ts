import guiPkg from '../../package.json';
import { getFullErgogenVersion } from './version';

/**
 * Utility functions for Google Analytics event tracking.
 */

/**
 * Tracks a Google Analytics event if gtag is available.
 * @param eventName - The name of the event
 * @param eventParams - Optional parameters for the event
 */
export const trackEvent = (
  eventName: string,
  eventParams?: { [key: string]: string | number | boolean | undefined }
): void => {
  if (window.gtag) {
    const guiVersion = guiPkg.version;
    const ergogenVersion = getFullErgogenVersion(
      process.env.REACT_APP_ERGOGEN_VERSION
    );

    window.gtag('event', eventName, {
      event_category: 'user_action',
      gui_version: guiVersion,
      ergogen_version: ergogenVersion,
      ...eventParams,
    });
  }
};
