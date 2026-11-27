# Local files and archives

The user opens a configuration file or an archive from the computer on the
Welcome page. A YAML or JSON file becomes the configuration. An archive gives
the configuration and the footprints, outlines, and templates that it holds,
which the app adds to Custom Libraries. The app opens the editor and
generates.

## Sub-features

- `local-text` loads a `.yaml`, `.yml`, or `.json` file as the configuration.
- `local-archive` loads a `.zip` or `.ekb` archive. Its `config.yaml` or
  `config.yml` at the root is the configuration. Each `.js` file below
  `footprints/` is a footprint, named by its path in that folder without
  `.js`. While the feature flags are on, `.js` files below `outlines/` and
  `templates/` are outlines and templates.
- `local-drop` loads the first file of an accepted type that the user drops on
  the Welcome page.
- `local-conflict` asks the user to skip, overwrite, or keep both when an
  injection of the archive has the name of a stored one.
- `local-error` shows an error banner that starts with
  `Failed to load local file:` for an archive without `config.yaml`, a
  damaged archive, a text file over 10 MB, or an archive over 50 MB. A drop
  of no accepted file shows
  `Invalid file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb`.

## How to get to it (user POV)

- On the Welcome page, choose `Choose File` under `From Local File`, whose
  name is `Select local file to load`, and pick a file in the dialog of the
  browser.
- Drag a file onto the Welcome page and drop it.
- From the editor, choose `Start new configuration` to reach the Welcome page.

## Driving it with pnpm verify

Journey: `pnpm verify local-files` runs
`e2e/journeys/local-files.journey.ts`.

Preconditions:

- A new browser context with empty storage at `/`, so Custom Libraries is
  empty and no conflict dialog shows.
- Two files that the journey makes and never writes to disk:
  `local-plate.yaml`, a configuration whose only outline is `local_plate`, and
  `marker-board.zip`, whose `config.yaml` places the footprint
  `journey_marker` at each of four keys of the PCB `board`, and whose
  `footprints/journey_marker.js` has the designator `JM`.

- **Open the app.** Go to `/`. The heading `Ergogen Web UI` is visible.
- **Choose File and pick local-plate.yaml.** Choose the button
  `Select local file to load`, and pick the file in the file dialog. The label
  `Download local_plate.dxf` appears within 30 seconds, and no error banner
  shows.
- **Download the configuration.** Choose the button `Download configuration`.
  The saved `config.yaml` is the text of `local-plate.yaml`, byte for byte.
- **Choose Start new configuration.** The heading `Ergogen Web UI` is visible
  again.
- **Choose File and pick marker-board.zip.** The label
  `Download board.kicad_pcb` appears within 30 seconds, and no error banner
  shows. `observed.archive` lists the files of the archive.
- **Download board.kicad_pcb from Outputs.** The saved PCB holds the footprint
  `journey_marker` with the references `JM1` to `JM4`, which only the
  footprint of the archive can give. `observed.pcb` keeps them.
- **Proof.** `reports/verify/local-files/` holds a screenshot and an ARIA
  snapshot after each step, and `result.json` with the observed values.

The journey does not drive a `.yml`, `.json`, or `.ekb` file, outlines and
templates of `local-archive`, `local-drop`, `local-conflict`, or
`local-error`. Do not report them as verified by this journey.

No browser test of `pnpm test:e2e` opens a local file.
`src/utils/localFiles.test.ts` checks the reading of each file type and the
folders of an archive without a browser, and
`src/utils/ergogenBundleLoader.test.ts` checks the size limits and where an
archive must hold `config.yaml`.

## Gotchas

- The file input is hidden. Choose the button `Select local file to load`, and
  start the wait for the `filechooser` event before the click. The hidden
  input has the same label, so select the button by its role.
- The app names a configuration from a file `Untitled <n>`, not after the
  file.
- `Download configuration` always saves `config.yaml`, whatever the name of
  the file that the user opened.
- `Choose File` is only on the Welcome page. To open a second file from the
  editor, choose `Start new configuration` first.
