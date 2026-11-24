# Ergogen GUI

Ergogen GUI is a web interface for [Ergogen](https://github.com/ergogen/ergogen),
the YAML-based ergonomic keyboard generator by
[@MrZealot](https://github.com/MrZealot). [@MvEerd](https://github.com/MvEerd)
created this interface, and [@ceoloide](https://github.com/ceoloide) and
contributors maintain it. The public site is [ergogen.xyz](https://ergogen.xyz).

## Features

Use Ergogen GUI in your browser to edit, preview, and export Ergogen keyboards:

- **Live generation.** Edit YAML in the bundled Monaco editor and preview SVG
  outlines, PCBs in [KiCanvas](https://kicanvas.org), and optional 3D cases.
  Download DXF, SVG, JSCAD, STL, and KiCad files, or export a ZIP archive.
- **Browser-only execution.** Ergogen and 3D conversion run in Web Workers in
  your browser. The app needs no backend, account, or token.
- **Bundled footprint libraries.** The app bundles
  [ceoloide/ergogen-footprints](https://github.com/ceoloide/ergogen-footprints)
  and [infused-kim/kb_ergogen_fp](https://github.com/infused-kim/kb_ergogen_fp).
  You can add custom footprints, templates, and outlines in settings or load
  them with a configuration.
- **Multiple input sources.** Load built-in examples, share links, and public
  GitHub, Codeberg, Forgejo, or Gitea repositories. You can also load local
  YAML, JSON, KLE JSON, ZIP, and `.ekb` files. A site built with an older
  Ergogen engine hides examples that need a newer engine.
- **Local storage and offline startup.** Save multiple configurations in browser
  storage and install the site as a Progressive Web App (PWA).

Use `infused-kim/diode` for the bundled `infused-kim` diode footprint. Replace
the historical typo `infused-kimo/isde` in existing configurations. The app does
not support it.

### Bundled examples

**Briefs 56**, under **Miscellaneous**, is a 56-key unibody example inspired by
Dygma Sonsei. It uses Ergogen's default `u` spread and padding of 19 mm for
Choc v2 and MX switches, column stagger, and a relative thumb fan. The outer two
thumbs align with the matrix. The inner pair approximates the reference's custom
keycaps. The example includes separate key, body, central shape, and combined
preview outlines. The body is about 296 × 139 mm. The key outlines use 18 mm
caps with 1.5 mm corner radii. Check physical keycap clearance before
fabrication.

**Willy 50**, also under **Miscellaneous**, is inspired by the Keychron Orca
Echo. It models only the pictured half, with 25 keyboard keys and a scroll-wheel
point beside the angled thumb, using default `u` spacing and column stagger. The
wheel point, `wheel_scroll_key`, inherits the thumb's rotation and has width
`0.75u` and height `u`, or 14.25 × 19 mm. Its dimensions approximate the
pictured wheel, and you can adjust them for your component. Use
`wheel_scroll_key` to place a scroll-wheel footprint. The app bundles no
scroll-wheel hardware footprint.

## Privacy and network use

Configurations stay in browser storage unless you share or export them. The app
makes three kinds of network requests:

- **Static files and Google Fonts.** The browser fetches the app's static files
  and Google Fonts. An active service worker caches both, and loading fonts does
  not depend on analytics consent.
- **Repository imports.** When you import a repository, the app sends
  unauthenticated requests to the GitHub, Codeberg, Forgejo, or Gitea host that
  you choose.
- **Google Analytics.** The app loads analytics only when the build includes a
  tag ID, as described in [Configuration](#configuration). Without a tag ID, the
  app loads no analytics script, turns off and disables **Send Usage Metrics**,
  and preserves any saved choice. With a tag ID, metrics default to on in a
  browser tab and off in an installed PWA. A saved choice overrides the default,
  and an explicit choice overrides a legacy opt-out. Unreadable storage counts
  as an opt-out. Development builds and loopback hosts never send hits, and the
  app does not queue hits offline. See
  [Analytics and privacy in DEVELOPMENT.md](DEVELOPMENT.md#analytics-and-privacy)
  for the data that the app collects.

The app serves the editor, KiCanvas, and worker code locally. After one visit to
an HTTPS or localhost production build with an active service worker, the app
can start offline. Repository imports, uncached fonts, and analytics still
require network access.

## Run locally

To run the app locally, you need Git, a POSIX `sh`,
[Node.js 24.22.3](.node-version), and the pnpm version in the `packageManager`
field of [package.json](package.json). Run `corepack enable` to provide that
pnpm version. You also need network access to the npm registry and GitHub during
installation. You do not need Docker or Python.

Clone the repository and install dependencies:

```shell
git clone https://github.com/ceoloide/ergogen-gui.git
cd ergogen-gui
pnpm install --frozen-lockfile
```

Installation also uses Git to fetch the pinned footprint libraries and prepare a
checkout-owned copy of Ergogen.

Run these commands from the repository root:

| Command                  | Result                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| `pnpm dev`               | Starts the development server at `http://localhost:3000` without a service worker.          |
| `pnpm build`             | Builds the production site in `dist/`.                                                      |
| `pnpm exec vite preview` | Serves `dist/` locally at `http://localhost:4173` by default. There is no `preview` script. |

## Self-hosting

`dist/` is a static site. Publish the whole folder to any HTTPS static host. You
do not need a backend, a Google account, or a Git provider token.

Check these hosting requirements before you deploy:

- **Base path.** Serve the app at a domain root or under a subpath such as a
  GitHub project page. For a subpath, include both the leading and trailing
  slashes in `VITE_PUBLIC_URL`. For example, run
  `VITE_PUBLIC_URL=/ergogen-gui/ pnpm build` to build the app for
  `/ergogen-gui/`. To test that build locally, run
  `VITE_PUBLIC_URL=/ergogen-gui/ pnpm exec vite preview` and open
  `http://localhost:4173/ergogen-gui/`.
- **SPA fallback.** Configure your host so an initial request for a client route
  such as `/new` or `/ergogen-gui/new` returns `index.html`. The GitHub deploy
  workflow copies `index.html` to `404.html` for GitHub Pages.
- **Service worker.** The service worker registers only in production builds
  served from the same origin over HTTPS or on localhost, and it controls only
  the base path. On first visit, it precaches about 21 MB in the background,
  including about 16 MB for the editor. It also caches example previews and the
  logo when they first appear so later visits work offline. After you deploy a
  new build, the app shows an **Update Available** button that reloads the page
  into the new build.

### GitHub Pages from a fork

Follow these steps to deploy your fork to GitHub Pages:

1. Open the **Actions** tab on your fork and enable GitHub Actions.
2. Open **Settings > Pages** and set the source to the `gh-pages` branch and
   `/ (root)`. The `gh-pages` branch appears after the first successful run.
3. Open **Settings > Secrets and variables > Actions > Variables** and set the
   repository variables for your site address. For a project page at
   `https://<user>.github.io/<repo>/`, set `PUBLIC_URL=/<repo>/`. To serve at a
   domain root, leave `PUBLIC_URL` unset and use either a `<user>.github.io`
   repository or a custom domain with `CNAME_DOMAIN` plus matching DNS and Pages
   domain settings. Set `VITE_GTAG_ID` only if you want Google Analytics.
4. Push to `main`, or run the **Build and deploy on GitHub Pages** workflow
   manually.

The `deploy` job requests `contents: write`. If an organization policy blocks
that permission or any step fails, check the workflow run log. Each release
creates a commit on `gh-pages`, and the site serves its build ID at
`build-id.txt`. To serve an earlier release again, see
[Releases and rollback](DEVELOPMENT.md#releases-and-rollback).

## Configuration

Vite reads build-time settings from your shell environment or `.env*` files and
embeds them in `dist/`. Changing environment variables on a web server does not
reconfigure an existing build. Only Vite reads `.env*` files. However, `scripts/preinstall.js` and engine
preparation during `postinstall`, `predev`, `prestart`, `prebuild`,
`pretest:unit`, and `pretest:contract` also read `ERGOGEN_VERSION` from the
shell. Engine preparation fails unless `ERGOGEN_VERSION` matches the installed specifier, so setting `ERGOGEN_VERSION`
in your shell can break a canonical frozen install. To change only the displayed
engine identity, set `VITE_ERGOGEN_VERSION` instead.

| Variable (first non-empty value applies)                               | Default                                                                                 | Effect                                                                                                                                                                       |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_PUBLIC_URL`, `PUBLIC_URL`                                        | `/`                                                                                     | Base path with leading and trailing slashes, such as `/ergogen-gui/`. See [Self-hosting](#self-hosting).                                                                     |
| `VITE_GTAG_ID`                                                         | empty                                                                                   | GA4 tag ID. Leaving it empty disables analytics and disables **Send Usage Metrics**.                                                                                         |
| `VITE_FORCE_ANALYTICS`                                                 | unset                                                                                   | Literal `true` lifts the development and localhost block for diagnostics. It does not supply a tag ID or bypass consent.                                                     |
| `VITE_FEATURE_TEMPLATES`, `REACT_APP_FEATURE_TEMPLATES`                | unset                                                                                   | Literal `true` or `false` forces custom templates on or off. When unset, custom templates are on when the engine version is 4.3.0 or later.                                  |
| `VITE_FEATURE_OUTLINES`, `REACT_APP_FEATURE_OUTLINES`                  | unset                                                                                   | Literal `true` or `false` forces custom outlines on or off. When unset, custom outlines are on when the engine version is 4.3.0 or later.                                    |
| `VITE_ERGOGEN_VERSION`, `ERGOGEN_VERSION`, `REACT_APP_ERGOGEN_VERSION` | The `package.json` specifier if it names a repository: `github:ceoloide/ergogen#v4.3.0` | Engine identity shown in the UI and written to share links. It does not install an engine or change feature checks because feature checks use the installed package version. |

GitHub Actions passes repository variable `PUBLIC_URL` as `VITE_PUBLIC_URL` and
passes `VITE_GTAG_ID` unchanged. On `main`, `CNAME_DOMAIN` writes `dist/CNAME`.
Setting the repository variable `ERGOGEN_VERSION`, such as
`github:ceoloide/ergogen#v4.3.0`, tells the deploy workflow to install, build,
and display that engine pinned to the branch or tag's current commit. Leave
`ERGOGEN_VERSION` unset to deploy the canonical engine. With a non-canonical
engine, deployment validation skips the canonical engine output tests and runs
the GUI and engine smoke tests. See
[Deployment engine](DEVELOPMENT.md#deployment-engine) for accepted values.

You can also override settings on a running page with URL query parameters:

- `?ff_templates=true|false` and `?ff_outlines=true|false` override the custom
  templates and custom outlines feature settings.
- `?github=`, `?codeberg=`, `?forgejo=`, and `?gitea=` load a public repository
  from that host.
- `?debug` logs decoded share links and shows 3D preview diagnostics.

To install a different engine locally for development, follow
[Engine experiments in DEVELOPMENT.md](DEVELOPMENT.md#engine-experiments).

## Share links

Tools that generate Ergogen configurations can open them in any deployment using
a `<deployment>/#<payload>` URL. Build `<payload>` by calling
`compressToEncodedURIComponent(JSON.stringify(data))` from `lz-string`, where
`data` matches this TypeScript interface:

```typescript
interface ShareableConfig {
  config: string; // YAML, JSON, or KLE JSON (required)
  injections?: [
    type: 'footprint' | 'template' | 'outline',
    name: string,
    code: string,
  ][];
  guiVersion?: string; // For example, '0.19.3'
  ergogenVersion?: string; // For example, 'github:ceoloide/ergogen#v4.3.0'
}
```

This JavaScript example builds a share link for a minimal configuration:

```javascript
import { compressToEncodedURIComponent } from 'lz-string';

const config = `points:
  zones:
    matrix:
      columns:
        index:
      rows:
        home:
`;
const data = { config }; // add injections or versions as needed
const link = `https://ergogen.xyz/#${compressToEncodedURIComponent(JSON.stringify(data))}`;
```

Before the app loads a link made with a newer GUI, a newer engine, or a custom
engine, it asks for confirmation. If an injection name conflicts with an
existing injection, the app asks how to resolve the conflict. The app treats
missing versions as GUI `0.9.0` and Ergogen `4.2.1`. Keep links short because
browsers and chat apps truncate long URLs.

## Contributing

Issues and pull requests are welcome. [DEVELOPMENT.md](DEVELOPMENT.md) covers
architecture, validation, and engine preparation. [AGENTS.md](AGENTS.md) lists
the rules for every change. [CHANGELOG.md](CHANGELOG.md) summarizes user-facing
changes. While the `main` ruleset is active, merges require an up-to-date pull
request whose required `lint-and-test` check GitHub accepts. See
[Branch rules](DEVELOPMENT.md#branch-rules) for the merge rules and
[their limits](docs/records/branch-rules.md#limits).

Validation also requires native
[actionlint 1.7.12](https://github.com/rhysd/actionlint/releases/tag/v1.7.12),
[ShellCheck 0.11.0](https://github.com/koalaman/shellcheck/releases/tag/v0.11.0),
and [zizmor 1.32.0](https://github.com/zizmorcore/zizmor/releases/tag/v1.32.0).
You do not need these tools to install, run, or build the app. On Linux x86_64,
install them and run the fast validation suite:

```shell
pnpm tools:install                  # checksum-verified, into ./.tools/bin
export PATH="$PWD/.tools/bin:$PATH"
pnpm validate:fast                  # format, lint, types, workflows, all unit tests
```

On other platforms, install the same releases on your `PATH`.

## Credits and license

[@MrZealot](https://github.com/MrZealot) created Ergogen, and
[@MvEerd](https://github.com/MvEerd) started this GUI. Bundled footprints come
from [@ceoloide](https://github.com/ceoloide/ergogen-footprints) and
[@infused-kim](https://github.com/infused-kim/kb_ergogen_fp). PCB previews use
[KiCanvas](https://kicanvas.org), and share links use
[lz-string](https://github.com/pieroxy/lz-string).

This repository's code uses the [MIT license](LICENSE). Ergogen, the footprint
libraries, and other dependencies keep their own licenses.
