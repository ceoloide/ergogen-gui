import type { Page } from '@playwright/test';
import { newContextPage } from './app';
import { test, expect } from './journey';

// Each request to Google Analytics or Google Tag Manager, from any subdomain.
const analyticsHost =
  /^https:\/\/([\w-]+\.)*(googletagmanager|google-analytics)\.com\//;

// A stand-in for gtag.js, which the journey serves in place of the script of
// Google. Like that script, it sets the cookies _ga and _ga_<container>, and
// it sends each event that the app pushes to dataLayer, before and after it
// loads, to google-analytics.com.
const gtagScript = (tagId: string) => `(() => {
  const container = ${JSON.stringify(tagId.replace(/^G-/, ''))};
  document.cookie = '_ga=GA1.1.journey; Path=/; SameSite=Lax';
  document.cookie = '_ga_' + container + '=GS1.1.journey; Path=/; SameSite=Lax';
  const send = ([command, name]) => {
    if (command !== 'event') return;
    const hit = new URL('https://www.google-analytics.com/g/collect');
    hit.searchParams.set('tid', ${JSON.stringify(tagId)});
    hit.searchParams.set('en', name);
    fetch(hit, { method: 'POST', mode: 'no-cors', keepalive: true });
  };
  const dataLayer = (window.dataLayer = window.dataLayer || []);
  Array.from(dataLayer).forEach(send);
  const push = dataLayer.push.bind(dataLayer);
  dataLayer.push = (...commands) => {
    commands.forEach(send);
    return push(...commands);
  };
})();`;

// Answers every request of the page to Google Analytics and Google Tag
// Manager, so that none leaves the machine, and returns their URLs in order.
async function serveAnalytics(page: Page) {
  const requests: string[] = [];
  await page.route(analyticsHost, (route) => {
    const url = new URL(route.request().url());
    requests.push(url.href);
    if (url.pathname === '/gtag/js') {
      return route.fulfill({
        contentType: 'text/javascript',
        body: gtagScript(url.searchParams.get('id') ?? ''),
      });
    }
    return route.fulfill({ status: 204 });
  });
  return requests;
}

// The tag IDs that the page loaded gtag.js for, and the names of the events
// that reached google-analytics.com, from the requests that serveAnalytics
// answered.
const tagIds = (requests: string[]) =>
  requests
    .map((request) => new URL(request))
    .filter((url) => url.pathname === '/gtag/js')
    .map((url) => url.searchParams.get('id'));
const hits = (requests: string[]) =>
  requests
    .map((request) => new URL(request))
    .filter((url) => url.pathname === '/g/collect')
    .map((url) => url.searchParams.get('en'));

const analyticsCookies = async (page: Page) =>
  (await page.context().cookies())
    .map((cookie) => cookie.name)
    .filter((name) => name.startsWith('_ga'))
    .sort();
const metricsSwitch = (page: Page) =>
  page.getByRole('checkbox', { name: 'Send usage metrics' });

async function chooseEmptyConfiguration(page: Page) {
  await page
    .getByRole('button', { name: 'Start with empty configuration' })
    .click();
  await expect(
    page.getByRole('textbox', { name: 'Editor content' })
  ).toBeAttached();
}

async function openSettings(page: Page) {
  await page.getByRole('button', { name: 'Show settings panel' }).click();
  await expect(metricsSwitch(page)).toBeAttached();
}

test('sends usage metrics from a browser tab until the user turns them off', async ({
  page,
  journey,
  browser,
  baseURL,
}) => {
  const requests = await serveAnalytics(page);

  await journey.step('Open the app', async () => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Ergogen Web UI' })
    ).toBeVisible();
    // A tag ID that starts with G-TEST may send from this loopback host.
    await expect
      .poll(() => tagIds(requests))
      .toEqual([expect.stringMatching(/^G-TEST/)]);
    const [tagId] = tagIds(requests);
    await expect.poll(() => hits(requests)).toContain('page_view');
    await expect
      .poll(() => analyticsCookies(page))
      .toEqual(['_ga', `_ga_${tagId!.replace(/^G-/, '')}`]);
  });

  await journey.step('Choose Empty Configuration', async () => {
    await chooseEmptyConfiguration(page);
    await expect.poll(() => hits(requests)).toContain('config_created');
  });

  await journey.step('Open the settings', async () => {
    await openSettings(page);
    await expect(
      metricsSwitch(page),
      'Send Usage Metrics in a browser tab, before any choice'
    ).toBeChecked();
  });

  await journey.step('Turn off Send Usage Metrics', async () => {
    await page.getByText('Send Usage Metrics', { exact: true }).click();
    await expect(metricsSwitch(page)).not.toBeChecked();
    const stored = await page.evaluate(() =>
      localStorage.getItem('ergogen:consent:sendUsageMetrics')
    );
    expect(stored, 'the stored choice').toBe('false');
    await expect
      .poll(() => analyticsCookies(page), 'the cookies of Google Analytics')
      .toEqual([]);
    journey.observe('storedChoice', stored);
  });

  await journey.step('Reload the page', async () => {
    const before = requests.length;
    // The app adds gtag.js while its script runs, which delays the load
    // event that the reload waits for.
    await page.reload();
    await expect(
      page.getByRole('textbox', { name: 'Editor content' })
    ).toBeAttached({ timeout: 30_000 });
    await openSettings(page);
    await expect(metricsSwitch(page)).not.toBeChecked();
    expect(
      requests.slice(before),
      'the requests to Google after the reload'
    ).toEqual([]);
    journey.observe('requests', [...requests]);
  });

  // Chromium for Playwright cannot install the app. Like Safari for an app on
  // the home screen, this browser reports navigator.standalone.
  const installed = await newContextPage(browser, baseURL!);
  await installed.addInitScript(() =>
    Object.defineProperty(Navigator.prototype, 'standalone', {
      get: () => true,
    })
  );
  const installedRequests = await serveAnalytics(installed);
  journey.follow(installed);

  await journey.step('Open the app as an installed app', async () => {
    await installed.goto('/');
    await expect(
      installed.getByRole('heading', { name: 'Ergogen Web UI' })
    ).toBeVisible();
  });

  await journey.step(
    'Choose Empty Configuration in the installed app',
    async () => {
      await chooseEmptyConfiguration(installed);
    }
  );

  await journey.step('Open the settings of the installed app', async () => {
    await openSettings(installed);
    await expect(
      installed.getByRole('button', { name: 'Installed' }),
      'the card Offline App of an installed app'
    ).toBeVisible();
    await expect(
      metricsSwitch(installed),
      'Send Usage Metrics in an installed app, before any choice'
    ).not.toBeChecked();
    expect(
      installedRequests,
      'the requests to Google from the installed app'
    ).toEqual([]);
    journey.observe('installedAppRequests', installedRequests);
  });
  await installed.context().close();
});
