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
| `pnpm validate`                                  | `validate:fast` plus the production build (what deployment requires; PR CI also runs Playwright).                                |
| `pnpm validate:extended`                         | `validate:fast` plus a fresh production build, all Playwright tests and `pnpm test:reports`.                                     |
| `pnpm test:reports`                              | Checks the JUnit reports against the [evidence contract](#pull-request-evidence).                                                |
| `pnpm test:e2e`                                  | Playwright only. Install the browser once with `pnpm exec playwright install chromium`.                                          |
| `pnpm fix`                                       | Applies Prettier and supported ESLint/markdownlint fixes.                                                                        |
| `pnpm exec vitest run <path> --reporter=verbose` | One test file with per-test output. (`pnpm test:unit --verbose` is not a valid form.)                                            |

A Vite build does not type-check; only `pnpm typecheck` (part of `validate:fast`)
does. Application code uses the strict root `tsconfig.json`; browser tests, policy
tests and configuration files use `tsconfig.tooling.json`. Husky/lint-staged run
quick fixes on staged files; GitHub enforces validation independently.

Vitest writes `reports/unit.xml`. Playwright writes `reports/browser.xml`, an HTML
report and traces/screenshots of failures (no retries). `pnpm test:reports` writes
`reports/evidence.json`. Attach them, with the commit and exact command, to
failure reports. All outputs are Git-ignored.

### Browser tests

`playwright.config.mts` builds production apps with unique `VITE_BUILD_ID`s and
serves each with `vite preview --strictPort` on its own free loopback port. Every
project's metadata names its server and build; `e2e/global-setup.ts` fails the run
unless each `build-id.txt` matches, so tests never reach a stale or foreign server.
A build ID also adds an `ergogen-build-id` meta tag to `index.html`.

| Project                   | Build and server                                           | Tests                                             |
| ------------------------- | ---------------------------------------------------------- | ------------------------------------------------- |
| `chromium`                | `dist/` at base `/`                                        | All except the update drill.                      |
| `chromium-subpath`        | `dist-subpath/` at `/ergogen-gui/`                         | `base-path.spec.ts` and `service-worker.spec.ts`. |
| `chromium-subpath-update` | A fresh copy, `dist-subpath-served/`, of the subpath build | `service-worker-update.spec.ts`.                  |

The update drill deploys `dist-subpath-next/` (the same base, another build ID)
by copying it over the served copy, which `vite preview` reads on each request,
then checks that the real worker waits, shows **Update Available** and activates.
Each drill changes the served copy, so it needs a fresh `pnpm test:e2e` run; do not
use `--repeat-each` or retries. Playwright routes cannot stand in for that
deployment: Chromium fetches the worker script for update checks outside the page. `pnpm exec playwright test --project chromium-subpath` selects tests, but every server still builds; the
`PLAYWRIGHT_*` variables in the config can pin ports and IDs.

`CI` forbids `.only` and sets two workers. The fixture blocks external requests,
including those made by service workers; provider tests route deterministic
responses. Service worker tests check images by their natural width, because a
missing file below the base returns `index.html` with HTTP 200.

Other test suites worth knowing: `tests/workflow-security.test.ts` checks
workflow policy; `tests/build-version.test.ts` checks build-time engine identity.

### Semantic regression corpus

These Vitest suites catch wrong generated output, not only crashes, by checking
geometry and structure instead of byte snapshots. They run the prepared engine
offline and only read their fixtures.

- **Inputs** in `tests/corpus/`: `staggered-thumbs.yaml` (column stagger, a
  rotated and splayed thumb cluster, a private `_plate` outline, a vendor and a
  custom footprint), the custom footprint `footprints/corpus/probe_pad.js`, and
  two invalid configs (YAML syntax, missing outline). Expected values are worked
  out by hand in `tests/corpus/corpus.ts`, never copied from output.
- **`tests/engine-corpus.test.ts`** starts with four quick checks that call
  `ergogen.process` directly on a two-key config. Its corpus cases generate
  through the app's own worker handler and injection evaluator
  (`tests/corpus/inProcessWorker.ts` replaces only the `Worker` transport).
  They check key positions and rotations, outline sizes and region counts, that
  DXF and SVG hold the same segments, footprint placement and nets, Edge.Cuts
  against the board outline, error replies for invalid input, and that a second
  run gives identical output.
- **`tests/export-corpus.test.ts`** runs `createZip` and
  `exportConfigsProgressively` with real JSZip (only the download and the
  worker transport are replaced). It checks archive names, the exact file list,
  file contents and geometry, that a single-config archive reloads as just its
  config and injections, that a configs-only archive holds no generated files,
  and that a failed config gets `error.txt` instead of outputs. It counts the
  switch and probe pad footprints separately before checking their placement.
- **Shared engine:** all requests in one test file share one engine, so a
  footprint injected once stays registered, unlike browser bulk export, which
  starts a fresh worker per config. Bulk export therefore uses the probe pad
  under its own name (`bulkProbePadInjection` in `tests/corpus/corpus.ts`), so
  it fails if it does not pass its injections to the worker.
  `tests/corpus-in-process-worker.test.ts` checks the adapter itself: a handler
  that throws or does not reply reaches `onerror` at once, and a failed import
  restores the globals it replaced.
- **`tests/preview-consistency.test.ts`** regenerates the geometry of every
  tracked preview in `public/images/previews` and compares it with the file,
  ignoring path direction and start point, and requires one preview per
  example. It covers these previews only, not other generated files.
- **`tests/corpus-inspect.test.ts`** checks the SVG reader the suites share: the
  viewBox must be four finite numbers that frame the paths exactly, and only
  closed chains count as regions.

Only documented volatile data is ignored: the KiCad 8 title-block date (see
`withoutPcbGenerationDate`) and the date in archive names, matched by pattern.

When a change is meant to alter output, such as an engine or footprint pin
update, first check the new output yourself (open it in the app or KiCad). Then
update the hand-worked values in `tests/corpus/corpus.ts` or the affected
assertion, and explain the change in the pull request. For a stale preview, run
`pnpm generate-previews` and review the SVG diff.

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
  its file extension (`.js`; repository outlines may also be `.svg`). Repositories
  also follow matching Git submodules. ZIP and `.ekb` archives use the same
  layout (`.js` only); size limits are in `src/utils/ergogenBundleLoader.ts`.
- **Conflicts**: every source (repository, archive, share link) merges through
  `src/utils/injections.ts`; on a name clash the user chooses skip, overwrite or
  keep both (`name_1`), optionally for all remaining clashes.

## Sharing

`src/utils/share.ts` encodes `{ config, injections?, guiVersion, ergogenVersion }`
with `lz-string` into the URL hash; the README documents the public contract. The
share dialog runs a temporary worker in debug mode and offers only the
footprints, templates and outlines referenced in the canonical PCB or outline
output.

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
   or commit), the installed package version is used instead, so features turn on
   only if that installed version is 4.3.0 or later (unless a rule above wins).

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
`predev`, `prestart`, `prebuild` and `pretest:unit`) copies it to
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
  unpersisted checkout credentials: `pnpm validate`, then Playwright, then
  `pnpm test:reports`, then uploads `reports/` and Playwright output (see
  [Pull request evidence](#pull-request-evidence)).
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
  credentials, the artifact handoff, the shared validation step, the
  publisher's allowed inputs, and that `ci.yaml` and the ruleset proposal match
  the evidence contract; update it with any workflow change.

### Pull request evidence

`scripts/ci/contract.mts` defines what a passing pull request run is: the one
job `lint-and-test` of `ci.yaml`, its four named steps, and two JUnit reports that
each hold at least one test with no failures, errors or skipped tests (Vitest and
Playwright exit 0 when tests are skipped). The browser report must include every
Playwright project. Test counts are deliberately not pinned.

In CI, `pnpm test:reports` runs even after a failed step. It fails the job when
the reports break the contract, and writes the identities, step outcomes, counts
and failed tests to the job summary and `reports/evidence.json`. The artifact is
`validation-<PR head>-attempt-<n>`; `github.sha` is not the head but the merge
commit GitHub tested (head merged into the base at that time).

Everything a pull request run produces comes from code that pull request can
change. To assess it, run this from an up-to-date `main` checkout, never from the
PR branch:

```shell
pnpm assess:pr <number> [--json]
```

It only reads, through `gh api`, and exits 0 only if all of these hold:

- The PR is open and targets `main`, and its head and base did not change
  while it was assessed.
- The newest `ci.yaml` `pull_request` run for that exact head completed with
  success, and every job of its latest attempt succeeded, with each required step.
- The only latest `lint-and-test` check on the head is that job, created by the
  GitHub Actions app (ID 15368), so a same-named check from another workflow or
  app fails the assessment.
- The artifact of that run and attempt exists, was created during the attempt,
  matches its published SHA-256 digest, and its reports meet the contract when
  checked again with `main`'s code.
- Its evidence names this PR, head, run and attempt, and the tested commit is a
  merge of the head into the PR's current base. If the base has moved, update
  the branch.

It exits 1 with a list of problems otherwise, and 2 if it cannot run (a GitHub API
error or an unexpected response shape). To triage a failure, open the run and job
links it prints, read the job summary, then download the artifact for the reports,
the Playwright HTML report and traces. Artifacts expire after seven days; rerun
the workflow to assess again. `--allow-closed` assesses a merged PR for audits only.

### Branch rules

As of 2026-11-14, nothing enforces these checks: `main` has no branch protection
or ruleset, so a failed or missing check, or a failed assessment, does not block
a merge. `scripts/ci/ruleset-proposal.json` is a proposed ruleset, not yet
applied. It requires `lint-and-test` from the GitHub Actions app, up to date
with `main`, plus a pull request with resolved conversations, and blocks force
pushes and deletion, with no bypass and no required approval. The owner is the
only collaborator, and GitHub does not count an author's approval of their own
pull request. Tests keep it in line with the contract. Only the repository owner
applies it, after review:

```shell
gh api --method POST repos/ceoloide/ergogen-gui/rulesets --input scripts/ci/ruleset-proposal.json
```

## Service worker

`src/service-worker.ts` is built by `vite-plugin-pwa` in `injectManifest` mode and
registered by `src/serviceWorkerRegistration.ts` only in production builds and
from the same origin.

- **Precache**: every built `.js`, `.css` and `.html` file, including the local
  Monaco copy and `public/dependencies`: about 21 MB, 16 MB of it Monaco (the
  TypeScript worker alone is about 7 MB, hence the 8 MiB per-file limit). This is
  what makes offline start and editor language support work, at a large first
  download.
- **Runtime**: navigations fall back to the precached `index.html`. Images under
  `images/`, `ergogen.png` and `favicon.ico` are cached on first use
  (cache-first), as is any file under `dependencies/` missing from the precache.
  These routes match below the build's base path. Google Fonts use
  stale-while-revalidate (CSS) and cache-first (font files).
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
  query string and hash. Structured generation metrics carry no config names,
  authors, filenames, repository URLs or zone/column/row names; `meta.name` and
  `meta.author` only feed a 12-character SHA-256 `config_id`. Error text is
  scrubbed on a best-effort basis: `trackEvent()` keeps its first line, masks
  quoted values and caps it at 100 characters, so unquoted user text in an error
  message can still be sent.
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

`CHANGELOG.md` holds user-facing changes, newest first. Its conventions live in
the [changelog skill](.agents/skills/ergogen-gui-changelog/SKILL.md).
