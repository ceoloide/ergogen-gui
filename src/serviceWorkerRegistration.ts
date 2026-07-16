/**
 * Service Worker Registration
 *
 * This module handles registering the Workbox-generated service worker in
 * production builds. It exposes `register()` and `unregister()` functions.
 *
 * When a new version of the service worker is detected (because a new build
 * has been deployed), the optional `onUpdate` callback is called with the
 * updated ServiceWorkerRegistration so the UI can prompt the user to reload.
 *
 * The service worker is only registered in production builds served over HTTPS
 * (or localhost for testing).
 */

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

/** Returns true when the app is being served from localhost. */
function isLocalhost(): boolean {
  return Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );
}

/**
 * Waits for the service worker to reach the 'activated' state and then calls
 * the appropriate config callback.
 */
function waitForActivation(
  installingWorker: ServiceWorker,
  registration: ServiceWorkerRegistration,
  config?: Config
): void {
  installingWorker.addEventListener('statechange', () => {
    if (installingWorker.state === 'installed') {
      if (navigator.serviceWorker.controller) {
        // A new SW has been installed alongside an existing one — this is an
        // update. Notify the UI so it can show a reload prompt.
        console.log(
          '[SW] New content is available. Will be used when all existing tabs are closed or you reload.'
        );
        config?.onUpdate?.(registration);
      } else {
        // First-time install — content is now cached for offline use.
        console.log('[SW] Content is cached for offline use.');
        config?.onSuccess?.(registration);
      }
    }
  });
}

/**
 * Registers the service worker for a localhost environment, performing an
 * extra validity check to ensure the SW URL is reachable.
 */
async function registerValidSW(swUrl: string, config?: Config): Promise<void> {
  try {
    const registration = await navigator.serviceWorker.register(swUrl);

    registration.addEventListener('updatefound', () => {
      const installingWorker = registration.installing;
      if (installingWorker === null) return;
      waitForActivation(installingWorker, registration, config);
    });
  } catch (error) {
    console.error('[SW] Error during service worker registration:', error);
  }
}

/**
 * Validates that the service worker URL returns a valid JS response.
 * Used only on localhost to guard against misconfigured dev setups.
 */
async function checkValidServiceWorker(
  swUrl: string,
  config?: Config
): Promise<void> {
  try {
    const response = await fetch(swUrl, {
      headers: { 'Service-Worker': 'script' },
    });
    const contentType = response.headers.get('content-type');

    if (
      response.status === 404 ||
      (contentType !== null && contentType.indexOf('javascript') === -1)
    ) {
      // No service worker found — probably a different app. Reload the page.
      const registration = await navigator.serviceWorker.ready;
      await registration.unregister();
      window.location.reload();
    } else {
      await registerValidSW(swUrl, config);
    }
  } catch {
    console.log(
      '[SW] No internet connection found. App is running in offline mode.'
    );
  }
}

/**
 * Registers the service worker.
 *
 * In production, runs over HTTPS only (or localhost for testing). The optional
 * `config` object allows the caller to hook into success and update events.
 */
export function register(config?: Config): void {
  if (process.env.NODE_ENV !== 'production') return;
  if (!('serviceWorker' in navigator)) return;

  const publicUrl = new URL(import.meta.env.BASE_URL, window.location.href);
  if (publicUrl.origin !== window.location.origin) {
    // Serving from a CDN — service workers won't work cross-origin.
    return;
  }

  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}service-worker.js`;

    if (isLocalhost()) {
      // On localhost, verify the SW still exists and is valid before registering.
      void checkValidServiceWorker(swUrl, config);
      // Log extra info for developers.
      void navigator.serviceWorker.ready.then(() => {
        console.log(
          '[SW] This web app is being served cache-first by a service worker. ' +
            'See https://cra.link/PWA for more details.'
        );
      });
    } else {
      // In production, just register normally.
      void registerValidSW(swUrl, config);
    }
  });
}
