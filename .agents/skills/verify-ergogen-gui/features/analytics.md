# Analytics consent

A build with a Google Analytics tag ID sends anonymous usage metrics from a
browser tab, with no banner, until the user turns off `Send Usage Metrics` in
the settings. An installed app sends none until the user turns the switch on.
The app keeps the choice after a reload, and turning metrics off expires the
cookies of Google Analytics.

## Sub-features

- `metrics-default` loads gtag.js and sends events, such as `page_view`, from
  a browser tab when the user has made no choice.
- `metrics-installed` sends nothing from an installed app when the user has
  made no choice. The settings show `Installed` under `Offline` there.
- `metrics-switch` turns the metrics off or on with `Send Usage Metrics` under
  `Privacy` in the settings, and stores the choice in the key
  `ergogen:consent:sendUsageMetrics` of the local storage.
- `metrics-opt-out` stops the events of the page at once and expires the
  cookies `_ga` and `_ga_<container>`. After a reload, the app no longer loads
  gtag.js.
- `metrics-opt-in` resumes the events without a reload when the user turns the
  switch on again.
- `metrics-legacy` treats a `false` that an older version stored in
  `ergogen:config:sendUsageMetrics` or `ergogen:settings` as a choice to turn
  the metrics off.
- `metrics-host` sends nothing from a development build or from `localhost`,
  `127.0.0.1`, `[::1]`, or `*.localhost`, unless the tag ID starts with
  `G-TEST` or a force variable is set.
- `metrics-no-tag` never loads gtag.js in a build without a tag ID, and shows
  the switch off and disabled with a reason.

## How to get to it (user POV)

- Open the app in a browser tab. The metrics are on, with no banner.
- Choose `Show settings panel` in the header of the editor page, and choose
  the title `Send Usage Metrics` under `Privacy` to flip the switch.
- Install the app and open it. The metrics are off.
- A self-hoster sets `VITE_GTAG_ID` for the build, as the
  [README](../../../../README.md) describes.

## Driving it with pnpm verify

Journey: `pnpm verify analytics` runs `e2e/journeys/analytics.journey.ts`.

Preconditions:

- A build with the tag ID `G-TESTJOURNEY`, which `pnpm verify` builds for every
  journey. The tag ID starts with `G-TEST`, so the app sends from the loopback
  host of the run.
- Routes for each host below `googletagmanager.com` and `google-analytics.com`,
  which the journey adds before it opens the app, so no request leaves the
  machine. They answer gtag.js with a script that acts as the one of Google
  does: it sets `_ga` and `_ga_TESTJOURNEY`, and it sends each event that the
  app pushes to `dataLayer` to `/g/collect` with the name of the event in `en`.
  They answer every other request with 204.
- A new browser context with empty storage at `/`, so the user has made no
  choice.

- **Open the app.** Go to `/`. The heading `Ergogen Web UI` is visible, the
  page loads gtag.js for a tag ID that starts with `G-TEST`, the event
  `page_view` reaches `/g/collect`, and the cookies `_ga` and
  `_ga_TESTJOURNEY` are set.
- **Choose Empty Configuration.** The textbox `Editor content` appears, and the
  event `config_created` reaches `/g/collect`.
- **Open the settings.** The checkbox `Send usage metrics` is checked.
- **Turn off Send Usage Metrics.** Choose the text `Send Usage Metrics`. The
  checkbox is not checked, `ergogen:consent:sendUsageMetrics` holds `false`,
  and the cookies of Google Analytics are gone. `observed.storedChoice` keeps
  the stored value.
- **Reload the page.** The editor shows, the checkbox is still not checked,
  and the page made no request to Google after the reload.
  `observed.requests` lists each request to Google that the journey answered.
- **Open the app as an installed app.** A new browser context with empty
  storage, whose browser reports `navigator.standalone`, goes to `/`. The
  heading `Ergogen Web UI` is visible.
- **Choose Empty Configuration in the installed app.** The textbox
  `Editor content` appears.
- **Open the settings of the installed app.** The button `Installed` shows
  under `Offline`, the checkbox `Send usage metrics` is not checked, and the
  installed app made no request to Google, as `observed.installedAppRequests`
  shows.
- **Proof.** `reports/verify/analytics/` holds a screenshot and an ARIA
  snapshot after each step, and `result.json` with the observed values.

The journey does not drive the immediate stop of `metrics-opt-out` before a
reload, `metrics-opt-in`, `metrics-legacy`, the blocked hosts of
`metrics-host`, or `metrics-no-tag`. Do not report them as verified by this
journey.

`pnpm test:e2e` does not cover the feature. `src/utils/analytics.test.ts`
checks the order of the sources of the choice, the blocked hosts, the cookies,
the opt-out in the middle of a session, and the events without a browser.
`src/Ergogen.test.tsx` checks the switch with and without a tag ID.

## Gotchas

- The fixture of `e2e/fixtures.ts` blocks every request to another host,
  gtag.js included. Register the routes of Google on the page before it opens
  the app, or the app loads no gtag.js and sends no event.
- The served gtag.js stands in for the one of Google. A passed journey proves
  what the app asks for and pushes, not what Google receives.
- The app adds gtag.js while its first script runs, which delays the load
  event. Once a reload ends, a page that loaded no gtag.js will load none.
- Chromium for Playwright cannot install the app or emulate the display mode
  `standalone`. The journey makes the browser report `navigator.standalone`, as
  Safari does for an app on the home screen.
- The switch is a checkbox without a box on the screen. Choose its title,
  `Send Usage Metrics`, and read its state from the checkbox
  `Send usage metrics`.
