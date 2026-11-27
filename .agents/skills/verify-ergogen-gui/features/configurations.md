# Configuration management

The browser stores each configuration that the user starts, with its name and
its text. The header names the configuration in the editor, and the
navigation lists every stored configuration. The user creates, renames,
duplicates, switches, and deletes configurations there, and they stay after a
reload.

## Sub-features

- `config-create` stores a new configuration as `Untitled <n>`, with the next
  free number, when the user chooses `Empty Configuration` or an example on the
  Welcome page.
- `config-autosave` stores each edit of the configuration in the editor.
- `config-rename-nav` renames a configuration with
  `Rename configuration <name>` in the navigation, the textbox `Rename input`,
  and `Save name`.
- `config-rename-header` renames the configuration in the editor with
  `Rename configuration` in the header, or a click on its name, the textbox
  `Edit configuration name`, and Enter or `Confirm rename`.
- `config-rename-rules` keeps the old name when the user saves an empty name,
  and rejects a name that another configuration has with an error banner.
- `config-switch` opens a configuration that the user chooses in the
  navigation, with its outputs.
- `config-duplicate` stores a copy as `<name> (Copy)` and opens it.
- `config-delete` deletes a configuration after the question
  `Are you sure you want to delete "<name>"?`. Deleting the configuration in
  the editor, or the last one, opens `/new`.
- `config-search` filters the navigation by the words in
  `Search configurations`.
- `config-persist` keeps the configurations, their names, and the one in the
  editor after a reload.

## How to get to it (user POV)

- Choose `Show navigation panel` in the header. The navigation lists the
  configurations under `Saved Configurations`, with the number of them.
- In the header, choose the name of the configuration, or hover it and choose
  `Rename configuration`, `Duplicate configuration`, or
  `Delete configuration`.
- On the Welcome page, choose `Empty Configuration` or an example, or a
  configuration under `Pick up where you left`.

## Driving it with pnpm verify

Journey: `pnpm verify configurations` runs
`e2e/journeys/configurations.journey.ts`.

Preconditions:

- A new browser context with empty storage at `/`.
- Clipboard permissions, which the journey grants itself, for the paste.

- **Open the app.** Go to `/`. The heading `Ergogen Web UI` is visible.
- **Choose Empty Configuration.** Choose the button
  `Start with empty configuration`. The header names `Untitled 1`.
- **Paste the outline first.** Paste a configuration with the outline
  `first`. The label `Download first.dxf` appears within 30 seconds, and no
  error banner shows.
- **Create a second configuration.** Choose `Start new configuration`, then
  `Start with empty configuration`. The header names `Untitled 2`.
- **Paste the outline second.** Paste the same configuration with the outline
  `second`. The label `Download second.dxf` appears within 30 seconds.
- **Rename Untitled 1 in the navigation.** Choose `Show navigation panel`,
  then `Rename configuration Untitled 1`. Fill the textbox `Rename input` with
  `Journey first`, and choose `Save name`. The navigation lists
  `Journey first` and no `Untitled 1`. Choose `Close navigation panel`.
- **Reload the page.** The header names `Untitled 2`, and the label
  `Download second.dxf` appears within 30 seconds. The navigation lists
  `Journey first` and `Untitled 2`, and no `Untitled 1`.
- **Switch to Journey first in the navigation.** Choose `Journey first`. The
  header names `Journey first`, the label `Download first.dxf` appears, and
  `Download second.dxf` is gone. `Download configuration` saves the text with
  the outline `first`.
- **Delete Untitled 2 in the navigation.** Choose
  `Delete configuration Untitled 2`, and accept the question, kept as
  `observed.deleteQuestion`. The navigation lists `Journey first` only.
- **Reload the page again.** The header names `Journey first`, the label
  `Download first.dxf` appears, and `Download configuration` saves the text
  with the outline `first`. The navigation has one configuration, kept as
  `observed.saved`.
- **Proof.** `reports/verify/configurations/` holds a screenshot and an ARIA
  snapshot after each step, and `result.json` with the observed values.

The journey does not drive `config-rename-header`, `config-rename-rules`,
`config-duplicate`, `config-search`, or the delete of the configuration in the
editor. Do not report them as verified by this journey.

No browser spec of `pnpm test:e2e` renames, switches, or deletes a
configuration. The unit tests `src/molecules/SideNavigation.test.tsx`,
`src/organisms/Header.test.tsx`, and `src/context/ConfigContext.test.tsx` cover
the controls and the storage without a browser.

## Gotchas

- The journey reloads right after the rename. Any other change stores the
  whole list, so a reload after it would keep the new name even when the
  rename alone did not store it.
- The navigation is a panel over the page. Close it before a click on the
  editor or on Outputs, or the panel takes the click.
- The navigation stays in the ARIA snapshot while it is closed. Open it before
  a click on one of its controls.
- The button of a configuration in the navigation has the accessible name
  `description <name>`, after its icon. Select it by its tooltip with
  `getByTitle('<name>', { exact: true })`.
- The header shows the name of the configuration in the editor as text. Select
  it inside the role `banner`. At 1280 × 720 the screenshots can hide it behind
  the names of the icons, which a journey shows as words.
- Playwright dismisses a question of the browser unless the journey answers
  it. Register `page.once('dialog', ...)` before the click on a Delete
  control.
- At widths of 1024 px and more, the controls of a configuration have an
  opacity of 0 until the pointer is over them, in the header and in the rows
  of the navigation that the editor does not hold. Playwright counts them as
  visible, and its click moves the pointer over them first.
