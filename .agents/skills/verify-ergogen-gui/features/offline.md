# Offline use and updates

After the first visit, a service worker keeps the app, the editor, and the
engine in the browser, so the app opens and generates without a network, with
the stored configurations. When a new version is deployed, the next visit
installs it in the background, and the header shows `Update Available` until
the user chooses it. The app then reloads into the new version.

## Sub-features

- `offline-precache` caches the app, the editor, and the engine when the
  service worker installs, and the worker controls each later page of its
  scope.
- `offline-start` opens the app from the service worker without a network,
  with the stored configurations and the generation in the page.
- `offline-images` caches the example previews, the logo, and the favicon the
  first time that the page loads them.
- `update-chip` shows the button `Update Available` in the header when the
  browser has installed the worker of a new deployment, which waits while the
  current version runs.
- `update-apply` activates the waiting worker when the user chooses
  `Update Available`, and reloads into the new version. The stored
  configurations stay.
- `update-force` shows the chip for testing when the address has
  `?force_update`, and the chip then only reloads.
- `install` shows the card `Offline App` under `Offline` in the settings. It
  offers `Install App` when the browser can install the app or the address has
  `?force_install`, and shows `Installed` in an installed app.

## How to get to it (user POV)

- Open the app once with a network. Later, open the same address without one.
- After a new deployment, open or reload the app, and choose `Update Available`
  in the header.
- Choose `Install App` under `Offline` in the settings, or install the app
  from the browser.

## Driving it with pnpm verify

Journey: `pnpm verify offline` runs `e2e/journeys/offline.journey.ts`.

Preconditions:

- The project `verify-offline`, which `pnpm verify` adds only when this
  journey runs. It builds the next version of the app with another build ID,
  serves a copy of the first build on a second free port, and gives the
  journey both folders.
- A new browser context with empty storage at `/`, and clipboard permissions,
  which the journey grants itself, for the paste.

- **Open the app.** Go to `/`. The heading `Ergogen Web UI` is visible, and a
  service worker controls the page. `observed.serviceWorker` keeps its scope
  and script.
- **Choose Empty Configuration.** The header shows `Untitled 1`.
- **Paste the outline travel.** The label `Download travel.dxf` appears within
  30 seconds, and no error banner shows.
- **Go offline and reload the page.** The browser goes offline. The page comes
  from the service worker, and a fetch of `build-id.txt`, which the worker does
  not cache, fails, so the network is cut. The header shows `Untitled 1`,
  `Download travel.dxf` appears again from a generation without the network,
  and `Download configuration` saves the pasted configuration.
- **Go online and deploy the next version.** The browser goes online, and the
  journey copies the next build over the served files. `build-id.txt` answers
  the next build ID, not the one that the page runs. `observed.servedBuildId`
  keeps it.
- **Reload the page.** The button `Update Available` appears within 30
  seconds, and the page still runs the first build.
- **Choose Update Available.** The page reloads into the next build, the chip
  goes, and `Untitled 1` opens with `Download travel.dxf` and the same
  configuration. `observed.buildIdAfterUpdate` keeps the build ID.
- **Proof.** `reports/verify/offline/` holds a screenshot and an ARIA snapshot
  after each step, and `result.json` with the observed values.

The journey does not drive `offline-images`, `update-force`, or `install`. Do
not report them as verified by this journey.

`pnpm test:e2e` covers part of the feature too. `e2e/service-worker.spec.ts`
checks `offline-images` and the scope of the worker at the root and below a
subpath, and `e2e/service-worker-update.spec.ts` checks the update below a
subpath, that no third worker installs, and the next version offline.
`src/serviceWorkerRegistration.test.ts` and `src/service-worker.test.ts` check
the registration and the routes without a browser.

## Gotchas

- The journey deploys over the files that its server serves, so it has its own
  server and copy of the build. Never change the folder of the first server,
  which the other journeys use.
- `vite preview` reads each file when a request asks for it, so a copy into
  the served folder changes the next answer. The browser asks for
  `service-worker.js` on a navigation, so reload after the deploy.
- The project resolves no host name. Once the fixture aborts a request of the
  service worker, such as one for Google Fonts, Chromium installs a new worker
  on each navigation, and the chip can stay hidden. See `e2e/fixtures.ts`.
- `context.setOffline(true)` cuts the network of the page and of its service
  worker. A fetch of `build-id.txt` proves the cut, because only the server has
  that file.
- The first visit installs the worker and caches the whole app, which takes
  several seconds. Wait for a worker that controls the page before going
  offline.
- The meta tag `ergogen-build-id` names the build that runs in the page. The
  user does not see it.
- Two builds of one commit differ in their bytes, because the bundle of the
  engine worker differs. A second build with the same build ID still installs
  as an update, so only a changed build ID proves another version.
