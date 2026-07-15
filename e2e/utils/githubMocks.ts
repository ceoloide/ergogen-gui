import { Page } from '@playwright/test';

/**
 * Mocks all GitHub network requests for E2E testing.
 * Intercepts api.github.com and raw.githubusercontent.com.
 */
export const mockGitHubNetworkRequests = async (page: Page) => {
  // Set up rate limit headers on responses that might verify limit logic
  const rateLimitHeaders = {
    'x-ratelimit-limit': '60',
    'x-ratelimit-remaining': '55',
    'x-ratelimit-reset': (Math.floor(Date.now() / 1000) + 3600).toString(),
  };

  // Route raw.githubusercontent.com requests
  await page.route(
    /https:\/\/raw\.githubusercontent\.com\/.*/,
    async (route) => {
      const url = route.request().url();

      // ceoloide/mr_useful config
      if (
        url.includes('ceoloide/mr_useful') &&
        (url.endsWith('config.yaml') || url.endsWith('config.yml'))
      ) {
        await route.fulfill({
          status: 200,
          headers: rateLimitHeaders,
          contentType: 'text/yaml',
          body: `
points:
  key: 1
footprints:
  ceoloide/logo_mr_useful: {}
`,
        });
        return;
      }

      // ceoloide/mr_useful .gitmodules
      if (url.includes('ceoloide/mr_useful') && url.endsWith('.gitmodules')) {
        await route.fulfill({
          status: 200,
          headers: rateLimitHeaders,
          contentType: 'text/plain',
          body: `
[submodule "footprints/ceoloide"]
\tpath = footprints/ceoloide
\turl = https://github.com/ceoloide/mr_useful_footprints.git
`,
        });
        return;
      }

      // ceoloide/mr_useful_footprints submodule files
      if (
        url.includes('mr_useful_footprints') &&
        url.includes('logo_mr_useful.js')
      ) {
        await route.fulfill({
          status: 200,
          headers: rateLimitHeaders,
          contentType: 'application/javascript',
          body: 'module.exports = { params: { designator: "LOGO" }, body: "" };',
        });
        return;
      }

      // unspecworks/gamma-omega config
      if (
        url.includes('unspecworks/gamma-omega') &&
        url.endsWith('config.yaml')
      ) {
        await route.fulfill({
          status: 200,
          headers: rateLimitHeaders,
          contentType: 'text/yaml',
          body: `
points:
  key: 2
footprints:
  unspecworks/pico_oneside: {}
`,
        });
        return;
      }

      // unspecworks/gamma-omega footprint files
      if (
        url.includes('unspecworks/gamma-omega') &&
        url.includes('pico_oneside.js')
      ) {
        await route.fulfill({
          status: 200,
          headers: rateLimitHeaders,
          contentType: 'application/javascript',
          body: 'module.exports = { params: { designator: "MCU" }, body: "" };',
        });
        return;
      }

      // Default mock response for other raw requests
      await route.fulfill({
        status: 404,
        body: 'Not found in E2E mock',
      });
    }
  );

  // Route api.github.com requests
  await page.route(/https:\/\/api\.github\.com\/.*/, async (route) => {
    const url = route.request().url();

    // Mock Trees/Contents requests
    if (url.includes('/git/trees/') || url.includes('/contents/')) {
      if (url.includes('ceoloide/mr_useful')) {
        await route.fulfill({
          status: 200,
          headers: rateLimitHeaders,
          contentType: 'application/json',
          body: JSON.stringify({
            sha: 'mr_useful_tree_sha',
            url: url,
            tree: [
              {
                path: 'config.yaml',
                type: 'blob',
                size: 100,
                url: 'https://api.github.com/repos/ceoloide/mr_useful/git/blobs/1',
              },
              {
                path: '.gitmodules',
                type: 'blob',
                size: 100,
                url: 'https://api.github.com/repos/ceoloide/mr_useful/git/blobs/2',
              },
              {
                path: 'footprints',
                type: 'tree',
                sha: 'tree_sha_footprints',
                url: 'https://api.github.com/repos/ceoloide/mr_useful/git/trees/tree_sha_footprints',
              },
            ],
            truncated: false,
          }),
        });
        return;
      }

      if (url.includes('mr_useful_footprints')) {
        await route.fulfill({
          status: 200,
          headers: rateLimitHeaders,
          contentType: 'application/json',
          body: JSON.stringify({
            sha: 'submodule_tree_sha',
            url: url,
            tree: [
              {
                path: 'logo_mr_useful.js',
                type: 'blob',
                size: 100,
                url: 'https://api.github.com/repos/ceoloide/mr_useful_footprints/git/blobs/3',
              },
            ],
            truncated: false,
          }),
        });
        return;
      }

      if (url.includes('unspecworks/gamma-omega')) {
        await route.fulfill({
          status: 200,
          headers: rateLimitHeaders,
          contentType: 'application/json',
          body: JSON.stringify({
            sha: 'gamma_omega_tree_sha',
            url: url,
            tree: [
              {
                path: 'original/ergogen/config.yaml',
                type: 'blob',
                size: 100,
                url: 'https://api.github.com/repos/unspecworks/gamma-omega/git/blobs/4',
              },
              {
                path: 'footprints/pico_oneside.js',
                type: 'blob',
                size: 100,
                url: 'https://api.github.com/repos/unspecworks/gamma-omega/git/blobs/5',
              },
            ],
            truncated: false,
          }),
        });
        return;
      }
    }

    // Default rate limit headers response for any other API requests
    await route.fulfill({
      status: 200,
      headers: rateLimitHeaders,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });
};
