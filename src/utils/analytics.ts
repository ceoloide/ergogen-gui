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
    window.gtag('event', eventName, {
      event_category: 'user_action',
      ...eventParams,
    });
  }
};
