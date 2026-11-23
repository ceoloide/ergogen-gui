# Acceptance record (HC-001 to HC-004)

This record shows how the validation that
[Validation in DEVELOPMENT.md](../../DEVELOPMENT.md#validation) describes was
checked against its acceptance criteria.

On 2026-11-15 (UTC), the validation work that #217 landed was checked against
the acceptance criteria of #219, #220, #221, and #222. The initial probes ran on
`8573027`, which combines `main` at `40061af` with the first fixes in the same
pull request as this record. Later commits removed a leaked listener in a unit
test (`40b3a71`) and stopped the update drill's fixture from forcing extra
workers (`d0257cc`). Local `pnpm validate:extended` ran again on `eda77a5`. The
final head, `0b60eed`, changed only this record and a test comment. Local runs
used Linux x86_64 with 4 cores, Node 24.22.3, pnpm 11.12.0, the committed
lockfile, actionlint 1.7.12, ShellCheck 0.11.0, and zizmor 1.32.0. Deliberate
errors were restored byte for byte, and the tree was clean afterwards.

Two kinds of evidence back this record. Anyone can check CI
[run 43707582696](https://github.com/ceoloide/ergogen-gui/actions/runs/43707582696)
on `0b60eed` and the committed regression tests. The probe, concurrency, and
instrumented results below were observed during implementation and are reported
as observed. Their logs, scripts, traces, and temporary checkouts were not kept,
so they cannot be inspected again.

**#219, reproducible isolated preparation: all criteria pass.**

- Two `git archive` copies, each with its own `HOME` and the shared pnpm store,
  ran frozen install and preparation at the same time. Both passed in 22 s
  without downloading a package and produced the same engine (399 files, where
  only the checkout path in its stamp differs) and, from one `VITE_BUILD_ID`,
  the same `dist/` (162 files).
- Every archived file stayed unchanged after install, a second
  `pnpm build-ergogen` ("up to date"), the build, and the browser tests.
  `~/.gitconfig`, the repository's Git configuration, a third checkout's engine
  and pnpm state, and the shared store's `ergogen` files kept identical content,
  inodes, and link counts once the copies were deleted. Neither copy's `HOME`
  gained a `.gitconfig`.
- On GitHub, the build job of
  [run 43670475998](https://github.com/ceoloide/ergogen-gui/actions/runs/43670475998)
  installed and built `40061af` the same way.

**#220, static and type checks: pass for the covered files after this pull
request's coverage fix. Type checking of hand-written declarations is still
open.**

- Testing one deliberate error per category caught every target.
  `pnpm format:check` named all 27 mutated files from every group in the
  coverage table that Prettier checks, `pnpm lint:js` named all 12 ESLint
  groups, `pnpm lint:md` named 3 Markdown files, `pnpm lint:shell` named 3 shell
  files, and `pnpm typecheck` caught both projects. Before the fix,
  `index.html`, `pnpm-workspace.yaml`, `patch/*.js`, `.husky/pre-commit`, and
  `.agents/` escaped.
- With `skipLibCheck`, `tsc` only parses the five hand-written `.d.ts` files. An
  initializer on an ambient `declare const` in `src/ergogen.d.ts` and in
  `scripts/ci/jsdom.d.ts` passed `pnpm typecheck`. Only an unclosed
  `declare module`, a syntax error, failed it. That proves parsing, not type
  checking, while code that uses the declarations is checked. This part of #220
  stayed open until those files were type-checked or explicitly excluded. The
  follow-up below type-checks them.
- Every probe exited nonzero and left the mutated bytes alone. A clean
  `pnpm validate:fast` exited 0 and changed no tracked or untracked file. No
  diagnostic baseline or suppression list is needed. #218 closed with #217.

**#220 follow-up, hand-written declarations: type-checked.** A later change on
top of `bd8f581` (#248) added `pnpm typecheck:declarations` to `pnpm typecheck`.
Local probes on 2026-11-15 compared it with the previous gates in two
`git archive` copies that shared the installed dependencies:

- One semantic error per file passed the previous `pnpm typecheck` and failed
  the new one, naming the file, position, and code. The tested errors were an
  initializer on a `declare const` in `src/ergogen.d.ts` (TS1039, in both
  projects), an initializer on a declared class property in
  `scripts/ci/jsdom.d.ts` (TS1039), an unknown type in `src/jscad.d.ts`
  (TS2304), a `Window` property that conflicts with `lib.dom` in `src/gtag.d.ts`
  (TS2717), and a missing `react` export in `src/vite-env.d.ts` (TS2305). A new
  untracked `src/` declaration file with an error failed the same way, and one
  outside both projects failed as uncovered.
- Prettier's parser rejects an initializer on a `declare const`, so the previous
  `pnpm validate:fast` already caught those at `pnpm format:check`. The other
  errors passed all of its static checks. The new `pnpm validate:fast` stops at
  the declaration check.
- A syntax error in a declaration file, and misuse of the declarations by app
  and tooling code, still fail both gates.
- A conflict with a dependency declaration loaded later in the program is
  reported in the dependency. The first version of the check asked only for
  diagnostics in our files and passed a `WindowEventMap` property in
  `src/jscad.d.ts` that conflicts with `vite/client`. The check now also keeps
  diagnostics whose related information points into our files, so this conflict
  fails and names `src/jscad.d.ts(3,3)` under the `vite` error (TS2717).
  Checking every declaration file raised the local run time of
  `pnpm typecheck:declarations` from about 6 to 26 seconds and its peak memory
  from 0.8 to 1.6 GB.
- Dependency errors stay excluded. With `skipLibCheck` off, every error `tsc`
  reports for either project is inside `node_modules`, and the new check passes
  without changing any dependencies. `tests/declaration-check.test.ts` repeats
  this with a temporary project whose synthetic dependency has errors, and it
  checks a conflict between our declaration and a dependency declaration in both
  orders.
- An interface of ours that merges with a dependency's interface and breaks what
  it extends is reported on the first declaration, without related information.
  Adding a `Window` property `onscroll: string` to `src/gtag.d.ts` conflicts
  with `GlobalEventHandlers`. With `skipLibCheck` off, `tsc` reports it only in
  `lib.dom.d.ts` (TS2430), so the previous version of the check passed it. The
  check now also keeps any diagnostic reported on the name of a symbol that our
  files declare, fails this mutant, and names the `src/gtag.d.ts` declaration
  under the `lib.dom` error. Dependency-only errors, including the `react-use`
  TS2430, stay excluded. The test project covers both orders and a
  dependency-only TS2430.
- Remaining limit. An error that our declaration causes but that TypeScript
  reports on another symbol, with no related information pointing to us, is
  still filtered out as a dependency error. The owner accepted this bounded
  coverage and closed #220 on 2026-11-16, recorded in #226.
- The mutants, logs, and hash manifests are kept outside the repository. The
  pull request names their location and the CI run of its final head.

**#221, shared validation commands: all criteria pass, with the documented
ruleset limit.**

- The merge commit `d1fd408` that
  [run 43668208717](https://github.com/ceoloide/ergogen-gui/actions/runs/43668208717)
  tested has the tree of `40061af` and passed 724 unit and 26 browser tests in
  all three projects. Local `pnpm validate:extended` on `eda77a5` passed 728
  unit and 26 browser tests and changed no file. `0b60eed` differs from
  `eda77a5` only in this record and a test comment, so no behavior code changed.
  Its CI run 43707582696 passed 728 unit tests in 61 files and 26 browser tests
  in all three projects, with none skipped, and uploaded its reports.
- Each broken input failed its gate. Actionlint with ShellCheck caught an
  unterminated expression and an unquoted `run:` variable. Zizmor caught
  template injection, default checkout credentials, and an unpinned action.
  ShellCheck caught shell errors. `tests/workflow-security.test.ts` caught a
  write token, a skipped or ignored validation step, and a skipped job.
  `pnpm typecheck`, both directly and through `pnpm validate:fast`, caught a
  type error. `pnpm test:unit` caught a failing test. Actionlint does not check
  event payload property names, and zizmor accepts an explicit
  `persist-credentials: true`.
- The policy tests and `pnpm assess:pr` reject a skipped job or step, while the
  ruleset alone accepts a skipped whole job. See [Branch rules](branch-rules.md#limits).
  The failed
  [run 43665718955](https://github.com/ceoloide/ergogen-gui/actions/runs/43665718955)
  (#246) still uploaded `unit.xml` and `evidence.json` naming its failed test.

**#222, isolated production-browser runs: no collisions. In the update drill,
extra-worker installation reproduced and was fixed, while its connection to the
original second-chip failure remains inferred. One cause of the STL preview
failure under load, a repeated generation, was found and fixed. A. dux tests
still time out on a saturated machine (see the last item).**

- Six pairs of full runs executed in the two copies at once at load 11 to 14 on
  4 cores. Each run used its own free ports, each server served its own copy's
  build, and every build ID matched. The load exposed failures that were not
  collisions. The update prompt missed an update that the browser found first
  in 4 of 8 runs (fixed here), the GitHub loading test checked a transient bar
  too late in 1 of 4 runs (fixed here), and the STL preview took over 20 s in 1
  of 12 runs. With those fixes, 3 of 4 runs passed. In the fourth run, the
  update chip was still visible 5 s after the update had reloaded into the next
  build.
- Extra-worker installation reproduced and was fixed, though its connection to
  that second-chip failure remains inferred. The failing trace shows a second
  install notice in the old page 328 ms after the click, and the reloaded page
  showing the chip without one, so a worker was already waiting when it
  registered. Instrumented runs using DevTools worker version IDs, page worker
  states, and a logging proxy showed why. After the fixture aborted the worker's
  Google Fonts requests and that worker stopped, Chromium forced a new,
  byte-identical worker on every navigation (`ForceUpdateOnReloadIfModified`).
  It did so in every routed run and in no run with the routes removed or only
  continuing. Normally that worker activates at once, and the failing trace fits
  one that stayed waiting. The instrumented runs did not reproduce the chip
  itself, and 12 runs at load 10 to 14 passed. The drill now counts installed
  workers. `pnpm exec playwright test e2e/service-worker-update.spec.ts` found 5
  before the fixture change and 2 after it.
- After the fix, one more pair of full runs ran at once at load up to 11.5. The
  update drill passed in both runs, and one run failed only the A. dux STL
  preview after its 20 s wait (2 of 14 runs).
- In a follow-up on top of `c51d4a8`, a probe that logged the page's worker
  messages reproduced the STL timeout in 1 of 8 repeats. Every load generated
  A. dux twice. The second result arrived 72 ms after the test clicked the
  finished STL, marked it pending, and sent the preview back to the demo
  outline. Once auto-generation stopped repeating a request, 16 of 16 repeats
  generated once and passed. Slow generation remains. Full runs whose load
  averages peaked at 10 to 26 on 4 cores failed 1 to 7 tests on timeouts before
  and after the fix, mostly A. dux tests. Before the fix, the 3 retained A. dux
  traces show the repeated request and a 60 s test timeout after the first
  outputs appeared. After the fix, the 6 retained A. dux traces show one
  request, the Ergogen worker starting 19 to 40 s after navigation, and no
  outputs within the 10 or 20 s waits. The same work found the update drill's
  worker requests reaching an environment proxy, with 9 `CONNECT`s to
  `fonts.googleapis.com` through a local recording proxy and 0 after the fix. A
  NetLog of every browser in a full run showed TCP connections only to the
  loopback test servers. All 35 GitHub requests were answered by the provider
  tests' routes. The NetLog covers browsers only. `pnpm install` downloads
  Git-hosted packages from `codeload.github.com` and `build-ergogen` fetches the
  footprint libraries with Git when its inputs change, neither through the REST
  API. Logs, traces, and scripts are kept outside the repository, and the pull
  request names them.
- A foreign server on the root port failed the run in 2 s before any build
  ("is already used"). A server built with another ID failed global setup
  ("reached the wrong build … expected probe-root, got foreign-build").
- Deleting the deployed Ergogen worker, so the server returns `index.html`, and
  disabling the worker's debug outputs each failed the DXF preview test. A base
  path hard-coded in the welcome previews failed `base-path.spec.ts` below
  `/ergogen-gui/` only.
- Every failure kept its error, a screenshot, and a valid `trace.zip` with
  actions, screencast, and network log. For locator assertions, the trace marks
  the failed expectation. The network logs show only loopback requests and
  Google Fonts requests that were aborted by the fixture or, in the update
  drill, failed to resolve.
