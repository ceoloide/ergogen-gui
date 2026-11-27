# Ergogen Web UI verification map

This folder is the maintained source for verifying what users of Ergogen Web
UI see. Read this index before you drive the app, then use the file of the
feature as the recipe. [SKILL.md](../SKILL.md) explains how to run a journey.

## Baseline preconditions

- `pnpm verify <feature>` builds the app and serves it at a free loopback
  port. The run checks that the server answers with its own build ID.
- Each journey starts in a new Chromium context at 1280 × 720, with empty
  storage, at `/`, which opens the Welcome page at `/new`.
- The shared fixture of `e2e/fixtures.ts` blocks every request to another
  host. A journey that needs GitHub uses `e2e/utils/githubMocks.ts`.
- Never drive an instance that the run did not start.

## Driving conventions

- Prefer roles, accessible names, labels, and text over CSS selectors and
  positions. Read the ARIA snapshots of an earlier run to find a name.
- Put each user action and the check of its result in one `journey.step`.
- Paste text into the editor through the clipboard. Typed text gets the
  automatic indentation of the editor on each new line.
- Wait for an observable state, never for a fixed time. A check that waits for
  a generation gets a timeout of 30 seconds.
- Keep the values that prove the end state with `journey.observe`.

## Proof and skip reporting

- A run keeps a screenshot and an ARIA snapshot after each step, the page when
  the journey failed, and `result.json`, in `reports/verify/<feature>/`.
- Prove the result of an action, such as the content of a generated file, not
  only that a control appeared.
- A feature file names each sub-feature that its journey does not drive yet.
  Do not report such a sub-feature as verified.
- Report a journey that cannot reach a state with the failed step and the
  missing precondition, and write the reason in the Gotchas of the feature.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph that describes
what the user sees. Then it has exactly four H2 sections in this order:

1. `Sub-features` lists short IDs, one line for each behavior.
2. `How to get to it (user POV)` lists every way a user reaches the feature.
3. `Driving it with pnpm verify` names the journey, starts with
   `Preconditions:`, and pairs each step of the journey with what it does and
   the result that it checks.
4. `Gotchas` lists traps that can waste a run or make its proof wrong.

Name only user paths, stable handles, required state, commands, and
observable proof. Keep details of the code out of the map.

## Features

- [Generate](./generate.md): a configuration in the editor generates outputs
  and their preview, after an edit, with Generate, and with the shortcut.
  Journey: `pnpm verify generate`.
- [Preview](./preview.md): the preview shows the output that the user chooses
  in Outputs, as an SVG drawing or, with Debug on, as text, and falls back to
  `demo.svg`. Journey: `pnpm verify preview`.
- [Downloads and bulk export](./download.md): the user saves one output, the
  configuration, an archive of all outputs, and an archive of the stored
  configurations. Journey: `pnpm verify download`.
- [Injections](./injections.md): the user adds custom footprints, outlines,
  and templates in the settings, and a configuration uses them by name.
  Journey: `pnpm verify injections`.
- [Share links](./share.md): the user shares the configuration and the
  libraries that it uses as a link, which opens them in another browser.
  Journey: `pnpm verify share`.
- [Welcome page and examples](./welcome.md): the Welcome page lists the
  examples of the engine with their previews, and one of them opens in the
  editor. Journey: `pnpm verify welcome`.
- [Configuration management](./configurations.md): the user creates, renames,
  switches, and deletes stored configurations, and they stay after a reload.
  Journey: `pnpm verify configurations`.
- [Settings and feature flags](./settings.md): a switch in the settings
  changes what the automatic generation makes and stays after a reload, and a
  flag in the address turns custom outlines off. Journey:
  `pnpm verify settings`.
- [Routing and base path](./routing.md): the address and the stored
  configurations decide whether the Welcome page or the editor shows, below
  the base of the build. Journey: `pnpm verify routing`.
- [Repository loading](./repository.md): the user names a GitHub, Codeberg, or
  Forgejo repository, and its configuration and footprints open in the editor
  and Custom Libraries. Journey: `pnpm verify repository`.
- [Local files and archives](./local-files.md): the user opens a
  configuration file or an archive with footprints from the computer. Journey:
  `pnpm verify local-files`.
