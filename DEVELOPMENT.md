# Development guide

This file records how the app works and how to change it safely. Install, run and
self-hosting steps live in [README.md](README.md); rules for every change live in
[AGENTS.md](AGENTS.md). Future work belongs in
[GitHub issues](https://github.com/ceoloide/ergogen-gui/issues), not here.

## Validation

Install exactly as in the README (Node from `.node-version`, pnpm from
`packageManager`, `PNPM_CONFIG_BLOCK_EXOTIC_SUBDEPS=false pnpm install
--frozen-lockfile`). Validation also needs the native tools listed in the README;
on Linux x86_64 run `pnpm tools:install` and add `$PWD/.tools/bin` to `PATH`. CI
uses the same installer and commands.

| Command                                          | Checks                                                                                                                           |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm validate:fast` (= `pnpm precommit`)        | Prettier, Markdown, ESLint, Knip, actionlint, zizmor, ShellCheck, both TypeScript projects, all Vitest tests. Never edits files. |
| `pnpm validate`                                  | `validate:fast` plus the production build (what CI requires).                                                                    |
| `pnpm validate:extended`                         | `validate:fast` plus a fresh production build and all Playwright tests.                                                          |
| `pnpm test:e2e`                                  | Playwright only. Install the browser once with `pnpm exec playwright install chromium`.                                          |
| `pnpm fix`                                       | Applies Prettier and supported ESLint/markdownlint fixes.                                                                        |
| `pnpm exec vitest run <path> --reporter=verbose` | One test file with per-test output. (`pnpm test:unit --verbose` is not a valid form.)                                            |

A Vite build does not type-check; only `pnpm typecheck` (part of `validate:fast`)
does. Application code uses the strict root `tsconfig.json`; browser tests, policy
tests and configuration files use `tsconfig.tooling.json`. Husky/lint-staged run
quick fixes on staged files; GitHub enforces validation independently.

Vitest writes `reports/unit.xml`. Playwright writes `reports/browser.xml`, an HTML
report and traces/screenshots of failures (no retries). Attach them, with the
commit and exact command, to failure reports. All outputs are Git-ignored.

### Browser tests

`playwright.config.mts` picks a free loopback port (or `PLAYWRIGHT_TEST_PORT`),
builds the production app with a unique `VITE_BUILD_ID` (`PLAYWRIGHT_BUILD_ID`,
generated when unset) at base `/`, and serves it with `vite preview --strictPort`.
`e2e/global-setup.ts` fails the run unless `build-id.txt` matches, so tests never
reach a stale or foreign server. `CI` forbids `.only` and sets two workers. The
fixture blocks external requests; provider tests route deterministic responses.
One GitHub import regression is disabled pending
[#227](https://github.com/ceoloide/ergogen-gui/issues/227).

Other test suites worth knowing: `tests/engine-corpus.test.ts` runs the prepared
engine on a small corpus (key count, outline size, KiCad 8 footprints, invalid
footprint rejection); `tests/workflow-security.test.ts` checks workflow policy;
`tests/build-version.test.ts` checks build-time engine identity.

## Source layout

Components follow atomic design: `src/atoms`, `src/molecules`, `src/organisms`,
`src/pages`. Global state is `src/context/ConfigContext.tsx`; pure logic is in
`src/utils`; workers are in `src/workers`; theme tokens are in
`src/theme/theme.ts`. `index.html` loads the classic-script helpers in
`public/dependencies` (maker.js, KLE parser, KiCanvas and others) before
`src/index.tsx`.

## Generation

- `ergogen.worker.ts` runs Ergogen; `jscad.worker.ts` turns its output into 3D
  previews and STL. `src/workers/workerFactory.ts` creates both, so tests can mock
  `Worker`.
- Ergogen keeps injected footprints, templates and outlines in a module-level
  registry. Closing the settings panel therefore terminates and recreates the
  Ergogen worker, then regenerates, so renamed or deleted injections cannot
  linger. Auto-generation is paused while settings are open.
- `src/utils/injectionEvaluator.ts` evaluates injection code with `new Function`
  inside the worker, with a `require` that only resolves `makerjs` and Ergogen
  internals. This is not a sandbox: injected code, including code from share links
  and imported repositories, runs in a same-origin worker with no further
  isolation, so loading it means trusting it.
- The Monaco editor is uncontrolled. Keystrokes update context after a 500 ms
  debounce (context updates re-render widely and persist all configurations);
  blur flushes it. Download and generate actions read the current buffer through
  `getRealtimeConfigInput()` rather than the debounced state.

## Loading and injections

- **Providers** register in `src/utils/gitProvider.ts`. GitHub handles
  `github.com` and bare `owner/repo`; Codeberg handles `codeberg.org`; the Forgejo
  provider handles any other HTTP(S) host (Forgejo and Gitea share its API). All
  requests are unauthenticated and bounded by `GIT_BFS_MAX_REQUESTS` and
  `GIT_BFS_MAX_DEPTH` in `src/context/constants.ts`. GitHub rate-limit responses
  become user-facing messages; authenticated requests are tracked in
  [#164](https://github.com/ceoloide/ergogen-gui/issues/164).
- **Repository and archive layout**: `config.yaml` at the root (repositories also
  try `ergogen/config.yaml` and then search for other YAML files), with optional `footprints/`, `outlines/` and
  `templates/` folders. Injection names are the path inside that folder without
  `.js`. Repositories also follow matching Git submodules. ZIP and `.ekb` archives
  use the same layout; size limits are in `src/utils/ergogenBundleLoader.ts`.
- **Conflicts**: every source (repository, archive, share link) merges through
  `src/utils/injections.ts`; on a name clash the user chooses skip, overwrite or
  keep both (`name_1`), optionally for all remaining clashes.

## Sharing

`src/utils/share.ts` encodes `{ config, injections?, guiVersion, ergogenVersion }`
with `lz-string` into the URL hash; the README documents the public contract. The
share dialog runs a temporary worker in debug mode and offers only footprints
that appear in the canonical PCB output, plus all templates and outlines.

On load, `App.tsx` decodes the hash, then shows `ShareVersionCompatibilityDialog`
if the link's GUI or Ergogen version is newer than the running one or its engine
is custom. Links without versions are treated as GUI `0.9.0` and
`github:ergogen/ergogen#v4.2.1`, so old links keep loading. Decode and validation
failures show distinct messages; `?debug` logs the decoded payload.

## Feature flags

`src/utils/featureFlags.ts` gates custom templates and outlines (Ergogen 4.3.0 and
later). The first match wins:

1. URL `?ff_templates=` / `?ff_outlines=` set to literal `true` or `false`.
2. Build variables `VITE_FEATURE_*` (else `REACT_APP_FEATURE_*`), literal `true` or
   `false`.
3. The engine version from `VITE_ERGOGEN_VERSION`. If that is not semver (a branch
   or commit), the installed package version is used. A custom ref is not enabled
   automatically.

Gates apply in the injections panel, local and repository loaders, and on the main
thread before generation, so stale stored injections cannot reach an engine that
rejects them.

## Configurations and storage

`ConfigContext` keeps several configurations in `localStorage` under
`ergogen:multi-config` (version 2 stores an SVG preview per configuration) and
migrates the older single-config keys on startup. Configurations without a preview
are compiled in the background without the STL stage. Bulk export (`src/utils/zip.ts`) compiles every
configuration with a worker pool.

## Engine and footprints

The installed `ergogen` package is read-only: pnpm hard-links it from a shared
store. `patch/patch_ergogen.sh` (`pnpm build-ergogen`, run by `postinstall`,
`predev`, `prebuild` and `pretest:unit`) copies it to
`node_modules/.ergogen-engine`, links its installed dependencies, fetches the two
footprint libraries at full commit SHAs, installs `patch/footprints_index.js` and
checks that the engine loads. It never runs a nested install or build or changes
Git configuration. An input stamp makes repeat runs a no-op; changed inputs also
clear the Vite cache. Vite and Vitest alias `ergogen` and its subpaths to this
copy.

Footprint pins and sources default in the script and can be overridden for one
run:

| Variable                                                      | Use                              |
| ------------------------------------------------------------- | -------------------------------- |
| `CEOLOIDE_FOOTPRINTS_COMMIT`, `INFUSED_KIM_FOOTPRINTS_COMMIT` | Another full 40-character SHA.   |
| `CEOLOIDE_FOOTPRINTS_URL`, `INFUSED_KIM_FOOTPRINTS_URL`       | A mirror of the same repository. |

Change the defaults only through a reviewed PR with full validation including
browser tests. Engine preparation tests use local Git fixtures and need no
network.

### Engine experiments

Canonical installs, CI and deployment use the `package.json` specifier and the
frozen lockfile. To change the production engine, update both in a reviewed PR.
To try another engine, use a separate checkout:

```shell
export ERGOGEN_VERSION=github:ceoloide/ergogen#develop   # or ergogen@<version>
node scripts/preinstall.js
PNPM_CONFIG_BLOCK_EXOTIC_SUBDEPS=false pnpm install --no-frozen-lockfile
pnpm dev
```

pnpm 11 reads the manifest before the root `preinstall` hook, so the script must
run first. It backs up `package.json`; `postinstall` restores it. Keep
`ERGOGEN_VERSION` set: preparation fails if it differs from the installed
specifier, and Vite also uses it as the displayed engine identity. Never commit
the experiment's `package.json`, `pnpm-lock.yaml` or preview SVGs. Restore
canonical inputs and reinstall with `--frozen-lockfile` before reporting
canonical results.

Example preview SVGs in `public/images/previews` are tracked. Regenerate them only
with `pnpm generate-previews` and review the diff; builds never rewrite them.

## CI and deployment

- `ci.yaml` runs on pull requests to `main` with a read-only token and
  unpersisted checkout credentials: `pnpm validate`, then Playwright, then uploads
  `reports/` and Playwright output as `validation-<sha>`.
- `deploy.yaml` runs on pushes to `main`, manual dispatch and
  `repository_dispatch`, never on pull requests. Its read-only `build` job
  validates, builds, adds `404.html` and (on `main`, if `CNAME_DOMAIN` is set)
  `CNAME`, then uploads `dist` as a one-day artifact. The `deploy` job, the only
  one with `contents: write`, runs only on `main`, downloads the artifact and
  publishes it to `gh-pages` with `peaceiris/actions-gh-pages`. It never checks
  out or runs repository code.
- Production runs share the `pages` concurrency group without cancellation.
  GitHub keeps one pending run per group, so a newer push replaces a queued older
  one (not FIFO); the latest `main` still deploys. Manual runs on other branches
  build in their own group and never publish.
- Build variables come from repository variables; see the README configuration
  section. Note that CI prefers `REACT_APP_GTAG_ID` over `VITE_GTAG_ID`, the
  reverse of `vite.config.mts`
  ([#230](https://github.com/ceoloide/ergogen-gui/issues/230)).
- Actions are pinned by commit and updated by Dependabot with a seven-day
  cooldown. `tests/workflow-security.test.ts` asserts permissions, triggers,
  credentials, the artifact handoff, the shared validation step and the
  publisher's allowed inputs; update it with any workflow change.

## Service worker

`src/service-worker.ts` is built by `vite-plugin-pwa` in `injectManifest` mode and
registered by `src/serviceWorkerRegistration.ts` only in production builds and
from the same origin.

- **Precache**: every built `.js`, `.css` and `.html` file, including the local
  Monaco copy and `public/dependencies`: about 21 MB, 16 MB of it Monaco (the
  TypeScript worker alone is about 7 MB, hence the 8 MiB per-file limit). This is
  what makes offline start and editor language support work, at a large first
  download.
- **Runtime**: navigations fall back to the precached `index.html`. Google Fonts
  use stale-while-revalidate (CSS) and cache-first (font files). The routes for
  `dependencies/` and images join `BASE_URL` with another `/`, so they never match;
  images are therefore not cached offline ([#229](https://github.com/ceoloide/ergogen-gui/issues/229)).
- **Analytics** requests are not intercepted, and activation deletes the
  `workbox-background-sync` database that older builds used to queue hits.
- **Updates**: a changed `service-worker.js` installs as waiting; the header
  shows `UpdateChip`; clicking it posts `SKIP_WAITING` and reloads (with a
  one-second fallback reload). `?force_update` and `?force_install` show the update
  and install controls for testing.

## Analytics and privacy

`src/utils/analytics.ts` owns consent and transport. `src/index.tsx` calls
`initAnalytics()` before rendering; the settings switch re-runs it.

- **No tag ID, no analytics.** Without `VITE_GTAG_ID` (or `REACT_APP_GTAG_ID`) the
  script is never loaded, and minification removes the loader. The settings switch
  still renders from stored consent ([#230](https://github.com/ceoloide/ergogen-gui/issues/230)).
- **Consent**, first match wins: a choice made this session whose storage write
  failed; the explicit key `ergogen:consent:sendUsageMetrics`; a stored `false` in
  the legacy `ergogen:config:sendUsageMetrics` or `ergogen:settings` (a stored
  `true` there is ignored because old builds wrote it automatically); otherwise on
  in a browser tab and off in standalone PWA mode. Unreadable storage means off.
- **Environment block**: no hits from Vite development builds or `localhost`,
  `127.0.0.1`, `[::1]`, `*.localhost`, unless `VITE_FORCE_ANALYTICS=true`,
  `window.__FORCE_ANALYTICS__ = true` before load, or a `G-TEST*` ID. Tests
  (`MODE === 'test'`) are never blocked. No override bypasses consent. To check
  hits without sending them, intercept `/g/collect` in the browser.
- **Opt-out mid-session** sets `ga-disable-<ID>`, expires `_ga*` cookies and
  removes error listeners; opting back in resumes without a reload.
- **Data minimization**: no automatic page views, Google Signals or ad
  personalization; `App.tsx` sends one `page_view` per route. `page_location` drops
  query string and hash. No user-written text is sent (config names, authors,
  filenames, repository URLs, zone/column/row names); `meta.name` and
  `meta.author` only feed a 12-character SHA-256 `config_id`. `trackEvent()`
  scrubs error text to its first line, masks quoted values and caps it at 100
  characters.
- **Generation events** (`generation_completed`, `generation_failed`,
  `keyboard_generated`, from `ConfigContext` and `configAnalyzer.ts`) wait for a
  5-second quiet period during auto-generation, are sent at once for manual runs,
  skip unchanged `config_id`s, reset lineage when switching configurations and
  flush on `pagehide` or when the page is hidden.

### Google Analytics property setup

Only maintainers of a GA4 property need this; self-hosting needs no Google
account. GA reports only custom parameters registered on the property.
`scripts/ga/ga-config.mjs` declares them, and `scripts/ga/ga-config.test.mjs`
fails when the app sends an unregistered parameter. Register new parameters in
the same change, and move ones no longer sent to `retired` instead of deleting
them.

`scripts/ga/ga-admin.mjs` applies the config through the GA Admin API:

```shell
pnpm ga:setup -- --property <id> [--stream <id>] [--prune-retired] [--apply]
pnpm ga:teardown -- --property <id> --apply --confirm <id>
```

Without `--apply` both commands only print the plan, but they still authenticate
and read the property. `GA_PROPERTY_ID` can replace `--property`. Credentials, in
order: `GA_ACCESS_TOKEN` (a token with the `analytics.edit` scope);
`GA_SERVICE_ACCOUNT` (a service account with Editor access, impersonated through
the IAM Credentials API using your `gcloud` login); otherwise
`gcloud auth application-default print-access-token`. Setup never changes a
registration's type and touches only event-scoped registrations. Teardown archives
managed dimensions and metrics irreversibly, hence `--confirm`.

## Changelog

`CHANGELOG.md` holds user-facing changes, newest first: features, notable fixes
and workflow changes, not refactors or dependency bumps. Copy the shape of the
latest entry: title, date, screenshot, a short problem and solution, and a **What
changed** list, under 300 words.
