/**
 * Ergogen GUI Service Worker
 *
 * This file is compiled by CRA's Workbox InjectManifest plugin (because it
 * exists at `src/service-worker.ts`). The plugin injects the precache manifest
 * into `self.__WB_MANIFEST` at build time.
 *
 * Caching strategy overview:
 * - **Precache** (install-time): All webpack-bundled JS/CSS/HTML assets are
 *   precached automatically via `self.__WB_MANIFEST`. These include the app
 *   shell, chunks, and the entry HTML.
 * - **Runtime – public dependencies**: Large third-party JS bundles loaded via
 *   `<script>` tags in index.html (`dependencies/*.js`, `kicanvas.js`, etc.)
 *   are cached on first use with a CacheFirst strategy so they load instantly
 *   on subsequent visits, even offline.
 * - **Runtime – Google Fonts**: Cached with StaleWhileRevalidate (CSS) and
 *   CacheFirst (font files) for fast, offline-capable typography.
 * - **Google Analytics**: Not intercepted. Hits sent while offline are
 *   dropped instead of being queued, because a queued hit could be replayed
 *   after the user opts out. On activation, this worker deletes the queue
 *   database left behind by earlier builds that used workbox-google-analytics.
 *
 * Update flow:
 * - On every page load the browser re-fetches this file from the server.
 * - If the file has changed (new build deployed), the browser installs the new
 *   SW in a "waiting" state and the app shows an update banner.
 * - When the user clicks "Reload", `SKIP_WAITING` is sent to this SW, it
 *   activates, and all clients are refreshed.
 */

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

declare const self: ServiceWorkerGlobalScope;

const publicUrl = import.meta.env.BASE_URL || '';

// --------------------------------------------------------------------------
// Core: claim clients and set up skip-waiting message handler
// --------------------------------------------------------------------------

clientsClaim();

/**
 * When the update banner calls `registration.waiting.postMessage({ type: 'SKIP_WAITING' })`,
 * this SW immediately takes control, triggering a page reload with fresh assets.
 */
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    void self.skipWaiting();
  }
});

// --------------------------------------------------------------------------
// Precache: all webpack-bundled assets (injected at build time by CRA)
// --------------------------------------------------------------------------

precacheAndRoute(self.__WB_MANIFEST);

// --------------------------------------------------------------------------
// SPA Navigation: route all navigation requests to index.html so that React
// Router's client-side routing continues to work offline.
// --------------------------------------------------------------------------

const fileExtensionRegexp = /\/[^/?]+\.[^/]+$/;

registerRoute(
  ({ request, url }: { request: Request; url: URL }) => {
    if (request.mode !== 'navigate') return false;
    // Skip Webpack HMR & internal routes.
    if (url.pathname.startsWith('/_')) return false;
    // Skip direct file requests (e.g., manifest.json, favicon.ico).
    if (url.pathname.match(fileExtensionRegexp)) return false;
    return true;
  },
  createHandlerBoundToURL(import.meta.env.BASE_URL + 'index.html')
);

// --------------------------------------------------------------------------
// Runtime – Public dependencies
//
// The large third-party bundles loaded via <script> tags (maker.js, bezier.js,
// hull.js, kle.js, kicanvas.js) live under /dependencies/. They are NOT part
// of the webpack bundle so they are not precached. We cache them on first
// access so subsequent loads (including offline) are instant.
// --------------------------------------------------------------------------

registerRoute(
  ({ url }: { url: URL }) =>
    url.pathname.startsWith(`${publicUrl}/dependencies/`),
  new CacheFirst({
    cacheName: 'public-dependencies-v1',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 20,
        // 30-day cache — these files only change when we update the project.
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  })
);

// --------------------------------------------------------------------------
// Runtime – Public images (previews and logo assets)
// --------------------------------------------------------------------------
registerRoute(
  ({ url }: { url: URL }) =>
    url.pathname.startsWith(`${publicUrl}/images/`) ||
    url.pathname === `${publicUrl}/ergogen.png` ||
    url.pathname === `${publicUrl}/favicon.ico`,
  new CacheFirst({
    cacheName: 'public-images-v1',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 50,
        // 30-day cache — static assets that rarely change.
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  })
);

// --------------------------------------------------------------------------
// Runtime – Google Fonts
//
// Font CSS is served from fonts.googleapis.com and font binaries from
// fonts.gstatic.com. We use StaleWhileRevalidate for the CSS (so the font
// list stays up to date) and CacheFirst for the binary font files (which are
// content-hashed and essentially immutable).
// --------------------------------------------------------------------------

registerRoute(
  ({ url }: { url: URL }) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  })
);

registerRoute(
  ({ url }: { url: URL }) => url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  })
);

// --------------------------------------------------------------------------
// Google Analytics – remove the legacy offline queue
//
// Earlier builds used workbox-google-analytics, which queued failed hits in
// the `workbox-background-sync` IndexedDB database and replayed them later
// without checking consent. This worker no longer queues analytics, so delete
// that database on activation. By then the previous worker is redundant and
// no longer receives the sync events that triggered replays. If it still
// holds a connection, the delete completes as soon as that connection closes.
// --------------------------------------------------------------------------

const LEGACY_ANALYTICS_QUEUE_DB = 'workbox-background-sync';

const deleteLegacyAnalyticsQueue = (): Promise<void> =>
  new Promise((resolve) => {
    try {
      const request = indexedDB.deleteDatabase(LEGACY_ANALYTICS_QUEUE_DB);
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
      request.onblocked = () => resolve();
    } catch {
      resolve();
    }
  });

self.addEventListener('activate', (event) => {
  event.waitUntil(deleteLegacyAnalyticsQueue());
});
