# Generate

Generate turns the configuration in the editor into outputs. Ergogen runs in a
web worker of the page, the Outputs panel lists each generated file, and the
preview shows the selected output.

## Sub-features

- `generate-auto` generates after an edit while auto-generate is on, which is
  the default.
- `generate-button` generates when the user chooses Generate.
- `generate-shortcut` generates when the user presses Ctrl+Enter, or Cmd+Enter
  on macOS, in the editor.
- `generate-outputs` lists each output file in Outputs, with a download
  control.
- `generate-preview` shows the output that the user selects in Outputs.
- `generate-error` shows an error banner for a configuration that Ergogen
  rejects.
- `generate-narrow` generates from the `Generate configuration` icon button in
  the bar above the editor, at widths below 640 px.

## How to get to it (user POV)

- On the Welcome page, choose `Empty Configuration` or an example. The app
  opens the editor and generates at once.
- Edit the configuration in the editor, and wait about one second.
- Choose `Generate` under the editor.
- Press Ctrl+Enter in the editor.
- At widths below 640 px, choose the icon button `Generate configuration` in
  the bar above the editor.

## Driving it with pnpm verify

Journey: `pnpm verify generate` runs `e2e/journeys/generate.journey.ts`.

Preconditions:

- A new browser context with empty storage at `/`.
- Clipboard permissions, which the journey grants itself, for the paste.

- **Open the app.** Go to `/`. The heading `Ergogen Web UI` of the Welcome
  page is visible.
- **Choose Empty Configuration.** Choose the button
  `Start with empty configuration`. The textbox `Editor content` and the
  button `Generate configuration` appear.
- **Paste a board of two columns into the editor.** Write a configuration with
  two columns, two rows, and the outline `board` of 18 mm keys to the
  clipboard, focus `Editor content`, and press Ctrl+A and Ctrl+V. The role
  `code` contains `board:`.
- **Choose Generate.** Choose the button `Generate configuration`. The label
  `Download board.dxf` appears within 30 seconds, and no error banner shows.
  `observed.outputs` lists `demo.dxf` and `board.dxf`.
- **Choose board.dxf in Outputs.** Choose the text `board.dxf`. The SVG in the
  img `Ergogen SVG Output preview` is `37mm` wide and `37mm` high, kept as
  `observed.boardOfTwoColumns`.
- **Paste a board of three columns and press Ctrl+Enter.** Paste the same
  configuration with three columns, and press Ctrl+Enter in the editor. The
  preview SVG becomes `56mm` wide and `37mm` high within 30 seconds, kept as
  `observed.boardOfThreeColumns`, and no error banner shows.
- **Proof.** `reports/verify/generate/` holds a screenshot and an ARIA snapshot
  after each step, and `result.json` with the observed values and the
  requests that the Ergogen worker received.

The journey does not drive `generate-error` or `generate-narrow`. Do not report
them as verified by this journey.

## Gotchas

- Auto-generate is on, so the paste generates by itself within about one
  second. The step `Choose Generate` proves that the outputs appear, not that
  the click alone made them. The readiness summary in `result.json` lists each
  request that the worker received, and a request from Generate or the
  shortcut has an ID that starts with `ergogen-manual-`. To prove the button
  alone, turn off `Enable auto-generate` in the settings first.
- Empty Configuration already lists `demo.dxf`. Wait for an output that only
  your configuration makes, such as `board.dxf`, not for any output.
- The download control of an output has a label but no role. Select it with
  `getByLabel('Download board.dxf', { exact: true })`.
- The preview is an img whose `src` is a `data:` URL of the SVG. Ergogen sets
  its `width` and `height` in mm from the bounds of the outline. Keys of 18 mm
  that are 19 mm apart make a board `19 × columns − 1` mm wide.
- When the Ergogen worker cannot start, the app shows `No outputs` and no
  error banner. The journey then fails at `Choose Generate` after 30 seconds,
  and the readiness summary shows that the worker received no request.
