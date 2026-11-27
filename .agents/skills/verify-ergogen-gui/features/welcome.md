# Welcome page and examples

The Welcome page at `/new` is where a user starts a design. It offers an empty
configuration, a local file, a repository, the configurations that the user
worked on last, and a grid of example keyboards, each with a preview image.
Choosing an example stores it as a new configuration, opens it in the editor,
and generates it.

## Sub-features

- `welcome-start` shows the heading `Ergogen Web UI` and the sections
  `Start Fresh`, `From Local File`, and `From Repo`.
- `welcome-examples` lists each example that the engine of the build can
  generate, under `Or start from an example`. An example asks for an engine
  version in `meta.engine`, and the page leaves out an example that the engine
  does not meet.
- `welcome-previews` shows a preview image of each example, from
  `images/previews/` below the base path.
- `welcome-load-example` stores the chosen example as `Untitled <n>`, opens it
  at `/`, and generates it.
- `welcome-empty` stores an empty configuration with `Empty Configuration`.
- `welcome-recent` lists the four configurations that the user changed last,
  under `Pick up where you left`, and opens the one that the user chooses.
- `welcome-drop` loads a file that the user drops on the page. See the feature
  of local files.

## How to get to it (user POV)

- Open the app with no stored configuration. `/` opens `/new`.
- Choose `Start new configuration` in the header of the editor page.
- Choose `New` in the navigation.
- Delete the configuration in the editor. The app opens `/new`.

## Driving it with pnpm verify

Journey: `pnpm verify welcome` runs `e2e/journeys/welcome.journey.ts`.

Preconditions:

- A new browser context with empty storage at `/`.

- **Open the app.** Go to `/`. The heading `Ergogen Web UI` is visible.
- **Read the examples.** The labels `Load <name> example` name the 13
  examples of the build in the order of the page, kept as
  `observed.examples`. Each img `<name> preview` decoded a real image from
  `images/previews/`.
- **Choose the Briefs 56 example.** Choose the label
  `Load Briefs 56 example`. The address becomes `/`, and the label
  `Download center.dxf` appears within 30 seconds. Of the examples, only
  Briefs 56 has the outline `center`. No error banner shows.
- **Download the configuration.** Choose the button `Download configuration`.
  The browser saves `config.yaml`, whose text is the text of the Briefs 56
  example in `src/examples/briefs56.ts`, kept as `observed.configuration`.
- **Proof.** `reports/verify/welcome/` holds a screenshot and an ARIA snapshot
  after each step, and `result.json` with the observed values.

The [routing journey](./routing.md) drives `welcome-recent` and
[Generate](./generate.md) drives `welcome-empty`. This journey does not drive
`welcome-drop`, `From Local File`, or `From Repo`. Do not report them as
verified by this journey.

`pnpm test:e2e` covers part of the feature too. `e2e/routing.spec.ts` loads an
example and the empty configuration, and `e2e/base-path.spec.ts` checks the
previews at the root and below the subpath `/ergogen-gui/`.

## Gotchas

- The list of examples follows the engine of the build. A build with an older
  engine, from an engine experiment, offers fewer examples, and the step
  `Read the examples` then fails.
- When an example is added or removed, change the list in the journey and the
  count in this file in the same pull request.
- An example card has a label but no role. Select it with
  `getByLabel('Load <name> example', { exact: true })`.
- A preview file that is missing returns `index.html` with the status 200, so
  a preview that failed still sends a response. Only an image with a natural
  width above 0 proves that the file arrived. `expectDecodedImages` of
  `e2e/utils/baseAssets.ts` checks that.
- The app names a loaded example `Untitled <n>`, not the name in its
  `meta.name`.
