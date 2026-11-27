# Routing and base path

The app has two pages. `/new` is the Welcome page, and `/` is the editor of
the configuration that the user works on. The address that the user opens and
the stored configurations decide which page shows. A self-hoster can serve the
app at the root of a domain or below a base path, such as `/ergogen-gui/`,
and each page, image, and worker then loads below that base.

## Sub-features

- `route-new-user` sends `/` to `/new` while no configuration is in the editor.
- `route-editor` shows the editor at `/` while a configuration is in the
  editor, also after a reload.
- `route-unknown` sends any other address to `/`, which then follows
  `route-new-user` or `route-editor`.
- `route-new` opens `/new` with `Start new configuration` in the header, which
  shows only at `/`, or with `New` in the navigation.
- `route-open` opens `/` when the user chooses `Empty Configuration`, an
  example, or a configuration under `Pick up where you left` on `/new`.
- `route-query` keeps the query of `/` when it sends the user to `/new`, so
  `/?github=<repository>` still loads the repository.
- `base-path` serves the pages, the images, the editor, and the workers below
  the base that `VITE_PUBLIC_URL` sets at build time. The host answers a deep
  link below the base with `index.html`, as the
  [README](../../../../README.md#self-hosting) asks, and `vite preview` does.

## How to get to it (user POV)

- Open the address of the app, a deep link such as `<base>new`, or an address
  that the app does not have.
- Choose `Start new configuration`, `New` in the navigation, or the logo
  `Go to home page`.
- Choose a configuration or an example on the Welcome page.

## Driving it with pnpm verify

Journey: `pnpm verify routing` runs `e2e/journeys/routing.journey.ts`.

Preconditions:

- A new browser context with empty storage at `/`.
- The build that `pnpm verify` serves at the root, so the base is `/`.

- **Open the app.** Go to the base. The address becomes `<base>new`, and the
  heading `Ergogen Web UI` is visible. The img `Ergogen logo` in the role
  `banner` decoded a real image from `<base>ergogen.png`.
  `observed.firstVisit` is the path.
- **Open an address that the app does not have.** Go to
  `<base>journey/unknown`. The address becomes `<base>new`, and the Welcome
  page shows.
- **Choose Empty Configuration.** Choose the button
  `Start with empty configuration`. The address becomes the base, and the
  textbox `Editor content` appears.
- **Open the unknown address again.** Go to `<base>journey/unknown`. The
  address becomes the base, and the textbox `Editor content` appears within 30
  seconds. `observed.unknownWithConfiguration` is the path.
- **Choose Start new configuration.** Choose the button
  `Start new configuration`. The address becomes `<base>new`, the Welcome page
  shows, and the button `Start new configuration` is gone.
- **Choose Untitled 1 in Pick up where you left.** Choose the label
  `Load Untitled 1 configuration`. The address becomes the base, the textbox
  `Editor content` appears, and the header names `Untitled 1`.
- **Proof.** `reports/verify/routing/` holds a screenshot and an ARIA snapshot
  after each step, and `result.json` with the observed paths.

The journey does not drive `route-query`, the logo `Go to home page`, `New` in
the navigation, or a base other than `/`. Do not report them as verified by
this journey.

`pnpm test:e2e` covers part of the feature too. `e2e/routing.spec.ts` checks
`route-new-user`, `route-editor` with a configuration stored before the page
loads, and `Start new configuration`. `e2e/base-path.spec.ts` runs in the
projects `chromium` and `chromium-subpath`, so it checks a deep link, the base,
the logo, and the example previews at the root and below `/ergogen-gui/`.

## Gotchas

- `pnpm verify` builds the app for the root, so this journey proves the base
  `/` only. To prove a change to the base path, run `pnpm test:e2e`, or
  `pnpm exec playwright test --project chromium-subpath`. The development
  guide describes the projects.
- Navigate with paths relative to the base, such as `page.goto('new')`, and
  compare the address with `appBase(baseURL)` of `e2e/utils/baseAssets.ts`.
  The same journey then reads right below another base.
- The server answers a missing file below the base with `index.html` and the
  status 200. A page or an image can look loaded while it failed. Check that an
  image decoded, with `expectDecodedImages`, and check the address and a
  heading or textbox of the page.
- `Start new configuration` clears which configuration is in the editor and
  keeps the stored ones. After it, `/` sends the user to `/new` too, until the
  user opens a configuration again.
- The app reads a share link from the part after `#` and then removes it from
  the address. See [Share links](./share.md).
