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
does. Husky/lint-staged run quick fixes on staged files; GitHub enforces
validation independently. Each maintained file gets the checks that apply to it:

| Files                                                                              | Checks                                                                       |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `src/`                                                                             | Prettier, ESLint, TypeScript (strict `tsconfig.json`)                        |
| `tests/`, `e2e/`, `scripts/ci/`, root `*.config.mts`                               | Prettier, ESLint, TypeScript (`tsconfig.tooling.json`)                       |
| JavaScript: other `scripts/`, `patch/*.js`, `eslint.config.mjs`, corpus footprints | Prettier, ESLint (JavaScript is not type-checked)                            |
| `scripts/*.sh`, `patch/*.sh`, `.husky/pre-commit`                                  | ShellCheck                                                                   |
| `.github/` workflows and configuration                                             | Prettier, zizmor; workflows also actionlint, which runs ShellCheck on `run:` |
| Markdown, including `.agents/`                                                     | Prettier, markdownlint                                                       |
| JSON, `index.html`, `pnpm-workspace.yaml`                                          | Prettier                                                                     |

TypeScript only parses the hand-written declaration files (`src/*.d.ts`,
`scripts/ci/jsdom.d.ts`): with `skipLibCheck` it reports their syntax errors but
not type errors inside them. Code that uses the declarations is type-checked.

Not checked, on purpose: the vendored scripts in `public/dependencies/` and other
files in `public/`, `pnpm-lock.yaml` (written by pnpm), the byte-exact fixtures
`tests/ci/*.xml` and `tests/corpus/*.yaml`, and Git-ignored output such as
`dist*`, `reports/` and `.tools/`.

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
then checks that the real worker waits, shows **Update Available** and activates,
and that no other worker installs.
Each drill changes the served copy, so it needs a fresh `pnpm test:e2e` run; do not
use `--repeat-each` or retries. Playwright routes cannot stand in for that
deployment: Chromium fetches the worker script for update checks outside the page. `pnpm exec playwright test --project chromium-subpath` selects tests, but every server still builds; the
`PLAYWRIGHT_*` variables in the config can pin ports and IDs.

`CI` forbids `.only` and sets two workers. The fixture blocks external requests,
including those made by service workers; provider tests route deterministic
responses. The update drill's browser resolves no host name instead, so its
worker's requests to Google Fonts fail there and the fixture lets them through:
once a worker's request is aborted through DevTools, Chromium installs a new
worker on every later navigation without comparing the script, as DevTools'
**Update on reload** does, and one of those can wait behind a second update chip. Service worker tests check images by their natural width, because a
missing file below the base returns `index.html` with HTTP 200.

Other test suites worth knowing: `tests/workflow-security.test.ts` checks
workflow policy; `tests/release-publication.test.ts` runs the deploy workflow's
release and rollback steps against local Git repositories and smoke tests the
result on a loopback server (see [Releases and rollback](#releases-and-rollback));
`tests/build-version.test.ts` checks build-time engine identity;
`tests/analytics-tag-id.test.ts` checks the build-time analytics tag ID.

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

### Acceptance record (HC-001 to HC-004)

On 2026-11-15 (UTC) the validation work that #217 landed was checked against
the acceptance criteria of #219, #220, #221 and #222, on `8573027`: `main` at
`40061af` plus the fixes in the same pull request as this record. Local runs used
Linux x86_64 with 4 cores, Node 24.22.3, pnpm 11.12.0, the committed lockfile,
actionlint 1.7.12, ShellCheck 0.11.0 and zizmor 1.32.0. Deliberate errors were
restored byte for byte and the tree was clean afterwards. Logs and probe scripts
were not committed.

**#219, reproducible isolated preparation: all criteria pass.**

- Two `git archive` copies, each with its own `HOME` and the shared pnpm store,
  installed (frozen) and prepared at the same time: both passed in 22 s without
  downloading a package, and produced the same engine (399 files; only the
  checkout path in its stamp differs) and, from one `VITE_BUILD_ID`, the same
  `dist/` (162 files).
- Every archived file was unchanged after install, a second
  `pnpm build-ergogen` ("up to date"), the build and the browser tests.
  `~/.gitconfig`, the repository's Git configuration, a third checkout's engine
  and pnpm state, and the shared store's `ergogen` files were unchanged: content,
  inodes, and link counts once the copies were deleted. No copy's `HOME` gained
  a `.gitconfig`.
- On GitHub, the build job of
  [run 43670475998](https://github.com/ceoloide/ergogen-gui/actions/runs/43670475998)
  installed and built `40061af` the same way.

**#220, static and type checks: pass for the covered files after this pull
request's coverage fix; type checking of hand-written declarations is still
open.**

- One deliberate error per category: `pnpm format:check` named all 27 mutated
  files, from every group in the coverage table that Prettier checks; `pnpm lint:js` the 12
  ESLint groups; `pnpm lint:md` 3 Markdown files; `pnpm lint:shell` 3 shell
  files; `pnpm typecheck` both projects. Before the fix, `index.html`,
  `pnpm-workspace.yaml`, `patch/*.js`, `.husky/pre-commit` and `.agents/`
  escaped.
- Open: with `skipLibCheck`, `tsc` only parses the five hand-written `.d.ts`
  files. An initializer on an ambient `declare const` in `src/ergogen.d.ts` and
  in `scripts/ci/jsdom.d.ts` passed `pnpm typecheck`; only an unclosed
  `declare module`, a syntax error, failed it. That proves parsing, not type
  checking. Code that uses the declarations is checked. This part of #220 stays
  open until those files are type-checked or explicitly excluded.
- Every probe exited nonzero and left the mutated bytes alone; a clean
  `pnpm validate:fast` exited 0 and changed no tracked or untracked file. No
  diagnostic baseline or suppression list is needed. #218 closed with #217.

**#221, shared validation commands: all criteria pass, with the documented
ruleset limit.**

- The merge commit `d1fd408` that
  [run 43668208717](https://github.com/ceoloide/ergogen-gui/actions/runs/43668208717)
  tested has the tree of `40061af` and passed 724 unit and 26 browser tests in
  all three projects. On `8573027`, local `pnpm validate:extended` passed
  728 unit and 26 browser tests and changed no file; this pull request's CI
  run checks the same tree.
- Each broken input failed its gate: an unterminated expression and an unquoted
  `run:` variable (actionlint with ShellCheck); template injection, default
  checkout credentials and an unpinned action (zizmor); shell errors
  (ShellCheck); a write token, a skipped or ignored validation step and a skipped
  job (`tests/workflow-security.test.ts`); a type error (`pnpm typecheck`, also
  through `pnpm validate:fast`); a failing test (`pnpm test:unit`). actionlint
  does not check event payload property names, and zizmor accepts an explicit
  `persist-credentials: true`.
- The policy tests and `pnpm assess:pr` reject a skipped job or step; the ruleset
  alone accepts a skipped whole job (see [Branch rules](#branch-rules)). The
  failed [run 43665718955](https://github.com/ceoloide/ergogen-gui/actions/runs/43665718955)
  (#246) still uploaded `unit.xml` and `evidence.json` naming its failed test.

**#222, isolated production-browser runs: no collisions; the update drill
failure is explained and fixed; a slow STL preview under load stays open.**

- Six pairs of full runs in the two copies at once (load 11 to 14 on 4 cores):
  each run used its own free ports, each server served its own copy's build and
  every build ID matched. The load exposed failures that were not collisions:
  the update prompt missed an update the browser found first (4 of 8 runs, fixed
  here), the GitHub loading test checked a transient bar too late (1 of 4, fixed
  here) and the STL preview took over 20 s (1 of 12). With those fixes, 3 of 4
  runs passed; in the fourth the update chip was still visible 5 s after the
  update had reloaded into the next build.
- That failure came from the browser-test fixture, not the app. Its trace shows
  a second install notice in the old page 328 ms after the click, and the
  reloaded page showing the chip without one, so a worker was already waiting
  when it registered. Instrumented runs (DevTools worker version ids, page
  worker states, a logging proxy) showed why: after the fixture aborted the
  worker's Google Fonts requests and that worker stopped, Chromium forced a new,
  byte-identical worker on every navigation (`ForceUpdateOnReloadIfModified`).
  It did so in every routed run and in none with the routes removed or only
  continuing. Normally that worker activates at once; the failing trace fits one
  that stayed waiting. The instrumented runs did not reproduce the chip itself
  (12 runs at load 10 to 14 passed). The drill now counts installed workers:
  `pnpm exec playwright test e2e/service-worker-update.spec.ts` found 5 before
  the fixture change and 2 after it.
- After the fix, one more pair of full runs at once (load up to 11.5): the
  update drill passed in both; one run failed only the A. dux STL preview after
  its 20 s wait, so that load failure (2 of 14 runs) stays open.
- A foreign server on the root port failed the run in 2 s, before any build
  ("is already used"); a server built with another ID failed global setup
  ("reached the wrong build … expected probe-root, got foreign-build").
- Deleting the deployed Ergogen worker (the server then returns `index.html`)
  and disabling the worker's debug outputs each failed the DXF preview test; a
  base path hard-coded in the welcome previews failed `base-path.spec.ts` below
  `/ergogen-gui/` only.
- Every failure kept its error, a screenshot and a valid `trace.zip` with
  actions, screencast and network log; for locator assertions the trace marks
  the failed expectation. The network logs show only loopback requests and
  Google Fonts that were aborted by the fixture or, in the update drill, failed
  to resolve.

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
  validates and builds once, then uploads `dist` as a one-day artifact; the
  `deploy` job publishes exactly that artifact to `gh-pages`, and a read-only
  `smoke` job checks the public site. See
  [Releases and rollback](#releases-and-rollback).
- Production runs share the `pages` concurrency group without cancellation.
  GitHub keeps one pending run per group, so a newer run replaces a queued older
  one (not FIFO). Manual runs on other branches build in their own group and
  never publish.
- Build variables come from repository variables; see the README configuration
  section. The analytics tag ID comes only from `VITE_GTAG_ID`, in both
  workflows and `vite.config.mts`.
- Actions are pinned by commit and updated by Dependabot with a seven-day
  cooldown. `tests/workflow-security.test.ts` asserts permissions, triggers,
  credentials, the artifact handoff, the shared validation step, what the
  write-scoped jobs may run, and that `ci.yaml` and the ruleset proposal match
  the evidence contract; update it with any workflow change.

### Releases and rollback

GitHub Pages serves the `gh-pages` branch (Settings > Pages, legacy build from
`/ (root)`). Every release and rollback is a commit on it, made only by
`deploy.yaml`:

1. **Build** (read-only token). Validates and builds with
   `VITE_BUILD_ID=<commit>.<run id>.<run attempt>`, which the site serves as
   `build-id.txt` and the `ergogen-build-id` meta tag. It adds `404.html`,
   `CNAME` (on `main`, if `CNAME_DOMAIN` is set) and `.nojekyll`, sets every file
   to mode 0644, records the Git tree ID of `dist`, which names every path and
   byte, and uploads `dist`.
2. **Deploy** (the write token; no checkout, install or repository code, only
   the artifact download and fixed shell in the workflow). It downloads the
   artifact by the ID the build job reported, so only that upload from this run
   arrives; the action fails on a digest mismatch. It then publishes only if all
   of these hold, and otherwise publishes nothing:
   - The downloaded files have the recorded tree ID and build ID.
   - This run's commit is still the head of `main`. Otherwise it reports "Not
     published", succeeds and leaves the newer run to publish, so a late or
     re-run obsolete run never replaces a newer release.
   - The push is a fast-forward of the `gh-pages` commit it read. A concurrent
     change makes it fail instead of overwriting.

   The commit has the validated tree, the previous release as parent and
   trailers `Source-Commit`, `Build-Id`, `Artifact-Id`, `Artifact-Digest` and
   `Workflow-Run`. It then checks that `gh-pages` points to that commit, which
   means it holds exactly the validated bytes.

3. **Smoke** (read-only token). Runs `scripts/ci/smoke-site.mts` against the
   public URL: the custom domain from the release's `CNAME`, otherwise
   `https://<owner>.github.io`, below `PUBLIC_URL`. It polls until
   `build-id.txt` names the release, then checks that the base path, the
   client route `new` (through `404.html`) and every local file `index.html`
   loads serve the bytes of the published commit. Each poll adds a query string
   of its own to every request, because the Pages CDN caches each URL, even a
   404, for ten minutes and ignores `no-cache` request headers; a repeated URL
   could keep answering with what Pages served before this release. Ten minutes
   is a hard deadline for the whole check: a request or download still running
   then is aborted and the check fails. A failure means the release is on
   `gh-pages` but not served correctly; roll back or fix forward.

Concurrency cannot order runs, and a re-run or manual run that joins the `pages`
group replaces any pending run, even a newer one. That run then shows as
cancelled, and the site stays at the last release until the next push to `main`
or a fresh release of its head (see [Releasing main again](#releasing-main-again)).

Releases are public: `gh-pages` history records each one, and the site serves
its build ID. To see what is served and where it came from:

```shell
curl -fsS https://<site>/build-id.txt     # <commit>.<run id>.<run attempt>
git fetch origin gh-pages
git log --format='%H %s%n%(trailers)' origin/gh-pages
```

Keeping every release has a cost the owner accepts: `gh-pages` only grows. A
full clone of the repository fetches its whole history, and so does the
rollback job, which needs it to find and verify the chosen release (publishing
fetches only the latest release). Git
stores each unchanged file once across releases, so a release adds roughly the
files whose bytes changed: at least `index.html`, `404.html`, `build-id.txt`,
the service worker and the hashed bundles of changed code. When this was
written, one release tree was about 23 MB; that is an observation, not a
budget. Shallow or single-branch clones (`git clone --single-branch`) skip
`gh-pages`.

**Rollback** serves an earlier release again. It is a production release: only
the owner runs it, on `main`, choosing a `gh-pages` commit that `deploy.yaml`
published (one with a `Source-Commit` trailer; the single commit left by the
earlier publisher cannot be restored this way):

```shell
gh workflow run deploy.yaml --ref main -f rollback_to=<gh-pages commit SHA>
gh run watch    # rollback, then smoke
```

The `rollback` job (write token, fixed shell only) checks that the commit is in
`gh-pages` history and was published by this workflow, then fast-forwards
`gh-pages` to a new commit with exactly that commit's tree and trailers
`Source-Commit`, `Build-Id`, `Rollback-To`, `Requested-By` and `Workflow-Run`.
It changes nothing if that tree is already served. The smoke job then checks the
restored build below today's `PUBLIC_URL`, while the restored files keep the base
path they were built with, so rollback assumes the base path has not changed
since that release; after a base path change, fix forward instead. The next push
to `main` releases normally and replaces the rollback.

#### Releasing main again

To release the head of `main` again without a new commit, after a rollback or
a cancelled run, start a fresh run of `main` without `rollback_to`:

```shell
gh workflow run deploy.yaml --ref main
gh run watch    # build, deploy, then smoke
```

It validates, builds and publishes like a push, with a new build ID. Re-running
all jobs of the latest run of `main` does the same, but GitHub allows re-runs
only for 30 days after a run, and re-running only the failed or `deploy` job
would need the build's one-day artifact, which may have expired.

`tests/release-publication.test.ts` runs these exact workflow steps, read from
`deploy.yaml`, against local Git repositories and a loopback server that
answers like GitHub Pages, at the root and below a subpath. It covers
out-of-order runs, altered, missing and extra files, a concurrent `gh-pages`
change, byte identity, rollback and the smoke check.

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

- The PR is open and targets `main`, and its state, target branch, head and
  base did not change while it was assessed.
- The newest `ci.yaml` `pull_request` run for that exact head completed with
  success, and every job of its latest attempt succeeded, with each required step.
  No newer run or rerun started while it was assessed.
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
A pass describes the moment it finished; it does not stop later pushes or merges.

### Branch rules

Since 2026-11-15 (UTC), GitHub enforces these settings: the ruleset
`main: require CI` (ID 27290096) gates merges into `main`, and the Actions
token defaults are read-only (see the [cutover record](#cutover-record)). Two
reviewed payloads hold the settings, and `pnpm check:settings` reports whether
GitHub still enforces them:

- `scripts/ci/ruleset-proposal.json`, a ruleset for the default branch only. It
  requires a pull request with resolved conversations and the required
  `lint-and-test` check from the GitHub Actions app on a branch that is up to
  date with `main`, and it blocks force pushes and deletion, with no bypass. It
  requires no approval: the owner is the only collaborator, and GitHub does not
  count an author's approval of their own pull request. Tests keep it in line
  with the contract.
- `scripts/ci/workflow-permissions-proposal.json`: the default `GITHUB_TOKEN`
  becomes read-only and Actions can no longer approve pull requests. Every job
  in `ci.yaml` and `deploy.yaml` runs with explicit permissions, its own or the
  workflow's (tests check this), so `deploy` and `rollback` keep
  `contents: write`. GitHub's own `pages-build-deployment` run, which serves
  `gh-pages`, also declares its own (`contents: read`, `pages: write` in its
  logs).

While the ruleset is active, nobody can push to `main`, the owner included, and
merges require an up-to-date pull request whose required `lint-and-test` check
GitHub accepts (use **Update branch**, `gh pr update-branch` or a rebase); see
the limitations below. The ruleset does not cover `gh-pages`, so releases and
rollbacks are unchanged. Open pull requests without such a check are blocked, as
intended.

This is a merge gate for ordinary pull requests, not confinement:

- GitHub accepts a required check that concludes `success`, `skipped` or
  `neutral`
  ([source](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks)).
  Skipped tests in a job that runs fail the job and block, but a PR that skips
  the whole job, for example with a job-level `if:` in its own `ci.yaml`,
  passes. The [assessor](#pull-request-evidence) rejects a skipped job and a
  missing, skipped or failed required step, but the ruleset does not run it.
- The check is reported by the GitHub Actions app from the workflow in the
  pull request itself. A PR that keeps the job and step names but changes what
  the steps run, and writes passing reports and evidence, passes both the
  ruleset and the assessor, which check names, conclusions and reports, not the
  commands. Only a trusted review of the PR's workflow and script changes
  catches that.
- The owner is an admin and can change or delete the ruleset at any time; "no
  bypass" only means the rules also apply to the owner's merges and pushes.
  Confining an agent would need a separate non-admin account and trusted
  review, such as required code-owner approval from another identity, which
  is out of scope here.

`pnpm check:settings` only reads, and must run as the owner, because only
admins can read a ruleset's bypass list. It exits 0 when the live ruleset
contains every value of the proposal (GitHub adds defaults for unnamed
parameters, which it ignores), has exactly its rules, cannot be bypassed by
you, and the Actions defaults match, and when, of the active rules GitHub
applies from every repository and organization ruleset, `main` gets exactly
the proposal's and `gh-pages` none; 1 with a list of differences, as before the
cutover; and 2 if it cannot run. `tests/settings-check.test.ts` covers it with
the recorded pre-cutover responses and one test per weakened setting or
foreign rule.

#### Cutover

These steps applied the settings on 2026-11-15; the
[cutover record](#cutover-record) lists what each one returned. Run them again
only to re-apply the settings after a [rollback](#rollback), with a new
snapshot. Only the owner runs them, from a clean checkout of the reviewed
commit that holds the proposals: the head of `main`, after the pull request that
last changed them has merged. Each stage can be rolled back alone.

1. **Snapshot.** Save the start state outside the checkout and keep it until the
   cutover is confirmed:

   ```shell
   repo=repos/ceoloide/ergogen-gui
   snap="$HOME/ergogen-gui-settings-$(date -u +%Y%m%dT%H%M%SZ)"; mkdir "$snap"
   echo "$snap"                                   # record this path
   git rev-parse HEAD > "$snap/reviewed-commit"   # the commit every later step runs from
   git status --porcelain                         # expect no output
   gh api "$repo/rulesets?includes_parents=false" > "$snap/rulesets.json"
   gh api "$repo/actions/permissions/workflow" > "$snap/workflow-permissions.json"
   gh api "$repo/branches/main/protection"   # expect: Branch not protected (HTTP 404)
   pnpm check:settings                       # expect exit 1, three problems
   ```

   Continue only if `reviewed-commit` is the reviewed head of `main`,
   the working tree has no changes, `rulesets.json` is `[]`,
   `workflow-permissions.json` is
   `{"default_workflow_permissions":"write","can_approve_pull_request_reviews":true}`
   and `main` is not protected. Otherwise the rollback below would not restore
   the start state; review the difference first.

   A later step in a new shell must reuse this directory. Set both variables
   again with the path that `echo "$snap"` printed, and do not rerun the `snap=`
   line or `mkdir` above, which would start a new, empty directory:

   ```shell
   repo=repos/ceoloide/ergogen-gui
   snap='<existing directory step 1 printed>'
   ```

2. **Baseline.** Record `gh pr view <number> --json mergeStateStatus` for the
   pull requests used in the [drill](#drill), and open the drill's failing pull
   request now, so each later state can be compared with this one. Opening it
   switches the checkout to a new branch; continue only once the drill commands
   have returned it to the reviewed commit.
3. **Actions defaults.**

   ```shell
   gh api --method PUT "$repo/actions/permissions/workflow" --input scripts/ci/workflow-permissions-proposal.json
   pnpm check:settings   # expect exit 1, only the ruleset problem left
   ```

4. **Ruleset.**

   ```shell
   gh api --method POST "$repo/rulesets" --input scripts/ci/ruleset-proposal.json --jq .id > "$snap/ruleset-id"
   pnpm check:settings   # expect: ENFORCED, exit 0
   ```

5. **Drill**, below. Its passing row needs a real pull request that is up to
   date with `main`; read its state before anything merges. The owner then
   merges it as usual. That merge and its release are the first under the new
   settings: check that its `deploy` job log lists `Contents: write` under
   "GITHUB_TOKEN Permissions" and that its `smoke` job passes. Then update the
   status at the top of this section and the record.

#### Drill

The drill proves the gate without merging anything. `gh pr merge` is not a
probe: it would merge a pull request that passes. Read the merge state instead:

```shell
gh pr view <number> --json mergeStateStatus,headRefOid
```

Only `CLEAN`, `UNSTABLE` (a failing check that is not required) and
`HAS_HOOKS` can be merged. `BLOCKED` means a required rule is not met and
`BEHIND` that the branch must be updated first; GitHub does not document which
of the two it reports when both apply. It computes the state lazily: repeat the
command after `UNKNOWN`. Because `pnpm check:settings` confirmed that you
cannot bypass the ruleset, these states apply to the owner too. Expected after
step 4:

| Pull request                                          | Before     | After                 |
| ----------------------------------------------------- | ---------- | --------------------- |
| Failing `lint-and-test` (opened for the drill)        | `UNSTABLE` | `BLOCKED`             |
| No `lint-and-test` run on its head                    | `CLEAN`    | `BLOCKED` or `BEHIND` |
| Passing `lint-and-test`, behind `main`                | `CLEAN`    | `BEHIND` or `BLOCKED` |
| Passing `lint-and-test`, up to date, threads resolved | `CLEAN`    | `CLEAN` (step 5)      |

The drill opens only the failing pull request. For the two middle rows, use an
open pull request that already fits, if any; `statusCheckRollup` shows whether
`lint-and-test` ran on `headRefOid` and how it concluded:

```shell
gh pr view <number> --json statusCheckRollup,headRefOid,baseRefOid
```

If no open pull request fits a row, record that row as unavailable rather than
opening one for it; the drill then does not cover that row.

The failing pull request adds one failing test on top of the current `main`.
Open it from the cutover checkout, in the shell of step 1 (in a new shell, set
`snap` to the recorded directory first, as step 1 shows), and only when
`git status --porcelain` prints nothing. Each run creates a new branch, named
`drill/required-check-` followed by the UTC time and a random suffix, and saves
the name in `$snap/drill-branch`, so a branch left over from an earlier drill is
never reused. The commands in parentheses stop at the first one that fails, so a
failed `git switch -c` cannot commit on, or push, another branch. Do not add
`||` or `&&` after the closing parenthesis: the shell then ignores `set -e`
inside it. The last three lines run either way and return to the reviewed commit
without discarding anything; if `git status --porcelain` prints anything there,
the drill stopped part-way: read the error before trying again.

```shell
(
set -eu
test -d "$snap"                        # the directory of step 1
test -z "$(git status --porcelain)"    # stops on local changes
branch="drill/required-check-$(date -u +%Y%m%dT%H%M%SZ)-$(od -An -N3 -tx1 /dev/urandom | tr -d ' \n')"
printf '%s\n' "$branch" > "$snap/drill-branch"
git fetch origin main
git switch -c "$branch" origin/main
cat > tests/drill.test.ts <<'TEST'
import { expect, it } from 'vitest';

it('fails on purpose for the branch rules drill; never merge', () => {
  expect(true).toBe(false);
});
TEST
git add tests/drill.test.ts
git commit -m 'test: fail on purpose for the branch rules drill (never merge)'
git push -u origin "$branch"
gh pr create --base main --head "$branch" --title 'Branch rules drill: failing check (never merge)' --body 'Must show BLOCKED once the ruleset is active. Close without merging.'
)
git status --porcelain                                # expect no output
git switch --detach "$(cat "$snap/reviewed-commit")"  # refuses rather than discard changes
git rev-parse HEAD                                    # expect the reviewed commit
```

Steps 3 and 4 run from there. Once `lint-and-test` has failed and the state
after step 4 was read, close it by the saved name (in a new shell, set `snap`
first):

```shell
branch="$(cat "$snap/drill-branch")" && gh pr close "$branch" --delete-branch
```

A pull request of this repository can still change `ci.yaml`, so the drill
proves only that the required check gates merges, not that the check is honest;
see the limits above.

#### Cutover record

The settings were applied as the owner on 2026-11-15 (UTC), from `main` at
`81604c2`. The pull request that added the proposals and this runbook (#245)
had already merged, so the reviewed commit was the head of `main`, not an
unmerged cutover branch as an earlier version of these steps assumed.

- **Snapshot**, in `ergogen-gui-settings-20261115T015515Z` in the owner's
  home directory: no rulesets, `main` not protected, Actions defaults `write`
  and able to approve pull requests; `pnpm check:settings` exited 1 with three
  problems. [Rollback](#rollback) uses this directory until the settings are
  applied again; keep it.
- **Actions defaults**: `read`, cannot approve pull requests; the check then
  reported only the missing ruleset.
- **Ruleset** 27290096, `main: require CI`: active on the default branch only,
  no bypass actors, and the owner can never bypass it. It blocks deletion and
  force pushes, requires a pull request with resolved threads and no approvals,
  and requires `lint-and-test` from the GitHub Actions app (ID 15368) on a
  branch that is up to date with `main`. GitHub applies exactly these four rules
  to `main` and none to `gh-pages`. `pnpm check:settings` reported `ENFORCED`
  and exited 0, again after the drill.

Drill results (merge states read with `gh pr view`):

| Pull request                                                           | Before                     | After                                         |
| ---------------------------------------------------------------------- | -------------------------- | --------------------------------------------- |
| #246, failing `lint-and-test`, head `187f8e8` on `81604c2`             | `UNSTABLE` (check running) | `BLOCKED` while pending and after the failure |
| #93, no `lint-and-test` on its head, 235 commits behind `main`         | `CLEAN`                    | `BEHIND`                                      |
| #209, passing `lint-and-test` from July 2026, 20 commits behind `main` | `CLEAN`                    | `BEHIND`                                      |
| #247, passing `lint-and-test`, head `c2cc92c` on `81604c2`, no threads | —                          | `CLEAN`                                       |

- #246 failed only on purpose: in run 43665718955, format, lint and types
  passed, and `tests/drill.test.ts` was the one failed unit test (724 passed).
  It was closed without merging. `gh pr close --delete-branch` deleted only
  its remote branch; the local `drill/required-check` (`187f8e8`) is still in
  the owner's checkout, which is why the drill now names a new branch each time.
- #93 and #209 show that the ruleset now blocks both, but #93 is behind `main`
  as well as missing the check, and GitHub reports one state. The drill
  therefore did not isolate the missing-check row from the stale one.
- #247, which adds this record, read `CLEAN` at head `c2cc92c`, up to date
  with `main` at `81604c2`. Its run 43667010586 (job 132668524192) passed 724
  unit tests and 26 browser tests, none skipped, and `pnpm check:settings`
  still reported `ENFORCED`. This holds for that head only: every later push
  needs its own passing run before the pull request can merge.
- The first release under the new defaults (step 5) is pending until the owner
  merges #247. The #247 result and that release will be recorded in #226. The
  last release before the cutover (run 43655577978) already listed
  `Contents: write` for `deploy`, from the job's own permissions.

#### Rollback

Rollback restores the snapshot. In a new shell, first set `repo` and `snap`
again as step 1 shows, with the recorded directory; do not rerun its `snap=`
line. Remove the ruleset, restore the Actions defaults, then compare:

```shell
gh api --method DELETE "$repo/rulesets/$(cat "$snap/ruleset-id")"
gh api --method PUT "$repo/actions/permissions/workflow" --input "$snap/workflow-permissions.json"
diff <(gh api "$repo/rulesets?includes_parents=false") "$snap/rulesets.json"
diff <(gh api "$repo/actions/permissions/workflow") "$snap/workflow-permissions.json"
```

Either of the first two commands alone undoes its stage. If no pull request
can pass the required check for a reason outside the repository, such as a
GitHub outage, delete the ruleset the same way, and later recreate it with
step 4 (which records the new ID) and `pnpm check:settings`. The proposal file
holds the whole ruleset, so nothing else needs saving.

To change the required check itself (renaming the job, for example), change
`contract.mts`, `ci.yaml` and the proposal in one pull request. That pull
request cannot report the old check, so after review update the live ruleset
from its checkout with `gh api --method PUT "$repo/rulesets/<id>" --input
scripts/ci/ruleset-proposal.json`, run `pnpm check:settings`, and then merge it.

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
  shows `UpdateChip`, also when the browser found the update during navigation,
  before the page registered; clicking it posts `SKIP_WAITING` and reloads (with a
  one-second fallback reload). `?force_update` and `?force_install` show the update
  and install controls for testing.

## Analytics and privacy

`src/utils/analytics.ts` owns consent and transport. `src/index.tsx` calls
`initAnalytics()` before rendering; the settings switch re-runs it.

- **No tag ID, no analytics.** Without `VITE_GTAG_ID` the script is never loaded,
  and minification removes the loader. `src/Ergogen.tsx` then shows the **Send
  Usage Metrics** switch off and disabled, with an explanation, whatever consent
  is stored.
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
