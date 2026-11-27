# Preview

The preview fills the space between the editor and Outputs. It shows the
output that the user chooses in Outputs, and `demo.svg` until the user chooses
one. An outline shows as an SVG drawing that the user can pan and zoom. With
the settings for debug files and previews, other outputs show as text, as a
PCB, or as a 3D model.

## Sub-features

- `preview-demo` shows `demo.svg`, the keys of the configuration, before the
  user chooses an output.
- `preview-select` shows the output whose name the user chooses in Outputs.
  The name of the shown output is underlined.
- `preview-svg` shows `demo.dxf` and each outline `<name>.dxf` as its SVG, with
  pan and zoom.
- `preview-fallback` shows `demo.svg` again when a generation no longer makes
  the chosen output.
- `preview-text` shows `raw.txt`, `canonical.yaml`, `points.yaml`, and
  `units.yaml` as read-only text, while `Debug` is on.
- `preview-jscad` shows a case `<name>.jscad` as read-only text. Outputs lists
  it while `STL Preview` is off or `Debug` is on.
- `preview-stl` shows a case `<name>.stl` as a 3D model while `STL Preview` is
  on, which is the default.
- `preview-pcb` shows a PCB `<name>.kicad_pcb` in KiCanvas while
  `KiCad Preview` is on, which is the default, for a PCB in the format of
  KiCad 8 or later.

## How to get to it (user POV)

- Generate a configuration. The preview shows `demo.svg`.
- Choose the name of an output in Outputs, such as `board.dxf`.
- Choose `Show settings panel`, then turn on `Debug` to list the debug files
  in Outputs. Turn `KiCad Preview` and `STL Preview` on or off under
  `Previews (Experimental)`.
- At widths below 640 px, choose the button `Show outputs panel`, which shows
  `Outputs`, in the bar above the editor. The bar then has the button
  `Show downloads panel` or `Hide downloads panel`, which shows or hides
  Outputs beside the preview.

## Driving it with pnpm verify

Journey: `pnpm verify preview` runs `e2e/journeys/preview.journey.ts`.

Preconditions:

- A new browser context with empty storage at `/`.
- Clipboard permissions, which the journey grants itself, for the paste.

- **Open the app.** Go to `/`. The heading `Ergogen Web UI` of the Welcome
  page is visible.
- **Choose Empty Configuration.** Choose the button
  `Start with empty configuration`. The textbox `Editor content` appears.
- **Paste the outlines board and plate.** Paste a configuration with two
  columns, two rows, the outline `board` of rectangles 18 mm wide and 10 mm
  high, and the outline `plate` of 14 mm squares. The label
  `Download plate.dxf` appears within 30 seconds, and no error banner shows.
  The SVG in the img `Ergogen SVG Output preview` is `37mm` wide and `37mm`
  high, the size of `demo.svg`, kept as `observed.demo`.
- **Choose board.dxf in Outputs.** Choose the text `board.dxf`. The SVG is
  `37mm` wide and `29mm` high, kept as `observed.board`.
- **Choose plate.dxf in Outputs.** Choose the text `plate.dxf`. The SVG is
  `33mm` wide and `33mm` high, kept as `observed.plate`.
- **Paste the configuration without plate.** Paste the same configuration
  without the outline `plate`. The label `Download plate.dxf` disappears
  within 30 seconds, and the SVG is `37mm` by `37mm` again, the size of
  `demo.svg`, kept as `observed.withoutPlate`.
- **Turn on Debug in the settings.** Choose `Show settings panel`, choose the
  text `Debug`, and choose `Hide settings panel`. The checkbox
  `Enable debug mode` is checked, and the label `Download points.yaml`
  appears. `observed.outputs` lists the outputs.
- **Choose points.yaml in Outputs.** Choose the text `points.yaml`. The role
  `code` in the label `YAML preview for points-<n>` contains
  `matrix_left_bottom:`, the first point, which Ergogen names after the zone,
  the column, and the row of the configuration. The name is kept as
  `observed.pointsPreview`.
- **Proof.** `reports/verify/preview/` holds a screenshot and an ARIA snapshot
  after each step, and `result.json` with the observed sizes and outputs.

The journey does not drive `preview-jscad`, `preview-stl`, `preview-pcb`, or
pan and zoom. Do not report them as verified by this journey.

## Gotchas

- An outline row of Outputs names the file that it downloads, such as
  `board.dxf`, but the preview shows its SVG. The img `src` is a `data:` URL
  of the SVG, whose `width` and `height` Ergogen sets in mm from the bounds of
  the outline.
- `demo.svg` draws each key as an 18 mm square. An outline of 18 mm squares
  has the size of `demo.svg`, so give each outline of a journey another size.
  Otherwise a preview that wrongly shows `demo.svg` passes the check.
- The preview inverts the colors of the SVG, so the lines are white on the
  dark page.
- The switch of a setting hides its checkbox, so `check()` on the checkbox
  waits until it times out. Choose the name of the option, such as the text
  `Debug`, and then check that the checkbox is checked.
- The settings panel takes the place of the editor and the preview. Choose
  `Hide settings panel` before you choose an output.
- A text preview is a read-only editor with the role `code`, as the
  configuration editor is. Find it inside the label of the preview, such as
  `YAML preview for points-<n>` or `Text preview for raw-<n>`. The number
  `<n>` changes with each generation, so match only the start of the label.
- A text preview draws only the lines that fit on the screen, about 30 at
  1280 × 720. Check text near the top of the file.
- KiCanvas and the 3D model draw on a canvas. The ARIA snapshot does not show
  what they draw, so read the screenshot.
- The name of a PCB is dimmed while `KiCad Preview` is off or when the PCB
  has a format older than KiCad 8. The name of an STL is dimmed while the app
  still makes it. Choosing a dimmed name does not change the preview.
