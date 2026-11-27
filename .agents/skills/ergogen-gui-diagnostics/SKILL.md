---
name: ergogen-gui-diagnostics
description: Repair an error that Ergogen Web UI reports with a diagnostic code, such as GENERATION_WORKER_FAILED, from its console output or from an exception event in analytics. Use when a console line or an error_code names a code of src/diagnostics/catalog.ts in ceoloide/ergogen-gui; not for errors of the Ergogen engine or of other projects.
---

# Repair a diagnostic code

The app prints a block for each error that it reports. The last line of the
block names the section of this file for the code. The
[diagnostics page](../../../docs/diagnostics.md) explains the console output,
the analytics parameters, and how to add a code.

## Work through a code

1. Read the `Error` line of the block. It holds the message of the error itself,
   and it is missing when that message is the catalog message.
2. Read the `Location` line. It names the place in the app that reported the
   error. The section of the code names the file.
3. Reproduce the error with the steps in the section of the code.
4. Fix the cause where the error starts, not where the app reports it.
5. Run the checks that `AGENTS.md` asks for, and reproduce the error again to
   see that it is gone.

## `GENERATION_WORKER_FAILED`

`startErgogenWorker` in `src/context/ConfigContext.tsx` reports this code from
the `error` event of the `Worker` that `createErgogenWorker` in
`src/workers/workerFactory.ts` creates. The browser fires that event in two
cases:

- The worker script fails to load. Causes include a network error, an HTTP 404
  for a hashed worker file that a deploy replaced, and a wrong MIME type. The
  `Error` line is then `Worker crash`, because the event has no message.
- A module of the worker throws while it evaluates, before
  `src/workers/ergogen.worker.ts` sets `self.onerror`. The modules are the
  Ergogen engine and `src/utils/injectionEvaluator.ts`. For example, code that
  reads `window` or `document` at the top level throws in a worker.

The worker catches the errors of a generation itself and posts them as messages,
so they never reach this code.

To reproduce the error in Playwright, create the browser context with
`serviceWorkers: 'block'`, so that the service worker cannot answer the request
from its cache. Answer the request for the worker script with a module that
throws. Then load the app and read the console:

```ts
await page.route(/ergogen\.worker/, (route) =>
  route.fulfill({
    contentType: 'text/javascript',
    body: 'throw new Error("forced");',
  })
);
```

Answer with `route.abort()` instead to reproduce a load failure. To find the
cause, read the request for the worker in the network log of the browser, and
check that `pnpm build` writes the worker file to `dist/assets`.

## `STL_WORKER_FAILED`

The JSCAD worker effect in `src/context/ConfigContext.tsx` reports this code
from the `error` event of the `Worker` that `createJscadWorker` in
`src/workers/workerFactory.ts` creates. The causes are the same as for
[`GENERATION_WORKER_FAILED`](#generation_worker_failed). The module that can
throw while it evaluates is `public/dependencies/openjscad.js`, which
`src/workers/jscad.worker.ts` imports.

The worker catches a missing OpenJSCAD convert function and a failed conversion
itself, and posts them as messages. The app logs those messages with
`--- JSCAD worker error:` and reports no code for them.

To reproduce the error, route the request for `jscad.worker` the same way as for
the generation worker, then load a configuration that has a case.

## `STL_PREVIEW_FAILED`

`CanvasErrorBoundary` in `src/atoms/StlPreview.tsx` reports this code for an
error that the 3D preview throws while it renders. The `Canvas error:` line
above the block holds the React component stack. The causes include a browser
without WebGL and a defect in `SceneContent`, `CameraController`, or
`DebugDisplay`. `SceneContent` catches an STL file that it cannot parse and
logs `Error parsing STL:`, so a bad STL file does not reach this code.

To reproduce the error, open the 3D preview of a case in a browser with WebGL
turned off, or throw from `SceneContent` in a local change.

## `UNCLASSIFIED`

The listeners that `setupGlobalErrorTracking` in `src/utils/analytics.ts` adds
report this code for an uncaught error (`unhandled_error`) and for an unhandled
promise rejection (`unhandled_rejection`). They run only while **Send Usage
Metrics** is on. A reporter that passes no code also reports `UNCLASSIFIED`.

When a worker throws while it loads, the browser also fires that error on the
page. A `GENERATION_WORKER_FAILED` or `STL_WORKER_FAILED` block then comes with
an `UNCLASSIFIED` block that has the same `Error` line. Repair the worker code,
not the `UNCLASSIFIED` one.

1. Find where the error starts from the `Error` line and from the stack that the
   browser logs for the uncaught error.
2. Decide the kind. An error that a valid configuration cannot cause is `app`.
   An error that only a wrong configuration causes is `config`.
3. Add a code with the steps in
   [Add a code](../../../docs/diagnostics.md#add-a-code).
4. Throw `new DiagnosticError(code)` where the app raises the error. If the
   error comes from a library, pass the code to `trackError()` where the app
   reports it instead.
