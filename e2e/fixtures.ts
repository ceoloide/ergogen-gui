import { test as base, expect } from '@playwright/test';
import { isHostName, resolveNoHostName } from './utils/hostNames';

// App assets and workers must come from this run's production server. Provider
// tests register narrower page routes with deterministic fixtures before goto.
export const test = base.extend({
  context: async ({ context, baseURL, launchOptions }, use) => {
    const origin = new URL(baseURL!).origin;
    // Once a service worker's request was aborted here, Chromium installs a new
    // worker on every later navigation, as after a DevTools change. Where the
    // browser resolves no host name (the update drill), such a request fails
    // there instead.
    const hostNamesFail =
      launchOptions.args?.includes(resolveNoHostName) ?? false;
    await context.route('**/*', (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.origin === origin) return route.continue();
      if (hostNamesFail && request.serviceWorker() && isHostName(url.hostname))
        return route.continue();
      return route.abort('blockedbyclient');
    });
    await use(context);
  },
});
export { expect };
