---
name: verify-ergogen-gui
description: Prove in a real browser that a feature of Ergogen Web UI works. `pnpm verify <feature>` builds and serves the app, drives the journey of the feature in Chromium, and keeps screenshots, ARIA snapshots, and a JSON result in reports/verify/. Use in ceoloide/ergogen-gui after a change to behavior that a user sees, before you claim that the change works, and to add a journey for a feature; not for unit tests or for engine output alone.
---

# Verify Ergogen Web UI

Ergogen Web UI is a React app that runs in the browser. Users touch only the
web UI: the Welcome page, the configuration editor, the Outputs panel, the
preview, and the settings. The Ergogen engine runs in a web worker inside the
page.

`pnpm verify` drives the production build the way a user does and keeps the
proof. These words have one meaning here:

- A **feature** is a user-facing capability with a file in
  [features/](features/README.md).
- A **journey** is `e2e/journeys/<feature>.journey.ts`: one Playwright test
  that drives one user path through the feature, step by step.
- The **proof** is what a run keeps in `reports/verify/<feature>/`.

## Launch

Install the dependencies with `pnpm install --frozen-lockfile`, and Chromium
once with `pnpm exec playwright install chromium`. Then run one feature, some
features, or every journey:

```sh
pnpm verify generate
pnpm verify generate share
pnpm verify
pnpm verify --list
```

One run does these steps:

1. It removes the old proof of the features that it runs.
2. It builds the app with `pnpm build`, which also prepares the engine, with a
   new build ID, into a new folder `ergogen-gui-verify-<build ID>` in the
   temporary folder of the system.
3. It serves the build with `vite preview` on a free loopback port.
4. It checks that the server answers `/build-id.txt` with the build ID of the
   run, before any journey. `e2e/global-setup.ts` makes this check.
5. It runs each journey in a new Chromium context at 1280 × 720, one at a
   time, without retries.
6. It stops the server and removes the build.

The app is ready when Playwright prints `Running 1 test using 1 worker`. A
journey still waits for each state that it needs, because the app starts its
workers after the page loads.

On a machine with 4 CPUs, `pnpm verify generate` takes about 40 seconds, of
which the build takes about 30. The exit status is 0 when every journey
passed, 1 when a journey failed or did not run, and 2 when the arguments are
wrong.

Each run has its own port, build ID, and build folder, so runs in separate
worktrees can run at the same time. Runs in one checkout share
`reports/verify/`. Do not run the same feature twice at the same time in one
checkout.

## Doctor

```sh
pnpm verify --doctor
```

The doctor changes nothing. It checks that Node.js matches `.node-version`,
that the Chromium of Playwright is installed, and that `e2e/journeys/` holds a
journey. It prints the commit, and whether the working tree has changes that
are not committed. It exits 0 when each check passes. Run it first when a run
fails before any journey starts.

A run checks its own server in step 4 of Launch. Never drive a server that the
run did not start, such as a `pnpm dev` server of a person: its build, its
storage, and its open tabs are not yours.

## Drive

A journey is one Playwright test that uses the `journey` fixture of
`e2e/journeys/journey.ts`:

```ts
import { test, expect } from './journey';

test('generates the outputs of a configuration typed in the editor', async ({
  page,
  journey,
}) => {
  await journey.step('Open the app', async () => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Ergogen Web UI' })
    ).toBeVisible();
  });
});
```

Follow these rules in each journey:

- Put one test in a journey file. The name of the file, before
  `.journey.ts`, is the name of the feature.
- Put each user action and the check of its result in one
  `journey.step(name, body)`. Name the step by the action, such as
  `Choose Generate`. After each step, the fixture saves a screenshot and an
  ARIA snapshot.
- Keep a value that the journey reads from the page with
  `journey.observe(name, value)`. It goes into `result.json`.
- Select elements by role, accessible name, label, or text. To find the
  names, read the ARIA snapshots of an earlier run.
- Wait for an observable state with `expect`, never for a fixed time. Give a
  check that waits for a generation a timeout of 30 seconds.
- Drive the real user path. Do not set `localStorage`, call functions of the
  app, or open a route for tests to reach a state that a user reaches through
  the UI. The shared fixture of `e2e/fixtures.ts` blocks every request to
  another host, so mock only a host, as `e2e/utils/githubMocks.ts` mocks
  GitHub.
- When the app lacks a state that the journey needs, let the journey fail and
  write the reason in the Gotchas of the feature file. Never weaken a check to
  make a journey pass.

These handles are stable. An element that has a label but no role needs
`getByLabel(name, { exact: true })`.

| What the user sees                     | Handle                                                                     |
| -------------------------------------- | -------------------------------------------------------------------------- |
| Welcome page at `/new`                 | heading `Ergogen Web UI`                                                   |
| Empty Configuration                    | button `Start with empty configuration`                                    |
| An example card                        | label `Load <name> example`, such as `Load A. Dux example`. It has no role |
| Configuration editor                   | textbox `Editor content` inside the role `code`                            |
| Generate                               | button `Generate configuration`                                            |
| Outputs panel                          | heading `Outputs`                                                          |
| Output file, which selects its preview | text of the file name, such as `board.dxf`                                 |
| Download of one output                 | label `Download board.dxf`. It has no role                                 |
| SVG preview                            | img `Ergogen SVG Output preview`. Its `src` holds the SVG                  |
| Error banner                           | button `Close error message`                                               |
| Settings                               | button `Show settings panel`                                               |
| Share                                  | button `Share configuration`                                               |
| Archive of all outputs                 | button `Download archive of all generated files`                           |

Text that you type in the editor gets the automatic indentation of the editor
on each new line, which breaks YAML. Paste the text through the clipboard, as
`pasteIntoEditor` in `e2e/journeys/generate.journey.ts` does.

## Evidence

A run keeps this proof:

- `reports/verify/<feature>/NN-<step>.png` and `NN-<step>.aria.yml`: the page
  after each step that passed.
- `reports/verify/<feature>/failed.png` and `failed.aria.yml`: the page when
  the journey failed.
- `reports/verify/<feature>/result.json`: the status, the error, the commit,
  whether the working tree had changes, the build ID, the URL, each step with
  its status, time, and files, the observed values, the uncaught errors of the
  page, and the readiness summary. `scripts/verify/proof.mts` defines each
  field.
- `reports/verify/playwright.log`: the whole output of the run, with the
  build.
- `reports/verify/traces/`: the trace of each failed journey. Open one with
  `pnpm exec playwright show-trace <file>`.

When the build fails or Playwright stops before a journey writes its result,
the run writes a failed `result.json` for the journey, whose error points to
`playwright.log`.

Follow these standards for a proof:

- A proof is a `result.json` with the status `passed`, the commit that you
  claim, and `dirty: false`. Run the journey again after each change.
- Read the screenshots and the ARIA snapshots of the steps that your change
  affects. A passed status proves only what the checks of the journey check.
- Check the result of an action, not only that a control appeared. The
  `generate` journey reads the size of the generated SVG, which only a
  generation of the pasted configuration can give.
- To prove a fix, run the journey before the fix too, and keep both results.
  A journey that cannot fail proves nothing.
- In a pull request, give the command, its exit status, the commit in
  `result.json`, and what the screenshots show.
- Git ignores `reports/`. Do not commit proof.

To read a failure, start with the failed step and the error in `result.json`.
Then read `failed.aria.yml`, which shows what the page showed. The readiness
summary in `result.json` lists the requests that the Ergogen worker received
and finished. A request ID that starts with `ergogen-manual-` came from
Generate or the shortcut, and one that starts with `ergogen-generate-` came
from auto-generate. No request received means that the worker did not start
or the app did not ask. A request that is still running near 100% CPU fits a
machine that is too busy.

## Cleanup

A run stops its server and removes its build when it ends, also after a failed
journey and after Ctrl+C. It stops only the processes that it started. It
keeps `reports/verify/`. Remove the proof only when you no longer need it:

```sh
rm -rf reports/verify
```

When something killed a run with SIGKILL, its server can still run. The
`baseURL` in `result.json` gives its port. Stop only the `vite preview`
process with that `--port`, and remove the folder
`ergogen-gui-verify-<build ID>` from the temporary folder of the system. Never
stop processes by name.

## Helpers

- `scripts/verify/verify.mts` is `pnpm verify`. Its header comment describes
  the options and exit statuses.
- `scripts/verify/playwright.config.mts` builds, serves, and checks the app,
  and runs the journeys. Run it through `pnpm verify`, which keeps the proof of
  a journey that could not run.
- `scripts/verify/proof.mts` defines `result.json`.
- `e2e/journeys/journey.ts` is the `journey` fixture.
- `tests/verify.test.ts` tests `pnpm verify` without a browser.

## Feature map

[features/README.md](features/README.md) lists the features and their
journeys. Read the file of a feature before you drive or change it. When you
add a journey, add its feature file in the same pull request. When a change
alters a user path, change the feature file and the journey in the same pull
request.

These traps apply to every journey:

- The icons of the app come from a font on Google Fonts, which the fixture
  blocks. Screenshots show the name of an icon as a word, such as `download`
  or `settings`. Accessible names do not change.
- Each journey starts with empty storage, so `/` opens the Welcome page.
- Auto-generate is on by default. An edit in the editor generates after about
  one second, without a click.
