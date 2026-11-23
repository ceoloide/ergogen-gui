# Development guide

This file documents how Ergogen GUI works and how to change it safely. Read
[README.md](README.md) for installation, local development, and self-hosting,
and see [AGENTS.md](AGENTS.md) for the rules that apply to every change. Track
future work in [GitHub issues](https://github.com/ceoloide/ergogen-gui/issues),
not in this file. Put records of past events, measurements, and the reasons
behind these rules in [docs/records/](docs/records/), and link to them from
here.

## Validation

Before you run validation, follow [Run locally](README.md#run-locally) to
install dependencies, and follow [Contributing](README.md#contributing) to
install the native validation tools on your `PATH`. CI runs the same installer
and commands. The
[acceptance record](docs/records/acceptance-hc-001-to-hc-004.md) shows how this
validation was checked.

These commands run validation and tests:

| Command                                          | Checks                                                                                                                                                                  |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm validate:fast` (alias `pnpm precommit`)    | Runs Prettier, markdownlint, ESLint, Knip, actionlint, zizmor, ShellCheck, both TypeScript projects, our declaration check, and all Vitest tests. Never modifies files. |
| `pnpm validate`                                  | Runs `pnpm validate:fast` and the production build. Deployment requires this command, and pull request CI adds Playwright.                                              |
| `pnpm validate:extended`                         | Runs `pnpm validate:fast`, a fresh production build, all Playwright tests, and `pnpm test:reports`.                                                                     |
| `pnpm test:reports`                              | Checks the JUnit reports against the [pull request evidence contract](#pull-request-evidence).                                                                          |
| `pnpm test:e2e`                                  | Runs Playwright across root, subpath, and service-worker update builds. Install Chromium once with `pnpm exec playwright install chromium`.                             |
| `pnpm test:e2e:root`                             | Runs Playwright locally with `PLAYWRIGHT_ROOT_ONLY=1` so only root `dist/` builds and runs. Ignored when `CI` is set.                                                   |
| `pnpm test:contract`                             | Runs only the [engine contract tests](#engine-contract-tests) with the installed engine and writes `reports/contract.xml`.                                              |
| `pnpm fix`                                       | Applies Prettier and supported ESLint and markdownlint fixes.                                                                                                           |
| `pnpm exec vitest run <path> --reporter=verbose` | Runs one test file with per-test output. `pnpm test:unit --verbose` is not a valid form.                                                                                |

When the `ERGOGEN_VERSION` environment variable is set, Vitest skips the
[engine contract tests](#engine-contract-tests), even if you pass a contract
test file on the command line. Run a single contract test file with
`pnpm exec vitest run --mode contract tests/engine-contract/<file>`. Run all
contract tests with `pnpm test:contract`.

A Vite build does not check types. Only `pnpm typecheck` checks types, and
`pnpm validate:fast` runs it. Husky and `lint-staged` run quick fixes on staged
files before a commit, and GitHub enforces full validation on pull requests.

Each maintained file group runs the checks listed in this table:

| Files                                                                              | Checks                                                                                      |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `src/`                                                                             | Prettier, ESLint, and TypeScript using strict `tsconfig.json`                               |
| `tests/`, `e2e/`, `scripts/ci/`, and root `*.config.mts`                           | Prettier, ESLint, and TypeScript using `tsconfig.tooling.json`                              |
| JavaScript: other `scripts/`, `patch/*.js`, `eslint.config.mjs`, corpus footprints | Prettier and ESLint. JavaScript files are not type-checked.                                 |
| `scripts/*.sh`, `patch/*.sh`, and `.husky/pre-commit`                              | ShellCheck                                                                                  |
| `.github/` workflows and configuration                                             | Prettier and zizmor. Workflows also run actionlint, which runs ShellCheck on `run:` blocks. |
| Markdown, including `.agents/`                                                     | Prettier and markdownlint                                                                   |
| JSON, `index.html`, and `pnpm-workspace.yaml`                                      | Prettier                                                                                    |

Both TypeScript projects enable `skipLibCheck`, so `tsc` only parses declaration
files, including ours. Disabling `skipLibCheck` for a whole project reports
dozens of errors inside dependencies, such as `lib.dom` against `lib.webworker`,
workbox, and react-router declarations. To check our declarations without
dependency noise, `pnpm typecheck` also runs `pnpm typecheck:declarations`,
implemented in `scripts/ci/check-declarations.mts`. That script builds each
project from its own configuration with only `skipLibCheck` disabled, checks
every declaration file, and reports diagnostics that involve our declaration
files (`src/*.d.ts` and `scripts/ci/jsdom.d.ts`) in three cases:

- TypeScript reports the diagnostic directly in one of our declaration files.
- TypeScript reports the diagnostic in a dependency file, and the related
  information points into one of our declaration files. Because TypeScript
  reports a conflict between two declarations on whichever declaration loads
  later in the program, a conflict with a dependency loaded after our file
  appears in the dependency.
- TypeScript reports the diagnostic in a dependency file on the name of a symbol
  that our declaration files also declare. An interface that we merge with a
  dependency interface, such as `Window`, can break what the merged interface
  extends. TypeScript reports that error on the first declaration without
  related information, and the output names our declaration below the error.

This filter is a bounded rule, not a complete record of every error that our
files cause. If our declaration causes an error that TypeScript reports on
another symbol with no related information pointing to our files, the script
treats it as a dependency error and filters it out. Checking every declaration
file takes most of the command's time, about 26 seconds locally. Our files are
the tracked or untracked `*.d.ts`, `*.d.mts`, and `*.d.cts` files that Git lists
outside `node_modules`. Any declaration file that belongs to neither TypeScript
project fails the check. `tsc` still type-checks all code that uses these
declarations.

Validation intentionally skips the vendored scripts in `public/dependencies/`,
other files in `public/`, the pnpm-generated `pnpm-lock.yaml`, the byte-exact
fixtures `tests/ci/reports/*.xml` and `tests/engine-contract/corpus/*.yaml`, and
Git-ignored output such as `dist*`, `reports/`, and `.tools/`.

Vitest writes `reports/unit.xml`, and `pnpm test:reports` writes
`reports/evidence.json`. Playwright runs without retries and writes
`reports/browser.xml`, an HTML report, and failure traces and screenshots. A
failed browser test also attaches a `readiness` summary from
`e2e/utils/readiness.ts`. That summary records how busy the machine's CPUs were
during the test, how many generation requests the Ergogen worker received and
finished, and the app's worker milestones. A request still running near 100% CPU
fits a starved machine without proving it. A finished generation without the
expected outputs points to an app fault, even at 100% CPU. The console prints
the first 300 characters of the readiness summary, and the HTML report includes
all of it.

Setting `E2E_SCREENSHOTS=1` also saves a full-page screenshot at each test step
in `e2e/screenshots/`. This option is off by default because those screenshots
check nothing and took 13% of traced test time under load. Git ignores all
report and screenshot outputs. When you report a failure, attach the relevant
reports and traces along with the commit SHA and exact command.

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
loopback port. Each project's metadata names its server and build ID. Before
tests start, `e2e/global-setup.ts` fails the run unless every server's
`build-id.txt` matches its expected ID, so tests never reach a stale or foreign
server. Setting `VITE_BUILD_ID` also adds an `ergogen-build-id` meta tag to
`index.html`.

Playwright runs three projects:

| Project                   | Build and server                                        | Tests                                            |
| ------------------------- | ------------------------------------------------------- | ------------------------------------------------ |
| `chromium`                | `dist/` at base `/`                                     | All specs except the update drill                |
| `chromium-subpath`        | `dist-subpath/` at base `/ergogen-gui/`                 | `base-path.spec.ts` and `service-worker.spec.ts` |
| `chromium-subpath-update` | `dist-subpath-served/`, a fresh copy of `dist-subpath/` | `service-worker-update.spec.ts`                  |

The update drill copies `dist-subpath-next/`, built with the same base path and
another build ID, over `dist-subpath-served/`. `vite preview` reads
`dist-subpath-served/` on each request. The test then verifies that the real
service worker waits, shows **Update Available**, activates on click, and
installs no other worker.

Because each update drill modifies `dist-subpath-served/`, run it in a fresh
`pnpm test:e2e` invocation. Do not use `--repeat-each` or retries on the update
drill. Playwright routes cannot replace this file copy because Chromium fetches
the worker script for update checks outside the page.

Running `pnpm exec playwright test --project chromium-subpath` runs only that
project's tests, but Playwright still builds every server. You can pin ports and
build IDs with the `PLAYWRIGHT_*` variables in `playwright.config.mts`. For
faster local runs of root-served specs, run `pnpm test:e2e:root <spec>`. That
script sets `PLAYWRIGHT_ROOT_ONLY=1` so Playwright builds and starts only the
root `dist/` server. Playwright ignores `PLAYWRIGHT_ROOT_ONLY` when `CI` is set.

When `CI` is set, Playwright forbids `.only` and runs two workers. The shared
test fixture blocks external network requests, including requests from service
workers and dedicated workers. Provider tests route deterministic responses, and
`e2e/utils/githubMocks.ts` answers every `api.github.com` and
`raw.githubusercontent.com` request including unknown endpoints. Browser tests
therefore use no GitHub API quota and need no token. Playwright routes do not
intercept WebSockets. The app opens no WebSockets, so any new one would need its
own block.

The update drill handles external hosts differently. Its browser resolves no
host names and ignores environment proxies because a proxy would resolve host
names itself. The fixture lets that service worker's requests to Google Fonts
pass through so they fail at name resolution instead of being aborted through
DevTools. Once DevTools aborts a service worker request, Chromium installs a new
worker on every later navigation without comparing the script, matching
DevTools' **Update on reload** behavior. Those extra installations can interfere
with the drill, though their connection to the original second-chip failure
remains inferred. See the
[acceptance record](docs/records/acceptance-hc-001-to-hc-004.md). Service-worker tests
check images by their natural width because a missing file below the base path
returns `index.html` with HTTP 200.

Waits for generated outputs begin as soon as `page.goto` resolves, before the
workers start, so those waits also cover CPU-bound worker startup. In
single-sample measurements, one A. dux page used about 8 s of browser-thread CPU
on a quiet machine and 10 to 11 s with other CPU-bound processes running. Its
STL rows appeared 2.2 s into the STL test's 10 s wait on a quiet 4-core machine,
and 5.8 to 7.1 s into that wait with four other CPU-bound processes running.
Under that load, the Ergogen and JSCAD workers stayed busy 2.3 to 2.8 times
longer for 1.1 to 1.25 times their CPU time. Two parallel tests plus background
load may therefore exceed these waits without any change in the app. Use the
`readiness` attachment as a diagnostic to help separate CPU starvation from an
app fault, not as proof of the cause.

### Other test suites

These test suites in `tests/` check workflows, releases, documentation, and
build-time settings:

- `tests/workflow-security.test.ts` checks workflow security policy.
- `tests/release-publication.test.ts` runs the deploy workflow's release and
  rollback steps against local Git repositories and smoke-tests the result on a
  loopback server. See [Releases and rollback](#releases-and-rollback).
- `tests/build-version.test.ts` checks build-time engine identity.
- `tests/analytics-tag-id.test.ts` checks the build-time analytics tag ID.
- `tests/markdown-links.test.ts` checks that every relative link in Markdown
  files reaches an existing file and heading.

### Engine contract tests

`tests/engine-contract/` holds the test files and fixtures that run the real
engine and assert what it generates. That folder contains the
[semantic regression corpus](#semantic-regression-corpus) and the preview
consistency check. These tests define the output contract of the canonical
engine pinned in `package.json`. Put every new test of engine output in
`tests/engine-contract/`, not in `src/` or elsewhere in `tests/`.

When the `ERGOGEN_VERSION` environment variable is non-empty, such as during a
deployment that selects another engine, `vitest.config.mts` excludes
`tests/engine-contract/` from `pnpm test:unit` and `pnpm validate`. See
[Deployment engine](#deployment-engine). When Vitest excludes the folder, it
prints a `[vitest] ... excluding tests/engine-contract/**` notice. For engine
development, run `pnpm test:contract` to run the contract tests against whatever
engine is installed. On an older engine, those tests fail wherever that engine
lacks canonical behavior.

Every other test runs with every engine:

- **GUI tests use the canonical engine version.** `src/setupTests.tsx` pins
  `installedEngineVersion` in `src/utils/engineRequirements.ts` to the version
  in the `package.json` engine specifier, including versions inside a `^` or `~`
  range. When the specifier names no version, such as a branch or commit, GUI
  tests use the installed engine version instead. Keep a version in the
  `package.json` specifier, such as a `#v4.4.0` tag or a version range, while
  any deployment selects an older engine. Otherwise, that deployment's GUI tests
  use its older engine and tests that expect canonical behavior fail. When a
  test checks behavior on another engine version, set it with
  `vi.mocked(installedEngineVersion).mockReturnValue(...)`.
- **`tests/engine-smoke.test.ts`** uses the real installed engine version. It
  verifies that the app's worker handler and prepared engine generate every
  example that `src/examples/supported.ts` enables for that engine, so new
  examples need no change in this test.
- **`src/examples/supported.test.ts`** fails if an example requires a newer
  engine than the canonical engine, so the canonical site hides nothing. The
  preview consistency check generates every example on the canonical engine.

### Semantic regression corpus

These Vitest suites check generated geometry and structure instead of byte
snapshots so they catch wrong output as well as crashes. They run the prepared
engine offline and read only their fixtures.

The corpus consists of these fixtures and test suites:

- **Fixtures in `tests/engine-contract/corpus/`** include
  `staggered-thumbs.yaml`, the custom footprint
  `footprints/corpus/probe_pad.js`, and two invalid configurations: one with a
  YAML syntax error and one with a missing outline. `staggered-thumbs.yaml`
  exercises column stagger, a rotated and splayed thumb cluster, a private
  `_plate` outline, a vendor footprint, and a custom footprint. Expected values
  in `tests/engine-contract/corpus/corpus.ts` are calculated manually, never
  copied from generated output.
- **`tests/engine-contract/engine-corpus.test.ts`** starts with direct
  `ergogen.process` checks for key pitch, outline size, symmetric mirrored
  `hull` outlines, pinned vendor footprints including `infused-kim/diode` while
  rejecting the old typo, and unknown-footprint errors. Its corpus cases run
  through the app's worker handler and injection evaluator, where
  `tests/engine-contract/corpus/inProcessWorker.ts` replaces only the `Worker`
  transport. Those cases verify key positions and rotations, outline sizes and
  region counts, and matching DXF and SVG segments. They also verify footprint
  placement and nets, Edge.Cuts alignment with the board outline, error replies
  for invalid input, and identical output on a second run.
- **`tests/engine-contract/export-corpus.test.ts`** runs `createZip` and
  `exportConfigsProgressively` with real JSZip and replaces only browser
  downloads and the worker transport. It verifies archive names, exact file
  lists, file contents, and geometry. It also verifies that a
  single-configuration archive reloads with only its configuration and
  injections, that a configs-only archive holds no generated files, and that a
  failed configuration gets `error.txt` instead of outputs. It counts switch and
  probe-pad footprints separately before it checks their placement.
- **Shared engine behavior.** All requests in one test file share one engine
  instance, so an injected footprint stays registered. Browser bulk export
  starts a fresh worker per configuration instead. Bulk export tests therefore
  use the probe pad under its own name (`bulkProbePadInjection` in
  `tests/engine-contract/corpus/corpus.ts`) so the test fails if bulk export
  does not pass its injections to the worker.
  `tests/corpus-in-process-worker.test.ts` checks the adapter itself. It
  verifies that a handler that throws or does not reply reaches `onerror` at
  once and that a failed import restores the globals it replaced.
- **`tests/engine-contract/preview-consistency.test.ts`** regenerates the
  geometry of every tracked preview in `public/images/previews` and compares it
  with the tracked file while ignoring path direction and start point. It
  requires one preview per drawable example, excluding `Empty YAML
configuration`, and covers only these previews.
- **`tests/corpus-inspect.test.ts`** checks the shared SVG reader. It verifies
  that the `viewBox` consists of four finite numbers that frame the paths
  exactly and that only closed chains count as regions.

The corpus ignores only documented volatile data: the KiCad 8 title-block date
(stripped by `withoutPcbGenerationDate`) and the date matched by pattern in
archive names.

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

- `ergogen.worker.ts` runs Ergogen, and `jscad.worker.ts` converts Ergogen
  output into 3D previews and STL files. `src/workers/workerFactory.ts` creates
  both workers so tests can mock `Worker`.
- `src/context/ConfigContext.tsx` uses `src/utils/generationSession.ts` to match
  worker replies to the active generation. It tracks `ergogen.worker.ts` replies
  by request ID and `jscad.worker.ts` replies by `configVersion`, and it drops
  late replies from older requests or other configurations. Background preview
  replies carry a `background-preview-<configId>` request ID and update only
  their own saved configuration.
- The app generates a configuration immediately when you open it.
  Auto-generation debounces edits by 300 ms and skips any request whose
  configuration, injections, points-only flag, and debug flag match the current
  or pending results. Because each new result marks STL files pending until
  `jscad.worker.ts` finishes, skipping duplicate requests avoids clearing a
  finished conversion. During render, `resolvePreview` in `src/utils/preview.ts`
  selects the active preview payload and uses `demo.svg` when the selected
  output is absent.
- When the app opens configurations saved by a legacy single-configuration store
  or storage version 1, it queues background previews for saved configurations
  that lack one. It skips the configuration targeted by the load-time generation
  because those results set its preview.
- Ergogen stores injected footprints, templates, and outlines in a module-level
  registry. Closing the settings panel therefore invalidates the generation
  session, terminates and recreates `ergogen.worker.ts`, and regenerates so
  renamed or deleted injections cannot linger. Toggling settings such as STL
  preview does not restart either worker. Auto-generation pauses while settings
  are open.
- `src/utils/injectionEvaluator.ts` evaluates injection code with `new Function`
  inside the worker and provides a `require` function that resolves only
  `makerjs` and Ergogen internals. This evaluator is not a sandbox. Injected
  code from share links or imported repositories runs in a same-origin worker
  with no further isolation, so load only injections that you trust.
- The Monaco editor is uncontrolled. Keystrokes update `ConfigContext` after a
  500 ms debounce because context updates re-render widely and persist all
  configurations, and editor blur flushes pending edits. **Share**, **Archive**,
  **Generate**, and the `Ctrl+Enter` or `Cmd+Enter` shortcut read the latest
  buffer through `getLatestConfigInput()` in `src/utils/generationHelpers.ts`,
  which checks `getRealtimeConfigInput()` before debounced state. Inside Monaco,
  `Ctrl+Enter` or `Cmd+Enter` reads `editor.getValue()` and flushes immediately.
  Single-file YAML download reads `getRealtimeConfigInput()` with the same
  fallback to debounced state.
- `src/atoms/DownloadRow.tsx` revokes blob URLs and removes temporary anchors
  after downloads. `src/atoms/InjectionRow.tsx` revokes its blob URLs on content
  change or unmount. `src/atoms/StlPreview.tsx` disposes replaced geometries on
  update or unmount.

## Loading and injections

The app loads configurations and custom injections from Git hosts, archives, and
share links with these rules:

- **Git providers.** Providers register in `src/utils/gitProvider.ts`. The
  GitHub provider handles `github.com` and bare `owner/repo` strings, the
  Codeberg provider handles `codeberg.org`, and the Forgejo provider handles any
  other HTTP or HTTPS host because Forgejo and Gitea share that API. All
  requests are unauthenticated and bounded by `GIT_BFS_MAX_REQUESTS` and
  `GIT_BFS_MAX_DEPTH` in `src/context/constants.ts`. GitHub rate-limit responses
  appear as user-facing messages. Authenticated requests are tracked in
  [#164](https://github.com/ceoloide/ergogen-gui/issues/164).
- **Repository and archive layout.** Expect `config.yaml` at the root along with
  optional `footprints/`, `outlines/`, and `templates/` folders. Repository
  imports also try `ergogen/config.yaml`, search for other YAML files if neither
  path exists, and follow matching Git submodules. Each injection name is its
  path inside the folder without its `.js` extension, or `.svg` for repository
  outlines. ZIP and `.ekb` archives use the same layout with `.js` files only,
  subject to the size limits in `src/utils/ergogenBundleLoader.ts`.
- **Name conflicts.** Repositories, archives, and share links all merge through
  `src/utils/injections.ts`. On a name conflict, you choose to skip, overwrite,
  or keep both as `name_1`, and you can apply that choice to all remaining
  conflicts.

## Sharing

`src/utils/share.ts` encodes `{ config, injections?, guiVersion, ergogenVersion }`
into the URL hash with `lz-string`. See
[Share links in README.md](README.md#share-links) for the public contract. The
share dialog runs a temporary worker in debug mode and offers only the
footprints, templates, and outlines referenced in the canonical PCB or outline
output.

On load, `App.tsx` decodes the hash. If the link names a custom engine or a
newer GUI or Ergogen version than the running app, `App.tsx` shows
`ShareVersionCompatibilityDialog`. The decoder treats links without versions as
GUI `0.9.0` and `github:ergogen/ergogen#v4.2.1` so older links still load.
Decode errors and validation errors show distinct messages, and `?debug` logs
the decoded payload.

## Feature flags

`src/utils/featureFlags.ts` gates custom templates and custom outlines, which
require Ergogen 4.3.0 or later. It checks sources in this order and uses the
first match:

1. URL parameters `?ff_templates=` and `?ff_outlines=` set to literal `true` or
   `false`.
2. Build variables `VITE_FEATURE_*`, or `REACT_APP_FEATURE_*` when the Vite
   variable is unset, set to literal `true` or `false`.
3. Engine support, which is enabled when the installed engine version is at
   least the feature's minimum version.

`src/utils/engineRequirements.ts` is the single registry for the engine version
and each feature's minimum version. Feature checks and example checks read
`installedEngineVersion`, which returns the installed package version.
`VITE_ERGOGEN_VERSION` changes only the displayed identity. Share-link
compatibility compares against the version in that displayed identity when it
names one, and otherwise against the installed version. The Welcome page uses
the same registry in `src/examples/supported.ts` to offer only examples whose
`meta.engine` requirement the engine satisfies. An engine satisfies a
requirement when it has the same major version and a minor and patch version at
least as high.

Feature gates apply in the injections panel, in local and repository loaders, on
the main thread before generation, and during bulk export in `src/utils/zip.ts`.
Stale stored injections therefore cannot reach an engine that rejects them.

### Adding a feature flag

Follow these steps to gate UI for a feature from a newer engine:

1. Add the feature and its minimum version to `ENGINE_FEATURES` in
   `src/utils/engineRequirements.ts`.
2. Add its build-variable override to `featureEnvOverrides` in
   `src/utils/featureFlags.ts`. TypeScript rejects any feature that lacks an
   override entry.
3. Expose the build variable in `vite.config.mts`.
4. Gate the UI with `isFeatureEnabled`.

A deployment running an older engine then hides the feature. GUI tests continue
to use the canonical engine version as described in
[Engine contract tests](#engine-contract-tests).

## Configurations and storage

`ConfigContext` stores multiple configurations in `localStorage` under
`ergogen:multi-config` and migrates older single-configuration keys on startup.
Storage version 2 stores an SVG preview per configuration. Deleting an inactive
configuration keeps the active configuration and its results intact. Deleting
the active or last configuration clears them. The app compiles migrated
configurations that lack a preview in the background without the STL stage.

`src/utils/zip.ts` provides `createZip` for a single configuration and
`exportConfigsProgressively` for bulk export. When **Only download configs** is
selected, bulk export packages only the selected configurations and their
injections. Otherwise, it compiles each selected configuration with a worker
pool. Compiled bulk exports honor the STL preview setting and omit STL conversion and
`.stl` files when that setting is off. They also filter injections by feature
flags like single-configuration generation and deduplicate colliding folder or
file names such as `Board_One` and `Board_One_1`.

## Engine and footprints

The installed `ergogen` package is read-only because pnpm hard-links it from a
shared store. `pnpm build-ergogen` runs `patch/patch_ergogen.sh`, which runs
automatically from `postinstall`, `predev`, `prestart`, `prebuild`,
`pretest:unit`, and `pretest:contract`. The script copies `ergogen` to
`node_modules/.ergogen-engine`, links its installed dependencies, fetches both
footprint libraries at pinned full commit SHAs, installs
`patch/footprints_index.js`, and verifies that the engine loads. It never runs a
nested install or build and never changes Git configuration. An input stamp
skips repeat runs when inputs are unchanged, and changed inputs clear the Vite
cache. Vite and Vitest alias `ergogen` and its subpaths to
`node_modules/.ergogen-engine`.

`patch/patch_ergogen.sh` defines the default footprint pins and repository URLs.
You can override them for a single run with these environment variables:

| Variable                                                      | Purpose                         |
| ------------------------------------------------------------- | ------------------------------- |
| `CEOLOIDE_FOOTPRINTS_COMMIT`, `INFUSED_KIM_FOOTPRINTS_COMMIT` | Another full 40-character SHA   |
| `CEOLOIDE_FOOTPRINTS_URL`, `INFUSED_KIM_FOOTPRINTS_URL`       | A mirror of the same repository |

Change the defaults only in a reviewed pull request with full validation,
including browser tests. Engine preparation tests use local Git fixtures and
need no network access.

### Engine experiments

Canonical installs, pull request CI, and default deployments use the
`package.json` specifier and the frozen `pnpm-lock.yaml`. See
[Deployment engine](#deployment-engine) for deployment overrides. To change the
canonical engine, update both files in a reviewed pull request.

Use a separate checkout to test another engine locally. Never commit an
experiment's `package.json`, `pnpm-lock.yaml`, or preview SVGs. Run
`node scripts/preinstall.js` before `pnpm install` because pnpm 11 reads the
manifest before the root `preinstall` hook:

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
set, Vitest excludes the engine contract tests. See [Validation](#validation) to
run them explicitly. Before you report canonical test results, restore canonical
inputs and reinstall with `--frozen-lockfile`.

### Deployment engine

The `ERGOGEN_VERSION` repository variable (**Settings > Secrets and variables >
Actions > Variables**) selects the engine that `deploy.yaml` builds for that
repository only, so a staging fork and production can differ without a code
change. Pull request CI ignores it and always validates the canonical engine.

`ERGOGEN_VERSION` accepts these values:

| Value                                      | Engine deployed                                                                         |
| ------------------------------------------ | --------------------------------------------------------------------------------------- |
| unset or empty                             | Uses the canonical `package.json` specifier and frozen lockfile.                        |
| `github:<owner>/<repo>#<branch>`           | Installs the branch's commit when the build starts.                                     |
| `github:<owner>/<repo>#<tag>`              | Installs the tag's commit and peels annotated tags.                                     |
| `github:<owner>/<repo>#<40-character SHA>` | Installs that exact commit. Use a full SHA when a name matches both a branch and a tag. |

The override accepts GitHub repositories only. Pass a Git branch name, a tag
name, or a full SHA. The resolver normalizes uppercase hex to lowercase and
ignores surrounding whitespace.

In the `build` job, `node scripts/ci/deploy-engine.mts resolve` reads
`ERGOGEN_VERSION` from the environment and resolves a branch or tag to
`github:<owner>/<repo>#<commit>` with `git ls-remote`. Resolving on every run is
necessary because pnpm would otherwise reuse the commit in `pnpm-lock.yaml`
whenever `ERGOGEN_VERSION` matches the manifest specifier
(`github:ceoloide/ergogen#v4.3.0`). Next, the install step runs the
[engine experiments](#engine-experiments) procedure with that pinned specifier
and `--no-frozen-lockfile`. `deploy-engine.mts verify` fails unless pnpm
installed that specifier from that exact commit. Finally, `pnpm validate` uses
the same commit for engine preparation, the UI's GitHub link, and share links.
The version chip shows the installed package version, and the workflow step
summary records the installed version and commit when available, including for
canonical builds.

The rewritten lockfile stays on the runner and is never committed. Engine
preparation keys its cache on the installed package path, which names the
commit, so a different commit always rebuilds the engine. Like pull request CI,
the deploy workflow runs `pnpm validate`, but it skips browser tests and
`pnpm test:reports`. Validate a non-canonical engine in a separate checkout
before you select it. Any repository selected through the override must be
public.

The override may select an engine older than the canonical engine. The site then
hides examples whose `meta.engine` requirement that engine does not meet, along
with features disabled by the registry in [Feature flags](#feature-flags).
Tracked preview SVGs for hidden examples are still deployed, but the UI does not
show them. Because `ERGOGEN_VERSION` is set, `pnpm validate` runs the GUI tests
and `tests/engine-smoke.test.ts`, and it skips the
[engine contract tests](#engine-contract-tests) that describe the canonical
engine. Leave `ERGOGEN_VERSION` unset on any repository that deploys the
canonical engine so its deployment also runs the contract tests.

Version checks read the engine's `package.json` version, so a development branch
reports whatever version is in its `package.json`. Bump an engine development
branch to the next version, such as `4.4.0-develop`, in the same change that
lands the first feature gated on that version. From that commit onward, Ergogen
GUI treats the branch as supporting every feature registered for that version.

Git tracks the example preview SVGs in `public/images/previews`. Regenerate them
only with `pnpm generate-previews` and review the diff. Builds never rewrite
them.

## CI and deployment

GitHub Actions runs validation and deployment under these rules:

- `ci.yaml` runs on pull requests targeting `main` with a read-only token and
  unpersisted checkout credentials. It runs `pnpm validate`, then Playwright, then
  `pnpm test:reports`, and uploads `reports/` and Playwright output. See
  [Pull request evidence](#pull-request-evidence).
- `deploy.yaml` runs on pushes to `main`, manual dispatch, and
  `repository_dispatch`, and never on pull requests. Its read-only `build` job
  validates and builds once, then uploads `dist` as a one-day artifact. Its
  `deploy` job publishes that exact artifact to `gh-pages`, and its read-only
  `smoke` job verifies the public site. See
  [Releases and rollback](#releases-and-rollback).
- Production runs share the `pages` concurrency group without cancelling
  in-progress runs. GitHub keeps only one pending run per group, so a newer run
  replaces a queued older run rather than queuing first-in, first-out. Manual
  runs on other branches build in their own group and never publish.
- Build variables come from repository variables as listed in
  [Configuration in README.md](README.md#configuration). `ERGOGEN_VERSION`
  selects the deployed engine as described in
  [Deployment engine](#deployment-engine). Both workflows and `vite.config.mts`
  read the analytics tag ID only from `VITE_GTAG_ID`.
- Actions are pinned by commit SHA and updated by Dependabot with a seven-day
  cooldown. `tests/workflow-security.test.ts` checks permissions, triggers,
  credentials, the artifact handoff, the shared validation step, what the
  write-scoped jobs may run, and agreement between `ci.yaml`, the ruleset
  proposal, and the evidence contract. Update `tests/workflow-security.test.ts`
  with any workflow change.

### Releases and rollback

GitHub Pages serves the `gh-pages` branch using a legacy build from `/ (root)`
under **Settings > Pages**. Only `deploy.yaml` commits to `gh-pages`, and every
release or rollback runs through these jobs:

1. **Build (`build`, read-only token).** This job validates and builds with
   `VITE_BUILD_ID=<commit>.<run id>.<run attempt>`, which the site serves in
   `build-id.txt` and the `ergogen-build-id` meta tag. It adds `404.html`,
   `.nojekyll`, and on `main` when `CNAME_DOMAIN` is set, `CNAME`. It sets every
   file to mode `0644`, records the Git tree ID of `dist` to pin every path and
   byte, and uploads `dist`.
2. **Deploy (`deploy`, write token).** This job runs no checkout, install, or
   repository code. It runs only the artifact download and fixed shell commands
   in `deploy.yaml`. It downloads the artifact by the ID that `build` reported,
   and the download action fails on a digest mismatch. It publishes only if all
   three checks pass, and otherwise publishes nothing:
   - The downloaded files match the recorded Git tree ID and build ID.
   - This run's commit is still the head of `main`. Otherwise, the job reports
     "Not published", succeeds, and leaves publishing to the newer run so a late
     or re-run obsolete job never replaces a newer release.
   - The push is a fast-forward of the `gh-pages` commit that `deploy` read. A
     concurrent change makes the push fail instead of overwriting `gh-pages`.

   When all checks pass, `deploy` creates a commit with the validated tree, the
   previous release as its parent, and trailers `Source-Commit`, `Build-Id`,
   `Artifact-Id`, `Artifact-Digest`, and `Workflow-Run`. It then checks that
   `gh-pages` points to that commit so `gh-pages` holds the exact validated
   bytes.

3. **Smoke (`smoke`, read-only token).** This job runs
   `scripts/ci/smoke-site.mts` against the public URL. That URL uses the custom
   domain from the release's `CNAME`, or `https://<owner>.github.io` below
   `PUBLIC_URL`. The script polls until `build-id.txt` names the release, then
   checks that the base path, the client route `new` through `404.html`, and
   every local file that `index.html` loads serve the bytes of the published
   commit. Each poll adds a unique query string to every request because the
   Pages CDN caches each URL, even a 404, for ten minutes and ignores `no-cache`
   request headers. Without a unique query string, a repeated URL could keep
   answering with what Pages served before this release. Ten minutes is a hard
   deadline for the whole check. Any request or download still running at ten
   minutes is aborted and fails the check. A smoke failure means the release is
   on `gh-pages` but is not served correctly. Roll back or fix forward.

Concurrency groups cannot order runs. A re-run or manual run that joins the
`pages` group replaces any pending run, even a newer one. That replaced run then
shows as cancelled, and the site stays at the last release until the next push
to `main` or a fresh release of its head. See
[Releasing main again](#releasing-main-again).

Releases are public because `gh-pages` history records each one and the site
serves its build ID. Run these commands to inspect what is served and where it
came from:

```shell
curl -fsS https://<site>/build-id.txt     # <commit>.<run id>.<run attempt>
git fetch origin gh-pages
git log --format='%H %s%n%(trailers)' origin/gh-pages
```

Keeping every release means `gh-pages` only grows. The owner accepts that cost.
A full clone of the repository and the `rollback` job both fetch the whole
`gh-pages` history because `rollback` needs it to find and verify the chosen
release, whereas publishing fetches only the latest release. Git stores each
unchanged file once across releases, so a release adds roughly the files whose
bytes changed. Those files include at least `index.html`, `404.html`,
`build-id.txt`, the service worker, and the hashed bundles of changed code. At
the time of writing, one release tree was about 23 MB. Treat that figure as an
observation, not a budget. Shallow or single-branch clones such as
`git clone --single-branch` skip `gh-pages`.

#### Rolling back a release

A rollback is a production release that serves an earlier release again. Only
the owner can run it on `main`. Choose a `gh-pages` commit that `deploy.yaml`
published, identified by a `Source-Commit` trailer. You cannot restore the
single commit left by the earlier publisher with this workflow. If the base path
has changed since that release, fix forward instead of rolling back because
restored files keep their original base path while `smoke` checks the current
`PUBLIC_URL`.

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

`tests/release-publication.test.ts` runs these workflow steps directly from
`deploy.yaml` against local Git repositories and a loopback server that answers
like GitHub Pages at both the root and a subpath. It covers out-of-order runs,
altered, missing, and extra files, a concurrent `gh-pages` change, byte
identity, rollback, and the smoke check.

### Pull request evidence

`scripts/ci/contract.mts` defines a passing pull request run. It requires the
`lint-and-test` job of `ci.yaml`, all four of its named steps, and two JUnit
reports that each hold at least one test with no failures, errors, or skipped
tests. Explicit skipped-test checks are required because Vitest and Playwright
exit 0 when tests are skipped. The browser report must include every Playwright
project. Test counts are deliberately not pinned. `.github/workflows/ci.yaml`
runs on every pull request, including stacked ones, but `pnpm assess:pr` accepts
only pull requests that target `main`.

In CI, `pnpm test:reports` runs even after a failed step. It fails the job when
the reports break the contract, and it writes the identities, step outcomes,
counts, and failed tests to the job summary and `reports/evidence.json`. The
uploaded artifact is named `validation-<PR head>-attempt-<n>`. In pull request
CI, `github.sha` is not the pull request head. It is the merge commit that
GitHub tested, merging the head into the base at that time.

Everything a pull request run produces comes from code that the pull request can
change. Always assess a pull request from an up-to-date `main` checkout, never
from the pull request branch:

```shell
pnpm assess:pr <number> [--json]
```

The assessor performs read-only `gh api` calls and exits 0 only if all of these
conditions hold:

- The pull request is open and targets `main`, and its state, target branch,
  head, and base did not change while it was assessed.
- The newest `ci.yaml` `pull_request` run for that exact head completed with
  success, every job of its latest attempt succeeded with each required step,
  and no newer run or re-run started during the assessment.
- That job is the only latest `lint-and-test` check on the head and was created
  by the GitHub Actions app (ID 15368), so a same-named check from another
  workflow or app fails the assessment.
- The artifact of that run and attempt exists, was created during the attempt,
  matches its published SHA-256 digest, and satisfies the contract when checked
  again with `main`'s code.
- The evidence names this pull request, head, run, and attempt, and the tested
  commit is a merge of the head into the pull request's current base. If the
  base has moved, update the branch.

Otherwise, `pnpm assess:pr` exits 1 with a list of problems. It exits 2 if it
cannot run because of a GitHub API error or an unexpected response shape. To
triage a failure, open the printed run and job links, read the job summary, and
download the artifact for the JUnit reports, Playwright HTML report, and traces.
Artifacts expire after seven days, after which you must re-run the workflow to
assess again. Pass `--allow-closed` only to audit a merged pull request. A pass
describes only the moment it finished and does not stop later pushes or merges.

### Branch rules

GitHub enforces the ruleset `main: require CI` (ID 27290096) and read-only
Actions token defaults, defined in `scripts/ci/ruleset-proposal.json` and
`scripts/ci/workflow-permissions-proposal.json`. Nobody can push to `main`,
including the owner. A merge needs a pull request with resolved conversations
and a passing `lint-and-test` check from the GitHub Actions app on a branch that
is up to date with `main`. Update the branch with **Update branch**,
`gh pr update-branch`, or a rebase. The ruleset does not cover `gh-pages`.

The ruleset checks only the required check's name and conclusion, so review
every change to workflows and scripts. As the owner, run `pnpm check:settings`
to confirm that GitHub still enforces both settings.
[Branch rules in docs/records](docs/records/branch-rules.md) holds their limits,
the cutover record, and the procedures to change the required check and to
re-apply or roll back the settings.

## Service worker

`vite-plugin-pwa` builds `src/service-worker.ts` in `injectManifest` mode, and
`src/serviceWorkerRegistration.ts` registers it only in production builds and
from the same origin.

The service worker handles caching and updates as follows:

- **Precache.** It precaches every built `.js`, `.css`, and `.html` file,
  including the local Monaco copy and `public/dependencies`. That precache is
  about 21 MB, including about 16 MB for Monaco. The TypeScript worker alone is
  about 7 MB, so the configuration sets an 8 MiB per-file limit. This precache
  makes offline startup and editor language support work at the cost of a large
  first download.
- **Runtime caching.** Navigations fall back to the precached `index.html`.
  Images under `images/`, `ergogen.png`, and `favicon.ico` use a cache-first
  strategy on first use, as does any file under `dependencies/` missing from the
  precache. These routes match below the build's base path. Google Fonts use
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
switch calls it again when toggled.

Analytics follow these rules:

- **No tag ID disables analytics.** Without `VITE_GTAG_ID`, the app never loads
  the analytics script, and minification removes the loader. `src/Ergogen.tsx`
  then shows **Send Usage Metrics** off and disabled with an explanation,
  regardless of stored consent.
- **Consent resolution.** The app checks four consent sources in order and uses
  the first match:
  1. A choice made in the current session whose storage write failed.
  2. The explicit key `ergogen:consent:sendUsageMetrics`.
  3. A stored `false` in the legacy `ergogen:config:sendUsageMetrics` or
     `ergogen:settings` keys. A stored `true` in either legacy key is ignored
     because older builds wrote it automatically.
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
type and touches only event-scoped registrations.

The admin script checks credentials in this order:

1. `GA_ACCESS_TOKEN`, a token with the `analytics.edit` scope.
2. `GA_SERVICE_ACCOUNT`, a service account with Editor access that the script
   impersonates through the IAM Credentials API using your `gcloud` login.
3. `gcloud auth application-default print-access-token` as the default fallback.

## Changelog

`CHANGELOG.md` holds user-facing changes, newest first. Follow the conventions
in the [changelog skill](.agents/skills/ergogen-gui-changelog/SKILL.md).
