# Development guide

This file documents how Ergogen GUI works and how to change it safely. Read
[README.md](README.md) for installation, local development, and self-hosting,
and [AGENTS.md](AGENTS.md) for the rules that apply to every change. Track
future work in [GitHub issues](https://github.com/ceoloide/ergogen-gui/issues),
not in this file. Put records of past events, measurements, and the reasons
behind these rules in [docs/records/](docs/records/), and link to them from
here.

## Validation

Install dependencies as [Run locally](README.md#run-locally) describes and the
native validation tools on your `PATH` as [Contributing](README.md#contributing)
describes. CI runs the same installer and commands. The
[acceptance record](docs/records/acceptance-hc-001-to-hc-004.md) shows how this
validation was checked.

These commands run validation and tests:

- `pnpm validate:fast`, alias `pnpm precommit`, runs Prettier, markdownlint,
  ESLint, Knip, actionlint, zizmor, ShellCheck, both TypeScript projects, our
  declaration check, and all Vitest tests. It never modifies files.
- `pnpm validate` runs `pnpm validate:fast` and the production build.
  Deployment requires it, and pull request CI adds Playwright.
- `pnpm validate:extended` runs `pnpm validate:fast`, a fresh production build,
  all Playwright tests, and `pnpm test:reports`.
- `pnpm test:reports` checks the JUnit reports against the
  [pull request evidence contract](#pull-request-evidence).
- `pnpm test:e2e` runs Playwright across root, subpath, and service-worker
  update builds. Install Chromium once with
  `pnpm exec playwright install chromium`.
- `pnpm test:e2e:root` sets `PLAYWRIGHT_ROOT_ONLY=1`, so only the root `dist/`
  builds and runs, unless `CI` is set.
- `pnpm test:contract` runs only the
  [engine contract tests](#engine-contract-tests) with the installed engine and
  writes `reports/contract.xml`.
- `pnpm fix` applies Prettier and supported ESLint and markdownlint fixes.
- `pnpm exec vitest run <path> --reporter=verbose` runs one test file with
  per-test output. `pnpm test:unit --verbose` is not a valid form.

A Vite build does not check types. Only `pnpm typecheck` checks types, and
`pnpm validate:fast` runs it. Husky and `lint-staged` run quick fixes on staged
files before a commit, and GitHub enforces full validation on pull requests.

`pnpm validate:fast` checks every maintained file group. A declaration file
must belong to one of the two TypeScript projects, or
`pnpm typecheck:declarations` fails.
[Validation background](docs/records/background.md#validation) lists the
checks for each file group and the files that validation intentionally skips.

Vitest writes `reports/unit.xml`, and `pnpm test:reports` writes
`reports/evidence.json`. Playwright runs without retries and writes
`reports/browser.xml`, an HTML report, failure traces and screenshots, and a
[readiness summary](#browser-tests) for each failed test. `E2E_SCREENSHOTS=1`
also saves a full-page screenshot at each test step in `e2e/screenshots/`. Git
ignores all report and screenshot outputs. When you report a failure, attach
the relevant reports and traces with the commit SHA and exact command.

### Local iteration loop

Follow this sequence while you develop and before handoff:

1. Run a targeted unit test while you change logic:
   `pnpm exec vitest run <path> --reporter=verbose`.
2. Run pre-commit checks with `pnpm precommit` to verify formatting, linting,
   Knip, types, and unit tests.
3. For root UI changes, run a targeted browser test with
   `pnpm test:e2e:root e2e/<name>.spec.ts`.
4. Before handoff, run `pnpm validate` to check the production build. Run
   `pnpm validate:extended` or `pnpm test:e2e` to check the root, subpath, and
   service-worker update browser tests.

### Browser tests

`playwright.config.mts` builds production apps with unique `VITE_BUILD_ID`
values and serves each build with `vite preview --strictPort` on its own free
loopback port. `e2e/global-setup.ts` fails the run unless every server's
`build-id.txt` matches its expected ID. Playwright runs these projects:

- `chromium` serves `dist/` at base `/` and runs all specs except the update
  drill.
- `chromium-subpath` serves `dist-subpath/` at base `/ergogen-gui/` and runs
  `base-path.spec.ts` and `service-worker.spec.ts`.
- `chromium-subpath-update` serves `dist-subpath-served/`, a fresh copy of
  `dist-subpath/`, and runs `service-worker-update.spec.ts`.

The update drill copies `dist-subpath-next/`, built with the same base path and
another build ID, over `dist-subpath-served/`, which `vite preview` reads on
each request. It verifies that the real service worker waits, shows
**Update Available**, activates on click, and installs no other worker. Each
drill modifies `dist-subpath-served/`, so run it in a fresh `pnpm test:e2e`
invocation, without `--repeat-each` or retries.

`pnpm exec playwright test --project chromium-subpath` runs only that project's
tests but still builds every server. The `PLAYWRIGHT_*` variables in
`playwright.config.mts` pin ports and build IDs.

When `CI` is set, Playwright forbids `.only` and runs two workers. The shared
fixture blocks external network requests, including those from service workers
and dedicated workers. Provider tests route deterministic responses, and
`e2e/utils/githubMocks.ts` answers every `api.github.com` and
`raw.githubusercontent.com` request, including unknown endpoints, so browser
tests use no GitHub API quota and need no token. The app opens no WebSockets,
and routes do not intercept them, so give any new one its own block.

In the update drill, the browser resolves no host names and ignores environment
proxies. The fixture passes that service worker's Google Fonts requests through,
so they fail at name resolution. Do not abort them through DevTools.
Service-worker tests check images by their natural width because a missing file
below the base path returns `index.html` with HTTP 200.
[Browser tests background](docs/records/background.md#browser-tests) explains
these rules and records timings.

A failed test's `readiness` attachment,
from `e2e/utils/readiness.ts`, records how busy the CPUs were, how many
generation requests the Ergogen worker received and finished, and the app's
worker milestones. It helps separate CPU starvation from an app fault but does
not prove the cause. A request still
running near 100% CPU fits a starved machine. A finished generation without the
expected outputs points to an app fault, even at 100% CPU. The console prints
its first 300 characters, and the HTML report includes all of it.

### Other test suites

These suites in `tests/` check workflows, releases, documentation, and
build-time settings:

- `tests/workflow-security.test.ts` checks workflow security policy.
- `tests/release-publication.test.ts` runs the release and rollback steps of
  `deploy.yaml` against local Git repositories and a loopback server that
  answers like GitHub Pages, as
  [Release tests](docs/records/background.md#release-tests) details.
- `tests/build-version.test.ts` checks build-time engine identity.
- `tests/analytics-tag-id.test.ts` checks the build-time analytics tag ID.
- `tests/markdown-links.test.ts` checks that every relative link in Markdown
  files reaches an existing file and heading.

### Engine contract tests

`tests/engine-contract/` holds the tests and fixtures that run the real engine
and assert what it generates, including the
[semantic regression corpus](#semantic-regression-corpus) and the preview
consistency check. They define the output contract of the canonical engine
pinned in `package.json`. Put every new test of engine output there, not in
`src/` or elsewhere in `tests/`.

When the `ERGOGEN_VERSION` environment variable is non-empty, as in a
deployment that selects another engine, `vitest.config.mts` excludes
`tests/engine-contract/` from `pnpm test:unit` and `pnpm validate`, even for a
contract test file named on the command line, and prints a
`[vitest] ... excluding tests/engine-contract/**` notice. To run contract tests
against the installed engine, run one file with
`pnpm exec vitest run --mode contract tests/engine-contract/<file>` or all of
them with `pnpm test:contract`.

Every other test runs with every engine:

- **GUI tests use the canonical engine version.** `src/setupTests.tsx` pins
  `installedEngineVersion` in `src/utils/engineRequirements.ts` to the version
  in the `package.json` engine specifier, even inside a `^` or `~` range. If the
  specifier names no version, such as a branch or commit, GUI tests use the
  installed version. While any deployment selects an older engine, keep a
  version in the specifier, such as a `#v4.4.0` tag or a version range, or that
  deployment's GUI tests fail. To test another engine version, use
  `vi.mocked(installedEngineVersion).mockReturnValue(...)`.
- **`tests/engine-smoke.test.ts`** uses the real installed engine version. It
  verifies that the app's worker handler and prepared engine generate every
  example that `src/examples/supported.ts` enables for that engine, so new
  examples need no change in this test.
- **`src/examples/supported.test.ts`** fails if an example requires a newer
  engine than the canonical engine, so the canonical site hides nothing. The
  preview consistency check generates every example on the canonical engine.

### Semantic regression corpus

The corpus checks generated geometry and structure instead of byte snapshots.
Its suites run the prepared engine offline and read only their fixtures. In
`tests/engine-contract/`, `engine-corpus.test.ts` covers generation,
`export-corpus.test.ts` covers archive export, and
`preview-consistency.test.ts` covers the tracked previews.
The [corpus record](docs/records/semantic-regression-corpus.md) lists what each
suite and fixture checks. Follow these rules when you change the corpus:

- Calculate expected values in `tests/engine-contract/corpus/corpus.ts`
  manually. Never copy them from generated output.
- Ignore only documented volatile data. The corpus ignores the KiCad 8
  title-block date, which `withoutPcbGenerationDate` strips, and the date in
  archive names, which tests match by pattern.
- Bulk export tests use the probe pad under its own name,
  `bulkProbePadInjection`, so they fail if bulk export does not pass its
  injections to the worker.

#### Updating corpus expectations

When a change intentionally alters generated output, such as an engine or
footprint pin update, follow these steps:

1. Inspect the new output yourself in Ergogen GUI or KiCad.
2. Update the manual expected values in
   `tests/engine-contract/corpus/corpus.ts` or the affected assertion.
3. Explain the output change in your pull request.
4. For a stale preview SVG, run `pnpm generate-previews` and review the SVG
   diff.

## Source layout

UI components follow atomic design in `src/atoms`, `src/molecules`,
`src/organisms`, and `src/pages`. `src/context/ConfigContext.tsx` holds global
state, `src/utils` holds pure logic, `src/workers` holds Web Workers, and
`src/theme/theme.ts` defines theme tokens.

ESLint enforces the layer order `types`, `theme`, `utils`, `workers`, `hooks`,
`context`, `atoms`, `molecules`, `organisms`, and `pages`.
`import/no-restricted-paths` checks that a folder in `src` imports only from the
folders before it. When code in two layers needs the same thing, move it to the
earlier layer, such as a shared type to `src/types`. `LAYER_EXCEPTIONS` in
`eslint.config.mjs` lists each import that still breaks the order, with one
file, one import, and an expiry date. After that date, the import fails lint.
`import/no-cycle` rejects import cycles in `src`. It skips `import type`
declarations, because the build removes them.

`public/dependencies` contains KiCanvas, which `index.html` loads for PCB
previews, and OpenJSCAD, which `jscad.worker.ts` imports for case previews and
STL conversion. The build bundles Ergogen's dependencies, including Maker.js,
Bezier, hull, and the KLE parser, into the Ergogen worker from installed
packages. They need no separate browser-global scripts.

## Generation

Configuration generation and preview updates work as follows:

- `ergogen.worker.ts` runs Ergogen, and `jscad.worker.ts` converts its output
  into 3D previews and STL files. `src/workers/workerFactory.ts` creates both
  workers so tests can mock `Worker`.
- `src/context/ConfigContext.tsx` matches worker replies to the active
  generation with `src/utils/generationSession.ts`, by request ID for
  `ergogen.worker.ts` and by `configVersion` for `jscad.worker.ts`. It drops
  late replies from older requests or other configurations. Background preview
  replies carry a `background-preview-<configId>` request ID and update only
  their own saved configuration.
- The app generates a configuration as soon as you open it. Auto-generation
  debounces edits by 300 ms and skips any request whose configuration,
  injections, points-only flag, and debug flag match the current or pending
  results, so a duplicate request cannot clear a finished STL conversion. During
  render, `resolvePreview` in `src/utils/preview.ts` selects the active preview
  payload and uses `demo.svg` when the selected output is absent.
- Ergogen keeps injected footprints, templates, and outlines in a module-level
  registry. Closing the settings panel therefore invalidates the generation
  session, terminates and recreates `ergogen.worker.ts`, and regenerates.
  Toggling settings such as STL
  preview restarts neither worker. Auto-generation pauses while settings are
  open.
- `src/utils/injectionEvaluator.ts` evaluates injection code with `new Function`
  inside the worker, with a `require` function that resolves only `makerjs` and
  Ergogen internals. It is not a sandbox. Injected code from share links or
  imported repositories runs in a same-origin worker with no further isolation,
  so load only injections that you trust.
- The Monaco editor is uncontrolled. Keystrokes update `ConfigContext` after a
  500 ms debounce, and editor blur flushes pending edits. **Share**,
  **Archive**, **Generate**, and the `Ctrl+Enter` or `Cmd+Enter` shortcut read
  the latest buffer through `getLatestConfigInput()` in
  `src/utils/generationHelpers.ts`, which checks `getRealtimeConfigInput()`
  before debounced state, as single-file YAML download does. Inside Monaco, the
  shortcut reads `editor.getValue()` and flushes immediately.
- After downloads, `src/atoms/DownloadRow.tsx` revokes blob URLs and removes
  temporary anchors. `src/atoms/InjectionRow.tsx` revokes its blob URLs on
  content change or unmount. `src/atoms/StlPreview.tsx` disposes replaced
  geometries on update or unmount.

## Loading and injections

The app loads configurations and custom injections from Git hosts, archives, and
share links with these rules:

- **Git providers.** Providers register in `src/utils/gitProvider.ts`. The
  GitHub provider handles `github.com` and bare `owner/repo` strings, the
  Codeberg provider handles `codeberg.org`, and the Forgejo provider handles any
  other HTTP or HTTPS host because Forgejo and Gitea share that API. All
  requests are unauthenticated and bounded by the private constants
  `GIT_BFS_MAX_REQUESTS` and `GIT_BFS_MAX_DEPTH` in `src/utils/gitProvider.ts`.
  GitHub rate-limit responses appear as user-facing messages.
  [#164](https://github.com/ceoloide/ergogen-gui/issues/164) tracks
  authenticated requests.
- **Repository and archive layout.** Expect `config.yaml` at the root and
  optional `footprints/`, `outlines/`, and `templates/` folders. Repository
  imports also try `ergogen/config.yaml`, search for other YAML files if neither
  path exists, and follow matching Git submodules. Each injection name is its
  path inside the folder without its `.js` extension, or `.svg` for repository
  outlines. ZIP and `.ekb` archives use the same layout with `.js` files only,
  within the size limits in `src/utils/ergogenBundleLoader.ts`.
- **Name conflicts.** Repositories, archives, and share links all merge through
  `src/utils/injections.ts`. On a name conflict, you choose to skip, overwrite,
  or keep both as `name_1`, and you can apply that choice to all remaining
  conflicts.

## Sharing

`src/utils/share.ts` encodes `{ config, injections?, guiVersion, ergogenVersion }`
into the URL hash with `lz-string`.
[Share links in README.md](README.md#share-links) states the public contract.
The share dialog runs a temporary worker in debug mode and offers only the
footprints, templates, and outlines that the canonical PCB or outline output
references.

On load, `App.tsx` decodes the hash and shows `ShareVersionCompatibilityDialog`
if the link names a custom engine or a newer GUI or Ergogen version than the
running app. The decoder treats links without versions as GUI `0.9.0` and
`github:ergogen/ergogen#v4.2.1` so older links still load. Decode errors and
validation errors show distinct messages, and `?debug` logs the decoded payload.

## Feature flags

`src/utils/featureFlags.ts` gates custom templates and custom outlines, which
require Ergogen 4.3.0 or later. It uses the first match among these sources:

1. URL parameters `?ff_templates=` and `?ff_outlines=` set to literal `true` or
   `false`.
2. Build variables `VITE_FEATURE_*`, or `REACT_APP_FEATURE_*` when the Vite
   variable is unset, set to literal `true` or `false`.
3. Engine support, which is on when the installed engine version is at least the
   feature's minimum version.

`src/utils/engineRequirements.ts` is the single registry for the engine version
and each feature's minimum version. Feature and example checks read
`installedEngineVersion`, the installed package version. `VITE_ERGOGEN_VERSION`
changes only the displayed identity. Share-link compatibility compares against
the version in that identity when it names one, and otherwise against the
installed version. The Welcome page uses the same registry in
`src/examples/supported.ts` to offer only examples whose `meta.engine`
requirement the engine satisfies, which means the same major version and a
minor and patch version at least as high.

Feature gates apply in the injections panel, in local and repository loaders, on
the main thread before generation, and during bulk export in
`src/workers/bulkExport.ts`.

### Adding a feature flag

Follow these steps to gate UI for a feature from a newer engine:

1. Add the feature and its minimum version to `ENGINE_FEATURES` in
   `src/utils/engineRequirements.ts`.
2. Add its build-variable override to `featureEnvOverrides` in
   `src/utils/featureFlags.ts`. TypeScript rejects any feature that lacks an
   override entry.
3. Expose the build variable in `vite.config.mts`.
4. Gate the UI with `isFeatureEnabled`.

A deployment running an older engine then hides the feature.

## Configurations and storage

`ConfigContext` stores multiple configurations in `localStorage` under
`ergogen:multi-config` and migrates older single-configuration keys on startup.
Storage version 2 stores an SVG preview per configuration. Deleting an inactive
configuration keeps the active configuration and its results. Deleting the
active or last configuration clears them. When the app opens configurations
saved by a legacy single-configuration store or storage version 1, it compiles
each one that lacks a preview in the background, without the STL stage. It
skips the configuration that the load-time generation targets, whose results
set its preview.

`src/utils/zip.ts` provides `createZip` for a single configuration, and
`src/workers/bulkExport.ts` provides `exportConfigsProgressively` for bulk
export. With **Only download configs**
selected, bulk export packages only the selected configurations and their
injections. Otherwise, it compiles each selected configuration with a worker
pool. Compiled bulk exports omit STL conversion and `.stl` files when the STL
preview setting is off, apply [feature gates](#feature-flags), and deduplicate
colliding folder or file names such as `Board_One` and `Board_One_1`.

## Engine and footprints

The installed `ergogen` package is read-only. `pnpm build-ergogen` runs
`patch/patch_ergogen.sh`, which also runs from `postinstall`, `predev`,
`prestart`, `prebuild`, `pretest:unit`, and `pretest:contract`. The script
copies `ergogen` to `node_modules/.ergogen-engine`, links its installed
dependencies, fetches both footprint libraries at pinned full commit SHAs,
installs `patch/footprints_index.js`, and verifies that the engine loads. It
never runs a nested install or build and never changes Git configuration. An
input stamp skips repeat runs when inputs are unchanged, and changed inputs
clear the Vite cache. Vite and Vitest alias `ergogen` and its subpaths to
`node_modules/.ergogen-engine`.

`patch/patch_ergogen.sh` defines the default footprint pins and repository URLs.
To override them for a single run, set `CEOLOIDE_FOOTPRINTS_COMMIT` or
`INFUSED_KIM_FOOTPRINTS_COMMIT` to another full 40-character SHA, or set
`CEOLOIDE_FOOTPRINTS_URL` or `INFUSED_KIM_FOOTPRINTS_URL` to a mirror of the
same repository. Change the defaults only in a reviewed pull request with full
validation, including browser tests. Engine preparation tests use local Git
fixtures and need no network access.

### Engine experiments

Canonical installs, pull request CI, and default deployments use the
`package.json` specifier and the frozen `pnpm-lock.yaml`. To change the
canonical engine, update both files in a reviewed pull request.

Use a separate checkout to test another engine locally. Never commit an
experiment's `package.json`, `pnpm-lock.yaml`, or preview SVGs. Run
`node scripts/preinstall.js` before `pnpm install`:

```shell
export ERGOGEN_VERSION=github:ceoloide/ergogen#develop   # or ergogen@<version>
node scripts/preinstall.js
pnpm install --no-frozen-lockfile
pnpm dev
```

`scripts/preinstall.js` backs up `package.json`, and `postinstall` restores it.
Keep `ERGOGEN_VERSION` exported while you work in that checkout. Engine
preparation fails if `ERGOGEN_VERSION` differs from the installed specifier, and
Vite also reads it as the displayed engine identity. While `ERGOGEN_VERSION` is
set, Vitest excludes the engine contract tests, so validation does not run them.
[Run them explicitly](#engine-contract-tests). Before you report canonical test
results, restore canonical inputs and reinstall with `--frozen-lockfile`.

### Deployment engine

The `ERGOGEN_VERSION` repository variable (**Settings > Secrets and variables >
Actions > Variables**) selects the engine that `deploy.yaml` builds for that
repository only. Pull request CI ignores it and always validates the canonical
engine. It accepts these values:

- Unset or empty uses the canonical `package.json` specifier and frozen
  lockfile.
- `github:<owner>/<repo>#<branch>` installs the branch's commit when the build
  starts.
- `github:<owner>/<repo>#<tag>` installs the tag's commit and peels annotated
  tags.
- `github:<owner>/<repo>#<40-character SHA>` installs that exact commit. Use a
  full SHA when a name matches both a branch and a tag.

The override accepts public GitHub repositories only. The resolver normalizes
uppercase hex to lowercase and ignores surrounding whitespace. Validate a
non-canonical engine in a separate checkout before you select it.

On every run, `node scripts/ci/deploy-engine.mts resolve` in the `build` job
pins a branch or tag to one commit. The install step runs the
[engine experiments](#engine-experiments) procedure with that pinned specifier,
and `deploy-engine.mts verify` and `pnpm validate` use it too. Like pull request
CI,
the deploy workflow runs `pnpm validate`, but without browser tests or
`pnpm test:reports`.
[Deployment engine background](docs/records/background.md#deployment-engine)
describes each step.

The override may select an engine older than the canonical engine. The site then
hides examples whose `meta.engine` requirement that engine does not meet, along
with features disabled by the registry in [Feature flags](#feature-flags).
Tracked preview SVGs for hidden examples still deploy, but the UI does not show
them. Leave `ERGOGEN_VERSION` unset on any repository that deploys the canonical
engine so its deployment also runs the
[engine contract tests](#engine-contract-tests).

Version checks read the engine's `package.json` version, so a development branch
reports whatever version its `package.json` holds. Bump an engine development
branch to the next version, such as `4.4.0-develop`, in the same change that
lands the first feature gated on that version. From that commit onward, Ergogen
GUI treats the branch as supporting every feature registered for that version.

Git tracks the example preview SVGs in `public/images/previews`. Regenerate them
only with `pnpm generate-previews` and review the diff. Builds never rewrite
them.

## CI and deployment

GitHub Actions runs validation and deployment under these rules:

- `ci.yaml` runs on every pull request, including stacked ones, with a
  read-only token and unpersisted checkout credentials. It runs `pnpm validate`,
  then Playwright, then `pnpm test:reports`, and uploads `reports/` and
  Playwright output. See [Pull request evidence](#pull-request-evidence).
- `deploy.yaml` runs on pushes to `main`, manual dispatch, and
  `repository_dispatch`, and never on pull requests. Its `build`, `deploy`, and
  `smoke` jobs build once and publish that exact build, as
  [Releases and rollback](#releases-and-rollback) describes.
- Build variables come from repository variables as listed in
  [Configuration in README.md](README.md#configuration). Both workflows and
  `vite.config.mts` read the analytics tag ID only from `VITE_GTAG_ID`.
- Actions are pinned by commit SHA and updated by Dependabot with a seven-day
  cooldown. Update `tests/workflow-security.test.ts` with any workflow change.
  [CI background](docs/records/background.md#ci-and-deployment) lists what it
  checks.

### Releases and rollback

GitHub Pages serves the `gh-pages` branch using a legacy build from `/ (root)`
under **Settings > Pages**. Only `deploy.yaml` commits to `gh-pages`, and every
release or rollback runs through these jobs:

1. **Build (`build`, read-only token).** This job validates and builds once with
   `VITE_BUILD_ID=<commit>.<run id>.<run attempt>`, which the site serves in
   `build-id.txt` and the `ergogen-build-id` meta tag. It adds `404.html`,
   `.nojekyll`, and on `main` when `CNAME_DOMAIN` is set, `CNAME`. It sets every
   file to mode `0644`, records the Git tree ID of `dist` to pin every path and
   byte, and uploads `dist` as a one-day artifact.
2. **Deploy (`deploy`, write token).** This job runs no checkout, install, or
   repository code, only the artifact download and fixed shell commands in
   `deploy.yaml`. It downloads the artifact by the ID that `build` reported, and
   the download action fails on a digest mismatch. It publishes nothing unless
   all three checks pass:
   - The downloaded files match the recorded Git tree ID and build ID.
   - This run's commit is still the head of `main`. Otherwise, the job reports
     "Not published", succeeds, and leaves publishing to the newer run.
   - The push is a fast-forward of the `gh-pages` commit that `deploy` read.

   `deploy` then creates a commit with the validated tree, the previous release
   as its parent, and trailers `Source-Commit`, `Build-Id`, `Artifact-Id`,
   `Artifact-Digest`, and `Workflow-Run`, and checks that `gh-pages` points to
   that commit. [Release checks](docs/records/background.md#release-checks)
   explains what each check prevents.

3. **Smoke (`smoke`, read-only token).** This job runs
   `scripts/ci/smoke-site.mts` against the public URL, which uses the custom
   domain from the release's `CNAME`, or `https://<owner>.github.io` below
   `PUBLIC_URL`. The script polls until `build-id.txt` names the release, then
   checks that the base path, the client route `new` through `404.html`, and
   every local file that `index.html` loads serve the bytes of the published
   commit. Each poll adds a unique query string to every request to bypass the
   [Pages CDN cache](docs/records/background.md#release-smoke-check).
   The whole check has a hard ten-minute deadline, and any request or download
   still running then is aborted and fails the check. A smoke failure means the
   release is on `gh-pages` but is not served correctly. Roll back or fix
   forward.

Production runs share the `pages` concurrency group without cancelling
in-progress runs, and manual runs on other branches build in their own group and
never publish. Concurrency groups cannot order runs. GitHub keeps only one
pending run per group, so any run that joins `pages`, including a re-run or
manual run, replaces the pending run, even a newer one, which then shows as
cancelled. The site stays at the last release until the next push to `main` or
a [fresh release of its head](#releasing-main-again).

Run these commands to inspect what is served and where it came from:

```shell
curl -fsS https://<site>/build-id.txt     # <commit>.<run id>.<run attempt>
git fetch origin gh-pages
git log --format='%H %s%n%(trailers)' origin/gh-pages
```

`gh-pages` keeps every release, so it only grows. Shallow or single-branch
clones such as `git clone --single-branch` skip it. See
[Release history size](docs/records/background.md#release-history-size).

#### Rolling back a release

A rollback is a production release that serves an earlier release again. Only
the owner can run it on `main`. Choose a `gh-pages` commit that `deploy.yaml`
published, identified by a `Source-Commit` trailer. You cannot restore the
single commit left by the earlier publisher with this workflow. If the base path
has changed since that release, fix forward instead of rolling back.

Run these commands to roll back to an earlier release:

```shell
gh workflow run deploy.yaml --ref main -f rollback_to=<gh-pages commit SHA>
gh run watch    # rollback, then smoke
```

The `rollback` job runs with a write token and fixed shell commands only. It
checks that the target commit is in `gh-pages` history and was published by
`deploy.yaml`, then fast-forwards `gh-pages` to a new commit with that exact
tree and trailers `Source-Commit`, `Build-Id`, `Rollback-To`, `Requested-By`,
and `Workflow-Run`. It changes nothing if that tree is already served. The
`smoke` job then verifies the restored build below today's `PUBLIC_URL`. The
next push to `main` releases normally and replaces the rollback.

#### Releasing main again

To release the head of `main` again without a new commit, such as after a
rollback or a cancelled run, start a fresh workflow run on `main` without
`rollback_to`:

```shell
gh workflow run deploy.yaml --ref main
gh run watch    # build, deploy, then smoke
```

This run validates, builds, and publishes like a push with a new build ID.
Re-running all jobs of the latest run of `main` does the same, with two limits.
GitHub allows re-runs for only 30 days after a run, and re-running only the
failed or `deploy` job requires the build's one-day artifact, which may have
expired.

### Pull request evidence

`scripts/ci/contract.mts` defines a passing pull request run. It requires the
`lint-and-test` job of `ci.yaml`, all four of its named steps, and two JUnit
reports that each hold at least one test and no failures, errors, or skipped
tests. The browser report must include every Playwright project.

In CI, `pnpm test:reports` runs even after a failed step. It fails the job when
the reports break the contract, and it writes the identities, step outcomes,
counts, and failed tests to the job summary and `reports/evidence.json`. The
uploaded artifact is named `validation-<PR head>-attempt-<n>`.

Always assess a pull request from an up-to-date `main` checkout, never from the
pull request branch:

```shell
pnpm assess:pr <number> [--json]
```

The assessor makes read-only `gh api` calls. It exits 0 only if the pull
request is open, targets `main`, and did not change during the assessment, and
the newest `ci.yaml` run for its exact head passed with intact evidence that
names it. If the base has moved, update the branch. It exits 1 with a list of
problems, or 2 if it cannot run because of a GitHub API error or an unexpected
response shape.
[Pull request evidence background](docs/records/background.md#pull-request-evidence)
lists every condition. To triage a failure, open the printed run and job links,
read the job summary, and download the artifact for the JUnit reports,
Playwright HTML report, and traces.
Artifacts expire after seven days, after which you must re-run the workflow to
assess again. Pass `--allow-closed` only to audit a merged pull request. A pass
describes only the moment it finished and does not stop later pushes or merges.

### Branch rules

GitHub enforces the ruleset `main: require CI` (ID 27290096) and read-only
Actions token defaults, defined in `scripts/ci/ruleset-proposal.json` and
`scripts/ci/workflow-permissions-proposal.json`. Nobody can push to `main`,
including the owner. A merge needs a pull request with resolved conversations
and a `lint-and-test` check from the GitHub Actions app on a branch that is up to
date with `main`. GitHub accepts the conclusions `success`, `skipped`, or
`neutral` for that check, so a mergeable pull request may not have run its
validation. [Pull request evidence](#pull-request-evidence) shows how to assess
one. Update the branch with **Update branch**, `gh pr update-branch`, or a
rebase. The ruleset does not cover `gh-pages`.

The ruleset checks only the required check's name and conclusion, so review
every change to workflows and scripts. As the owner, run `pnpm check:settings`
to confirm that GitHub still enforces both settings.
[Branch rules in docs/records](docs/records/branch-rules.md) holds their limits,
the cutover record, and the procedures to change the required check and to
re-apply or roll back the settings.

## Service worker

`vite-plugin-pwa` builds `src/service-worker.ts` in `injectManifest` mode, and
`src/serviceWorkerRegistration.ts` registers it only in production builds and
from the same origin. The service worker handles caching and updates as
follows:

- **Precache.** It precaches every built `.js`, `.css`, and `.html` file,
  including the local Monaco copy and `public/dependencies`. The configuration
  sets an 8 MiB per-file limit to fit the TypeScript worker. See
  [Service worker precache](docs/records/background.md#service-worker-precache)
  for the download size.
- **Runtime caching.** Navigations fall back to the precached `index.html`.
  Images under `images/`, `ergogen.png`, `favicon.ico`, and any file under
  `dependencies/` missing from the precache use a cache-first strategy on first
  use. These routes match below the build's base path. Google Fonts use
  stale-while-revalidate for CSS and cache-first for font files.
- **Analytics cleanup.** The service worker does not intercept analytics
  requests. On activation, it deletes the `workbox-background-sync` database
  that older builds used to queue hits.
- **Updates.** A changed `service-worker.js` installs in the waiting state. The
  header shows `UpdateChip`, even when the browser found the update during
  navigation before the page registered. Clicking `UpdateChip` posts
  `SKIP_WAITING` and reloads the page, with a one-second fallback reload.
  `?force_update` and `?force_install` show the update and install controls for
  testing.

## Analytics and privacy

`src/utils/analytics.ts` manages analytics consent and transport.
`src/index.tsx` calls `initAnalytics()` before rendering, and the settings
switch calls it again when toggled. Analytics follow these rules:

- **No tag ID disables analytics.** Without `VITE_GTAG_ID`, the app never loads
  the analytics script, and minification removes the loader. `src/Ergogen.tsx`
  then shows **Send Usage Metrics** off and disabled with an explanation,
  regardless of stored consent.
- **Consent resolution.** The app uses the first match among these sources:
  1. A choice made in the current session whose storage write failed.
  2. The explicit key `ergogen:consent:sendUsageMetrics`.
  3. A stored `false` in the legacy `ergogen:config:sendUsageMetrics` or
     `ergogen:settings` keys. A stored `true` in either legacy key is ignored.
  4. The default, which is on in a browser tab and off in standalone PWA mode.

  Unreadable storage means off.

- **Environment block.** Analytics send no hits from Vite development builds or
  from `localhost`, `127.0.0.1`, `[::1]`, or `*.localhost` unless
  `VITE_FORCE_ANALYTICS=true`, `window.__FORCE_ANALYTICS__ = true` is set before
  load, or the tag ID matches `G-TEST*`. Tests (`MODE === 'test'`) are never
  blocked. No override bypasses consent. To check hits without sending them,
  intercept `/g/collect` in the browser.
- **Mid-session opt-out.** Turning off metrics sets `ga-disable-<ID>`, expires
  `_ga*` cookies, and removes error listeners. Opting back in resumes without a
  reload.
- **Data minimization.** Automatic page views, Google Signals, and ad
  personalization are off. `App.tsx` sends one `page_view` per route, and
  `page_location` drops the query string and hash. Structured generation metrics
  carry no configuration names, authors, filenames, repository URLs, or zone,
  column, or row names. `meta.name` and `meta.author` feed only a 12-character
  SHA-256 `config_id`. `trackEvent()` scrubs error text on a best-effort basis
  by keeping its first line, masking quoted values, and capping it at 100
  characters, so unquoted user text in an error message can still be sent.
- **Generation events.** `ConfigContext` and `configAnalyzer.ts` send
  `generation_completed`, `generation_failed`, and `keyboard_generated`. During
  auto-generation, these events wait for a 5-second quiet period. Manual runs
  send them immediately. The tracker skips unchanged `config_id` values, resets
  lineage when you switch configurations, and flushes pending events on
  `pagehide` or when the page is hidden.

### Google Analytics property setup

Only maintainers of a GA4 property need this setup. Self-hosting needs no Google
account. Google Analytics reports only custom parameters registered on the
property. `scripts/ga/ga-config.mjs` declares those parameters, and
`scripts/ga/ga-config.test.mjs` fails when the app sends an unregistered
parameter. Register new parameters in `scripts/ga/ga-config.mjs` in the same
change, and move parameters that are no longer sent to `retired` instead of
deleting them.

`scripts/ga/ga-admin.mjs` applies the configuration through the Google Analytics
Admin API. Without `--apply`, both commands print only the plan, but they still
authenticate and read the property. Teardown archives managed dimensions and
metrics irreversibly, so `pnpm ga:teardown` requires `--confirm <id>` with
`--apply`:

```shell
pnpm ga:setup -- --property <id> [--stream <id>] [--prune-retired] [--apply]
pnpm ga:teardown -- --property <id> [--apply --confirm <id>]
```

`GA_PROPERTY_ID` can replace `--property`. Setup never changes a registration's
type and touches only event-scoped registrations. The admin script checks
credentials in this order:

1. `GA_ACCESS_TOKEN`, a token with the `analytics.edit` scope.
2. `GA_SERVICE_ACCOUNT`, a service account with Editor access that the script
   impersonates through the IAM Credentials API using your `gcloud` login.
3. `gcloud auth application-default print-access-token` as the default fallback.

## Changelog

`CHANGELOG.md` holds user-facing changes, newest first. Follow the conventions
in the [changelog skill](.agents/skills/ergogen-gui-changelog/SKILL.md).

## Weekly quota

`pnpm queue:quota` tells an agent whether each provider's weekly quota allows a
new task. The [quota skill](.agents/skills/ergogen-gui-quota/SKILL.md) explains
each result.
