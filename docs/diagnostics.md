# Diagnostics

When the app reports an error, it gives the error a code from
`src/diagnostics/catalog.ts`. The code says what failed and whether the app or a
configuration is at fault. This page lists each code and how to add one.
Agents repair an error with the
[diagnostics skill](../.agents/skills/ergogen-gui-diagnostics/SKILL.md).

## Console output

`trackError()` in `src/utils/analytics.ts` prints one block to the console for
each error that it reports, whether or not **Send Usage Metrics** is on:

```text
GENERATION_WORKER_FAILED: The generation worker failed to load or threw an uncaught error.
Error: Worker crash
Location: ergogen_worker
Fix: Reload the page. If the error comes back, report it with this console output.
Docs: https://github.com/ceoloide/ergogen-gui/blob/main/docs/diagnostics.md#generation_worker_failed
Agents: .agents/skills/ergogen-gui-diagnostics/SKILL.md#generation_worker_failed
```

1. The code and the message of its catalog entry.
2. The message of the error itself. The block leaves this line out when it
   repeats the catalog message.
3. The location, which names the place in the app that reported the error.
4. The fix from the catalog entry.
5. The section of this page for the code.
6. The section of the diagnostics skill for the code. The anchor is the code in
   lowercase, which is the anchor that GitHub gives the code's heading.

## Analytics parameters

With **Send Usage Metrics** on, `trackError()` sends an `exception` event with
three parameters in addition to `description`, `fatal`, and `error_stack`, which
keep the values that earlier versions sent:

| Parameter        | Value                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `error_code`     | A code of the catalog, or `UNCLASSIFIED`.                                                      |
| `error_kind`     | `app` for a defect of the app, or `config` for an error in a configuration.                    |
| `error_location` | A name from `DiagnosticLocation` in `src/diagnostics/diagnostic.ts`, such as `ergogen_worker`. |

The types allow only these fixed values, so none of the three parameters can
hold configuration text, a share link, a URL, or a file path. Each value is
shorter than the 100 characters that GA4 keeps. `scripts/ga/ga-config.mjs`
registers the three parameters on the GA4 property.

## How an error gets its code

`trackError(error, fatal, location, fallbackCode)` picks the first of these:

1. The `code` of a `DiagnosticError`, which app code throws with a code of the
   catalog. Its message is the catalog message.
2. `fallbackCode`, which the place that reports the error passes when it knows
   what failed.
3. `UNCLASSIFIED`.

A code that the catalog lacks fails `pnpm typecheck`, and so does a code typed
as a plain `string`.

A worker cannot send a `DiagnosticError` to the main thread. The structured
clone of `postMessage` keeps the message and drops the class and its `code`.
The two worker errors that `trackError()` reports today arrive as an `error`
event on the `Worker` object, and the handler of that `Worker` passes the code.
A worker that posts an error message must send the code as a separate field of
that message.

## Add a code

1. Add an entry to `diagnosticCatalog` in `src/diagnostics/catalog.ts`, with the
   code in capital letters and underscores, its `kind`, a `message` without user
   data, and a `fix`.
2. Add a section for the code to this page, under [Codes](#codes).
3. Add a section for the code to the
   [diagnostics skill](../.agents/skills/ergogen-gui-diagnostics/SKILL.md).
4. Throw `new DiagnosticError(code)` where the app raises the error, or pass the
   code to `trackError()` where the app reports it.
5. Run `pnpm exec vitest run tests/diagnostics-docs.test.ts`. It fails when a
   code has no section in either file, or when a section names a code that the
   catalog lacks.

## Codes

### `GENERATION_WORKER_FAILED`

Kind `app`. Location `ergogen_worker`.

The browser could not load the generation worker, or the worker threw while it
loaded its modules. Generation stops, and the app shows the error. An `Error`
line of `Worker crash` means that the browser gave no message, which is usual
when the worker file fails to load.

Reload the page. If the error comes back, report it with the console output.

### `STL_WORKER_FAILED`

Kind `app`. Location `jscad_worker`.

The browser could not load the STL conversion worker, or the worker threw while
it loaded OpenJSCAD. The app cannot convert cases to STL.

Reload the page. If the error comes back, turn off **STL Preview** in the
settings and report the error with the console output.

### `STL_PREVIEW_FAILED`

Kind `app`. Location `canvas_renderer`.

The 3D preview of a case threw while it rendered. A browser without WebGL can
cause this error. The preview shows the error message instead of the model.

Check that the browser has WebGL turned on. If the error comes back, turn off
**STL Preview** in the settings and report the error with the console output.

### `UNCLASSIFIED`

Kind `app`. Location `unhandled_error`, `unhandled_rejection`, or the place that
reported an error without a code.

The app caught an error that no code describes. The app counts an error that it
cannot classify as its own defect. The global listeners for uncaught errors and
unhandled promise rejections report this code, and they run only while **Send
Usage Metrics** is on.

Report the error with the console output, so that a maintainer can give it a
code.
