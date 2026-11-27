# Downloads and bulk export

The user saves files that the app makes in the page: one output from Outputs,
the configuration in the editor, an archive of the configuration with all its
outputs, and an archive of the stored configurations. The browser saves each
file. No file goes to a server.

## Sub-features

- `download-output` saves one output from Outputs under its name, such as
  `plate.dxf`, `<name>.kicad_pcb`, or `<name>.stl`.
- `download-config` saves the text of the editor as `config.yaml`.
- `download-archive` saves `ergogen-<date>.zip`. It holds `config.yaml`,
  `outputs/demo.svg`, the `.dxf` and the `.svg` of each outline in
  `outputs/outlines/`, each PCB in `outputs/pcbs/`, each case in
  `outputs/cases/`, and the custom footprints, outlines, and templates. With
  `Debug` on, it also holds `outputs/debug/`.
- `bulk-configs` saves `ergogen-config-all-<date>.zip`, with `<name>.yaml` for
  each stored configuration that the user selects, and the custom footprints,
  outlines, and templates.
- `bulk-outputs` generates each selected configuration again and saves
  `ergogen-export-all-<date>.zip`, with one folder for each configuration that
  holds `config.yaml` and `outputs/`, while `Only download configs` is off.
- `download-narrow` moves the download controls to the bar above the panels.
  At widths below 640 px, the bar has `Download configuration` while the
  editor shows, in place of the button under the editor. At a width of
  475 px or less, `Download archive of all generated files` moves from the
  header to the bar, which shows it while Outputs shows.

`<date>` is the date in UTC, as `YYYY-MM-DD`.

## How to get to it (user POV)

- In Outputs, choose the download icon beside a file, labeled
  `Download <file>`.
- Under the editor, choose the download icon beside `Generate`, the button
  `Download configuration`.
- In the header of the editor page, choose the archive icon, the button
  `Download archive of all generated files`.
- Choose the navigation icon at the left of the header, the button
  `Show navigation panel`, and choose `Download All`. The navigation shows
  `Download All` when it stores at least one configuration. In the dialog
  `Download Configurations`, select the configurations, and choose
  `Download (<count>)`.

## Driving it with pnpm verify

Journey: `pnpm verify download` runs `e2e/journeys/download.journey.ts`.

Preconditions:

- A new browser context with empty storage at `/`.
- Clipboard permissions, which the journey grants itself, for the paste.

- **Open the app.** Go to `/`. The heading `Ergogen Web UI` of the Welcome
  page is visible.
- **Choose Empty Configuration.** Choose the button
  `Start with empty configuration`. The textbox `Editor content` appears.
- **Paste the outline plate into the editor.** Paste a configuration with two
  columns, two rows, and the outline `plate` of rectangles 14 mm wide and
  10 mm high. The label `Download plate.dxf` appears within 30 seconds, and
  no error banner shows.
- **Download plate.dxf from Outputs.** Choose the label `Download plate.dxf`.
  The browser saves `plate.dxf`, which has 16 lines whose ends span x from -7
  to 26 and y from -5 to 24, kept as `observed.output`.
- **Download the configuration.** Choose the button `Download configuration`.
  The browser saves `config.yaml`, whose text is the pasted configuration.
- **Download the archive of all outputs.** Choose the button
  `Download archive of all generated files`. The browser saves
  `ergogen-<date>.zip`, which holds `config.yaml`, `outputs/demo.svg`,
  `outputs/outlines/plate.dxf`, and `outputs/outlines/plate.svg`, kept as
  `observed.archive`. Its `config.yaml` is the pasted configuration, and its
  `plate.dxf` has the lines of the step before.
- **Open Download All in the navigation.** Choose `Show navigation panel`,
  then `Download All`. The heading `Download Configurations` shows, and the
  checkbox `Untitled 1` is checked.
- **Download the stored configurations.** Choose the button `Download (1)`.
  The browser saves `ergogen-config-all-<date>.zip`, which holds only
  `Untitled 1.yaml`, whose text is the pasted configuration. The dialog
  closes. The file names are kept as `observed.storedConfigurations`.
- **Proof.** `reports/verify/download/` holds a screenshot and an ARIA snapshot
  after each step, and `result.json` with the names and the content that the
  journey read from each file.

The journey does not drive `bulk-outputs` or `download-narrow`. Do not report
them as verified by this journey.

## Gotchas

- Read a download with the `download` event of Playwright. Start to wait for
  the event before you choose the control. `suggestedFilename()` gives the
  name, and `path()` gives the saved file. The app makes each file in the
  page, so no request for the file reaches the server.
- Check what a file holds, not only its name. A DXF file is a list of pairs of
  lines, a group code and then its value. In the `ENTITIES` section, the codes
  10 and 20 give one end of a `LINE`, and 11 and 21 give the other end.
- `demo.dxf` draws each key as an 18 mm square. An outline of 18 mm squares
  gives the same lines as `demo.dxf`, so a download that wrongly saves
  `demo.dxf` passes the check. The journey uses rectangles of 14 mm by 10 mm.
- Empty Configuration stores a configuration named `Untitled 1`. Each journey
  starts with empty storage, so `Download Configurations` lists only it.
- The switch `Only download configs` has no accessible name. The ARIA
  snapshot shows `checkbox [checked]`, and the text beside the switch is not
  its label. The journey keeps the default, so it does not drive
  `bulk-outputs`.
- The archive icon is disabled while a generation runs and while the app
  makes an STL. Wait for an output of your configuration before you choose
  it.
- The download control of an STL shows the label `Generating <name>.stl` until
  the STL is ready. Wait for the label `Download <name>.stl`.
