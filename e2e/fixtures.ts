import { test as base, expect } from '@playwright/test';
import { isHostName, resolveNoHostName } from './utils/hostNames';
import { ReadinessLog } from './utils/readiness';

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
  // A failed test gets a "readiness" attachment: the app's worker milestones
  // and how busy the machine was (see DEVELOPMENT.md, Browser tests).
  page: async ({ page }, use, testInfo) => {
    const readiness = new ReadinessLog();
    page.on('console', (message) => readiness.record(message.text()));
    await use(page);
    if (testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach('readiness', {
        body: readiness.summary(),
        contentType: 'text/plain',
      });
    }
  },
});
export { expect };
