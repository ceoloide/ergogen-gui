# Share links

The user shares the configuration in the editor as a link. The link holds the
configuration, the custom footprints, outlines, and templates that it uses,
and the versions of the app and the engine, compressed after the `#` of the
address. Opening the link loads the configuration and its libraries in any
browser. No server stores the link.

## Sub-features

- `share-link` makes the link in the dialog `Shareable Configuration Link`,
  in the textbox `Share link`, as `<address of the app>#<payload>`.
- `share-copy` copies the link to the clipboard when the dialog shows it. The
  button `Copy link` copies it again and reads `Link copied` for 2.5
  seconds.
- `share-libraries` lists each custom footprint, outline, and template that
  the configuration uses as a checked checkbox named after it, while
  `Include custom libraries` is on, which is the default. The link holds the
  checked ones.
- `share-open` loads the configuration of a link as a preview that the header
  names `Shared Config`, and generates it. The button
  `Save preview configuration` stores it as `Shared Config <n>`.
- `share-open-libraries` adds the libraries of a link to the custom libraries.
  A name that exists opens the dialog `<Type> Conflict`, such as
  `Footprint Conflict`, with the buttons `Skip this <type>`,
  `Overwrite existing <type>`, `Keep both <type>s`, and `Cancel loading`.
- `share-version` asks with the dialog `Version Compatibility Warning` before
  it loads a link made with a newer app, a newer engine, or a custom engine.
- `share-invalid` shows an error banner for a link that the app cannot decode.
- `share-narrow` moves `Share configuration` from the header to the bar above
  the panels, at a width of 475 px or less, while the editor shows.

The [README](../../../../README.md#share-links) describes the payload, which
other tools can build.

## How to get to it (user POV)

- In the header of the editor page, choose the share icon, the button
  `Share configuration`. In the dialog `Share Configuration`, choose `Share`.
- At a width of 475 px or less, choose `Share configuration` in the bar above
  the panels while the editor shows.
- Open a link in the browser, from a person or from a tool that builds the
  payload.

## Driving it with pnpm verify

Journey: `pnpm verify share` runs `e2e/journeys/share.journey.ts`.

Preconditions:

- A new browser context with empty storage at `/`.
- Clipboard permissions, which the journey grants itself, for the paste and
  for the copy of the link.
- A second new browser context with empty storage, which the journey opens
  with `newContextPage` from `e2e/journeys/app.ts`. The journey calls
  `journey.follow` on its page, so the later steps keep the proof of that
  page.

- **Open the app.** Go to `/`. The heading `Ergogen Web UI` of the Welcome
  page is visible.
- **Choose Empty Configuration.** Choose the button
  `Start with empty configuration`. The textbox `Editor content` appears.
- **Add the footprint journey_marker in the settings.** Choose
  `Show settings panel`, then `Add new custom footprint`. Fill the textbox
  `Footprint name` with `journey_marker`, and paste the code of the footprint
  into its editor. The link `download injection journey_marker` shows in
  Custom Libraries. Choose `Hide settings panel`.
- **Paste a PCB that places journey_marker.** Paste a configuration with two
  columns, two rows, and the PCB `board` with `journey_marker` at each key.
  The label `Download board.kicad_pcb` appears within 30 seconds, and no error
  banner shows.
- **Choose Share.** Choose the button `Share configuration`. The heading
  `Share Configuration` shows, and the checkbox `journey_marker` is checked
  within 30 seconds.
- **Choose Share in the dialog.** Choose the button `Share`. The heading
  `Shareable Configuration Link` shows. The textbox `Share link` holds the
  link, and the clipboard holds the same link. Its length is kept as
  `observed.link`.
- **Open the link in a new browser context.** Open the link in the page of
  the second context. The textbox `Editor content` appears within 30
  seconds, and the role `code` contains `what: journey_marker`.
- **Download the configuration of the link.** Choose the button
  `Download configuration`. The browser saves `config.yaml`, whose text is
  the pasted configuration, kept as `observed.configuration`.
- **Download board.kicad_pcb of the link.** The label
  `Download board.kicad_pcb` appears within 30 seconds, and no error banner
  shows. Choose it. The browser saves `board.kicad_pcb`, whose footprints are
  `journey_marker` with the references `JM1` to `JM4`, kept as
  `observed.pcb`. Only the footprint in the link can place them.
- **Proof.** `reports/verify/share/` holds a screenshot and an ARIA snapshot
  after each step, of the first page until the link opens and of the second
  page after, and `result.json` with the observed values.

The journey does not drive `share-open-libraries` with a conflict,
`share-version`, `share-invalid`, `share-narrow`, `Copy link`, or
`Save preview configuration`. Do not report them as verified by this journey.

## Gotchas

- Under the header, the page of a link stays empty while the app loads the
  link, or while a dialog of the link waits for an answer. Once the link
  loads, the page shows the editor, even in a browser that stores no
  configuration. Wait for the textbox `Editor content`. Do not choose the
  logo `Go to home page` to reach the editor.
- The page of a journey blocks each request to another host through
  `e2e/fixtures.ts`. A context from `browser.newContext()` does not, so open
  the second context with `newContextPage`.
- The link holds the versions of the build that made it, so a link that the
  same build opens loads without `Version Compatibility Warning`.
- The dialog generates the configuration in its own worker before it lists
  the libraries. `Share` is disabled while the dialog shows
  `Analyzing configuration...`. A library that the configuration does not use
  is not in the list and not in the link.
- The app reads the link when the page loads, and then removes the part after
  `#` from the address. Read the link from `Share link` or from the
  clipboard, not from the address of a page that opened it.
- Read the configuration of the link with `Download configuration`, which
  saves the whole text. The editor draws only the lines that fit on the
  screen.
