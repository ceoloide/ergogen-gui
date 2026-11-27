# Injections

An injection is a custom footprint, outline, or template in JavaScript that
the user adds to Ergogen. Settings list them under Custom Libraries, in the
tabs Footprints, Outlines, and Templates, beside an editor for the name and
the code. Each generation passes every injection to Ergogen, so a
configuration can use it by its name, as a built-in one.

## Sub-features

- `injection-add` adds an injection with `Add new custom footprint`,
  `Add new custom outline`, or `Add new custom template`. The app names it
  `custom_<type>_<n>` and fills its code with a skeleton.
- `injection-edit` shows an injection in the editor when the user chooses its
  name in Custom Libraries. The textbox `<Type> name`, such as
  `Footprint name`, holds the name, and the code editor beside it holds the
  code. The app keeps each change at once.
- `injection-files` loads `.js` files with `Load custom <type> files`, or each
  `.js` file of a folder with `Load custom <type> folder`, named after its
  path in the folder. An outline also loads from an `.svg` file.
- `injection-delete` removes an injection with `delete injection <name>`.
- `injection-download` saves the code as `<name>.js` with
  `download injection <name>`.
- `injection-generate` makes the outputs with the injections: a footprint by
  its name in `what` of a PCB footprint, a template by its name in `template`
  of a PCB, and an outline by its name in `what` of an outline.
- `injection-conflict` asks with the dialog `<Type> Conflict`, such as
  `Footprint Conflict`, when a loaded injection has the name of one that the
  user has.
- `injection-flags` shows Outlines and Templates when the engine is 4.3.0 or
  later, or when `?ff_outlines=true` or `?ff_templates=true` forces them.
  While a flag is off, the app skips those injections and shows a warning
  banner.
- `injection-narrow` shows the editor of an injection over the whole width, at
  widths below 640 px, with the button `Close editor`. Each row of Custom
  Libraries then has the link `edit injection <name>`.

## How to get to it (user POV)

- Choose `Show settings panel` in the header of the editor page. Custom
  Libraries follows the options of the settings.
- Open a share link that holds injections. See [Share links](./share.md).
- On the Welcome page, load a ZIP or `.ekb` file, or a repository, that holds
  footprints, outlines, or templates.

## Driving it with pnpm verify

Journey: `pnpm verify injections` runs `e2e/journeys/injections.journey.ts`.

Preconditions:

- A new browser context with empty storage at `/`, so Custom Libraries is
  empty.
- Clipboard permissions, which the journey grants itself, for the paste.

- **Open the app.** Go to `/`. The heading `Ergogen Web UI` of the Welcome
  page is visible.
- **Choose Empty Configuration.** Choose the button
  `Start with empty configuration`. The textbox `Editor content` appears.
- **Paste a PCB that places journey_marker before it exists.** Paste a
  configuration with two columns, two rows, and the PCB `board` with the
  footprint `journey_marker` at each key. An error banner shows within 30
  seconds and names `pcbs.board.footprints.marker.what`, because Ergogen has
  no such footprint. The label `Download board.kicad_pcb` is not on the page.
- **Add the footprint journey_marker in the settings.** Choose
  `Show settings panel`, then `Add new custom footprint`. Fill the textbox
  `Footprint name` with `journey_marker`, and paste the code of the footprint
  into its editor. The code draws a module named `journey_marker` with the
  designator `JM`. The link `download injection journey_marker` shows in
  Custom Libraries.
- **Close the settings.** Choose `Hide settings panel`. The label
  `Download board.kicad_pcb` appears within 30 seconds, and no error banner
  shows.
- **Download board.kicad_pcb from Outputs.** Choose the label
  `Download board.kicad_pcb`. The browser saves `board.kicad_pcb`, whose
  footprints are `journey_marker` with the references `JM1` to `JM4`, kept as
  `observed.pcb`.
- **Proof.** `reports/verify/injections/` holds a screenshot and an ARIA
  snapshot after each step, and `result.json` with the footprints that the
  journey read from the PCB.

The journey does not drive `injection-edit` of an existing injection,
`injection-files`, `injection-delete`, `injection-download`,
`injection-conflict`, `injection-flags`, `injection-narrow`, outlines, or
templates. Do not report them as verified by this journey.

## Gotchas

- Give a test injection a name that Ergogen does not have. Otherwise the
  output can come from the built-in one, and the check proves nothing.
- The app does not generate while the settings show. Choosing
  `Hide settings panel` generates with the injections of that moment.
- The code editor of an injection is also a textbox `Editor content`. The
  editor of the configuration is not on the page while the settings show, so
  `pasteIntoEditor` reaches the code editor. The code editor is read-only
  until the user adds or chooses an injection.
- The app ignores a change that leaves the name or the code empty.
- Custom Libraries belong to the browser, not to one configuration. Each
  stored configuration generates with them.
- The PCB of the default template is in the format of KiCad 5, so each
  footprint starts with `(module <name>`. KiCad Preview shows only a PCB of
  KiCad 8 or later, so the name of this PCB is dimmed in Outputs. Its
  download works.
