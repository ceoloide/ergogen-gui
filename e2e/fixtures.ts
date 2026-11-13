import { test as base, expect } from '@playwright/test';

// App assets and workers must come from this run's production server. Provider
// tests register narrower page routes with deterministic fixtures before goto.
export const test = base.extend({
  context: async ({ context, baseURL }, use) => {
    const origin = new URL(baseURL!).origin;
    await context.route('**/*', (route) => {
      const url = new URL(route.request().url());
      return url.origin === origin
        ? route.continue()
        : route.abort('blockedbyclient');
    });
    await use(context);
  },
});
export { expect };
