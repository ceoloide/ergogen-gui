# Background for DEVELOPMENT.md

This file records the reasons and measurements behind rules in
[DEVELOPMENT.md](../../DEVELOPMENT.md), and the details that moved out of it on
2026-11-23. Each section links to the rules it explains. Where a section
describes what a script, test, or configuration does, that code is the current
source, and this file shows it as of 2026-11-23.

## Validation

This section explains [Validation](../../DEVELOPMENT.md#validation).

### Checks for each file group

Validation runs these checks on each group of maintained files:

- `src/`: Prettier, ESLint, and TypeScript with the strict `tsconfig.json`.
- `tests/`, `e2e/`, `scripts/ci/`, `scripts/queue/`, and root `*.config.mts`:
  Prettier, ESLint, and TypeScript with `tsconfig.tooling.json`.
- JavaScript in other `scripts/`, `patch/*.js`, `eslint.config.mjs`, and corpus
  footprints: Prettier and ESLint. JavaScript files are not type-checked.
- `scripts/*.sh`, `patch/*.sh`, and `.husky/pre-commit`: ShellCheck.
- `.github/` workflows and configuration: Prettier and zizmor. Workflows also
  run actionlint, which runs ShellCheck on `run:` blocks.
- Markdown, including `.agents/`: Prettier and markdownlint. `pnpm format:check`
  skips `docs/`, where only `lint-staged` runs Prettier.
- JSON, `index.html`, and `pnpm-workspace.yaml`: Prettier.
- Declaration files: `pnpm typecheck:declarations`, as
  [Declaration check](#declaration-check) describes.

Validation intentionally skips the vendored scripts in `public/dependencies/`,
other files in `public/`, the pnpm-generated `pnpm-lock.yaml`, the byte-exact
fixtures `tests/ci/reports/*.xml` and `tests/engine-contract/corpus/*.yaml`, and
Git-ignored output such as `dist*`, `reports/`, and `.tools/`.

### Declaration check

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
declarations. The [acceptance record](acceptance-hc-001-to-hc-004.md) describes
the probes behind each case.

### Screenshots

`E2E_SCREENSHOTS=1` is off by default because those screenshots check nothing
and took 13% of traced test time under load.

## Browser tests

This section explains [Browser tests](../../DEVELOPMENT.md#browser-tests).

Each project's metadata names its server and build ID, and the build ID check
in `e2e/global-setup.ts` makes sure that tests never reach a stale or foreign
server. Setting `VITE_BUILD_ID` also adds an `ergogen-build-id` meta tag to
`index.html`.

Playwright routes cannot replace the update drill's file copy because Chromium
fetches the worker script for update checks outside the page.

### Update drill network

The drill's browser ignores environment proxies because a proxy would resolve
host names itself. The fixture lets that service worker's requests to Google
Fonts pass through so they fail at name resolution instead of being aborted
through DevTools. Once DevTools aborts a service worker request, Chromium
installs a new worker on every later navigation without comparing the script,
matching DevTools' **Update on reload** behavior. Those extra installations can
interfere with the drill, though their connection to the original second-chip
failure remains inferred. See the
[acceptance record](acceptance-hc-001-to-hc-004.md).

### Browser test timings

Waits for generated outputs begin as soon as `page.goto` resolves, before the
workers start, so those waits also cover CPU-bound worker startup.

In single-sample measurements, one A. dux page used about 8 s of browser-thread
CPU on a quiet machine and 10 to 11 s with other CPU-bound processes running.
Its STL rows appeared 2.2 s into the STL test's 10 s wait on a quiet 4-core
machine, and 5.8 to 7.1 s into that wait with four other CPU-bound processes
running. Under that load, the Ergogen and JSCAD workers stayed busy 2.3 to 2.8
times longer for 1.1 to 1.25 times their CPU time.

## Engine contract tests

This section explains why GUI tests need a version in the `package.json` engine
specifier, as [Engine contract tests](../../DEVELOPMENT.md#engine-contract-tests)
describes.

If the specifier names no version while a deployment selects an older engine,
that deployment's GUI tests use its older engine, and tests that expect
canonical behavior fail.

## Generation

This section explains rules in [Generation](../../DEVELOPMENT.md#generation).

- Each new result marks STL files pending until `jscad.worker.ts` finishes, so
  auto-generation skips duplicate requests to avoid clearing a finished
  conversion.
- Keystrokes update `ConfigContext` only after a 500 ms debounce because context
  updates re-render widely and persist all configurations.
- Closing the settings panel recreates `ergogen.worker.ts` so renamed or deleted
  injections cannot linger in Ergogen's module-level registry.

## Feature flags

Feature gates apply in every path listed in
[Feature flags](../../DEVELOPMENT.md#feature-flags) so stale stored injections
cannot reach an engine that rejects them.

## Engine and footprints

This section explains rules in
[Engine and footprints](../../DEVELOPMENT.md#engine-and-footprints).

- The installed `ergogen` package is read-only because pnpm hard-links it from
  a shared store, so engine preparation works on a copy.
- [Engine experiments](../../DEVELOPMENT.md#engine-experiments) runs
  `node scripts/preinstall.js` before `pnpm install` because pnpm 11 reads the
  manifest before the root `preinstall` hook.

## Deployment engine

This section explains [Deployment engine](../../DEVELOPMENT.md#deployment-engine).

The `ERGOGEN_VERSION` repository variable applies to one repository so that a
staging fork and production can differ without a code change.

In the `build` job, `node scripts/ci/deploy-engine.mts resolve` reads
`ERGOGEN_VERSION` from the environment and resolves a branch or tag to
`github:<owner>/<repo>#<commit>` with `git ls-remote`. Resolving on every run is
necessary because pnpm would otherwise reuse the commit in `pnpm-lock.yaml`
whenever `ERGOGEN_VERSION` matches the manifest specifier
(`github:ceoloide/ergogen#v4.3.0`). Next, the install step runs the
[engine experiments](../../DEVELOPMENT.md#engine-experiments) procedure with
that pinned specifier and `--no-frozen-lockfile`. `deploy-engine.mts verify`
fails unless pnpm installed that specifier from that exact commit. Finally,
`pnpm validate` uses the same commit for engine preparation, the UI's GitHub
link, and share links. Because `ERGOGEN_VERSION` is set, `pnpm validate` runs
the GUI tests and `tests/engine-smoke.test.ts`, and it skips the engine contract
tests that describe the canonical engine.

The version chip shows the installed package version, and the workflow step
summary records the installed version and commit when available, including for
canonical builds. The rewritten lockfile stays on the runner and is never
committed. Engine preparation keys its cache on the installed package path,
which names the commit, so a different commit always rebuilds the engine.

## CI and deployment

This section lists what `tests/workflow-security.test.ts` checks, as
[CI and deployment](../../DEVELOPMENT.md#ci-and-deployment) mentions.

`tests/workflow-security.test.ts` checks permissions, triggers, credentials, the
artifact handoff, the shared validation step, what the write-scoped jobs may
run, and agreement between `ci.yaml`, the ruleset proposal, and the evidence
contract.

## Release tests

`tests/release-publication.test.ts` runs the workflow steps of
[Releases and rollback](../../DEVELOPMENT.md#releases-and-rollback) directly
from `deploy.yaml` against local Git repositories and a loopback server that
answers like GitHub Pages at both the root and a subpath. It covers
out-of-order runs, altered, missing, and extra files, a concurrent `gh-pages`
change, byte identity, rollback, and the smoke check.

## Release checks

This section explains what each check in
[Releases and rollback](../../DEVELOPMENT.md#releases-and-rollback) prevents.

- The `deploy` job publishes only while its run's commit is still the head of
  `main`, so a late or re-run obsolete job never replaces a newer release.
- The push must fast-forward the `gh-pages` commit that `deploy` read, so a
  concurrent change makes the push fail instead of overwriting `gh-pages`.
- `deploy` checks that `gh-pages` points to the commit it created, so
  `gh-pages` holds the exact validated bytes.
- A rollback across a base path change fails because restored files keep their
  original base path while `smoke` checks the current `PUBLIC_URL`. Fix forward
  instead.

## Release smoke check

This section explains the unique query string in the `smoke` job of
[Releases and rollback](../../DEVELOPMENT.md#releases-and-rollback).

The Pages CDN caches each URL, even a 404, for ten minutes and ignores
`no-cache` request headers. Without a unique query string, a repeated URL could
keep answering with what Pages served before this release.

## Release history size

This section records the cost of keeping every release on `gh-pages`, as
[Releases and rollback](../../DEVELOPMENT.md#releases-and-rollback) describes.

Keeping every release means `gh-pages` only grows. The owner accepts that cost.
A full clone of the repository and the `rollback` job both fetch the whole
`gh-pages` history because `rollback` needs it to find and verify the chosen
release, whereas publishing fetches only the latest release. Git stores each
unchanged file once across releases, so a release adds roughly the files whose
bytes changed. Those files include at least `index.html`, `404.html`,
`build-id.txt`, the service worker, and the hashed bundles of changed code. At
the time of writing, one release tree was about 23 MB. Treat that figure as an
observation, not a budget.

## Pull request evidence

This section explains
[Pull request evidence](../../DEVELOPMENT.md#pull-request-evidence).

The contract checks for skipped tests explicitly because Vitest and Playwright
exit 0 when tests are skipped.

Everything a pull request run produces comes from code that the pull request can
change, so assess a pull request from an up-to-date `main` checkout, never from
the pull request branch.

`pnpm assess:pr` exits 0 only if all of these conditions hold:

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

## Analytics and privacy

A stored `true` in either legacy consent key, `ergogen:config:sendUsageMetrics`
or `ergogen:settings`, is ignored because older builds wrote it automatically,
as [Analytics and privacy](../../DEVELOPMENT.md#analytics-and-privacy)
describes.

## Service worker precache

This section records the size of the precache in
[Service worker](../../DEVELOPMENT.md#service-worker).

The precache is about 21 MB, including about 16 MB for Monaco. The TypeScript
worker alone is about 7 MB, so the configuration sets an 8 MiB per-file limit.
This precache makes offline startup and editor language support work at the
cost of a large first download.
