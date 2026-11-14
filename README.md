# Ergogen GUI

A web interface for [Ergogen](https://github.com/ergogen/ergogen), the YAML-based
ergonomic keyboard generator by [@MrZealot](https://github.com/MrZealot). The GUI
was created by [@MvEerd](https://github.com/MvEerd) and is maintained by
[@ceoloide](https://github.com/ceoloide) and contributors. The public instance is
[ergogen.xyz](https://ergogen.xyz).

## Features

- **Live generation**: edit YAML in the bundled Monaco editor and preview outlines (SVG),
  PCBs ([KiCanvas](https://kicanvas.org)) and optional 3D cases; download DXF, SVG,
  JSCAD, STL and KiCad files or a ZIP archive.
- **Runs in your browser**: Ergogen and the 3D conversion run in Web Workers. There is
  no backend, account or token.
- **Footprint libraries**: bundles [ceoloide/ergogen-footprints](https://github.com/ceoloide/ergogen-footprints)
  and [infused-kim/kb_ergogen_fp](https://github.com/infused-kim/kb_ergogen_fp). Custom
  footprints, templates and outlines can be added in settings or loaded with a config.
- **Loading**: built-in examples; local YAML, JSON, KLE JSON, ZIP or `.ekb` files;
  public GitHub, Codeberg, Forgejo and Gitea repositories; and share links.
- **Several configurations** saved in browser storage, and an installable PWA.

Use `infused-kim/diode` for the bundled infused-kim diode footprint. Replace the
historical typo `infused-kimo/isde` in existing configurations; it is not supported.

## Privacy and network use

Configurations stay in browser storage unless you share or export them. The app
makes these network requests:

- Its own static files, and Google Fonts (cached by the service worker when one is
  active). Fonts do not depend on analytics consent.
- Repository imports, started by you, are unauthenticated requests to the chosen
  GitHub, Codeberg, Forgejo or Gitea host.
- Google Analytics only when the build includes a tag ID (see
  [Configuration](#configuration)). Without one, no analytics script loads and the
  "Send Usage Metrics" switch is off and disabled; a saved choice is kept. With an ID,
  metrics default to on in a browser tab and off in the installed app; a saved
  choice wins (an explicit one over a legacy opt-out), unreadable storage counts
  as an opt-out, and development builds and loopback hosts never send. Hits are not queued offline. DEVELOPMENT.md lists
  [what is collected](DEVELOPMENT.md#analytics-and-privacy).

Editor, KiCanvas and worker code are served locally. After a visit with a service
worker (HTTPS or localhost production build), the app can start offline, but
repository imports, fonts and analytics still need the network.

## Run locally

Requirements: Git, a POSIX `sh`, network access to the npm registry and GitHub
during install, [Node.js 24.22.3](.node-version) and pnpm 11.12.0 (the
`packageManager` in [package.json](package.json); `corepack enable` provides it).
Docker and Python are not needed.

```shell
git clone https://github.com/ceoloide/ergogen-gui.git
cd ergogen-gui
PNPM_CONFIG_BLOCK_EXOTIC_SUBDEPS=false pnpm install --frozen-lockfile
```

The environment prefix is required: without it pnpm blocks the engine's Git
subdependencies, and pnpm 11 ignores this setting in `.npmrc`. Install also
prepares a checkout-owned copy of Ergogen with the pinned footprint libraries,
which fetches them with Git.

| Command                  | Result                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| `pnpm dev`               | Development server at `http://localhost:3000` (no service worker).                         |
| `pnpm build`             | Production build in `dist/`.                                                               |
| `pnpm exec vite preview` | Serves `dist/` locally, by default at `http://localhost:4173`. No `preview` script exists. |

## Self-hosting

`dist/` is a static site. Publish the whole folder to any HTTPS static host. No
backend, Google account or Git provider token is needed.

- **Base path:** serve at a domain root, or below a path such as a GitHub project
  page. For a path, build with its leading and trailing slash, for example
  `VITE_PUBLIC_URL=/ergogen-gui/ pnpm build`; the app then lives at
  `/ergogen-gui/`. To try it locally, run
  `VITE_PUBLIC_URL=/ergogen-gui/ pnpm exec vite preview` and open
  `http://localhost:4173/ergogen-gui/`.
- **SPA fallback:** an initial request for a client route such as `/new` (or
  `/ergogen-gui/new`) must return `index.html` (the GitHub workflow copies it to
  `404.html`).
- **Service worker:** registers only in production builds, from the same origin,
  over HTTPS or on localhost, and controls only the base path. It precaches about
  21 MB (about 16 MB is the editor) in the background on first visit and caches
  example previews and the logo when they are first shown, so later visits work
  offline. When a new build is deployed, the app shows an **Update Available**
  button; clicking it reloads into the new build.

### GitHub Pages from a fork

1. Enable Actions on the fork (**Actions** tab).
2. Under **Settings > Pages**, deploy from the `gh-pages` branch, `/ (root)`. The
   branch appears after the first successful run.
3. Choose the address with repository variables (**Settings > Secrets and
   variables > Actions > Variables**). A project page at
   `https://<user>.github.io/<repo>/` needs `PUBLIC_URL=/<repo>/`. For a domain
   root, use a custom domain (`CNAME_DOMAIN`, plus the matching DNS and Pages
   domain settings) or a `<user>.github.io` repository, and leave `PUBLIC_URL`
   unset. Add a GA tag ID only if you want analytics.
4. Push to `main` or run **Build and deploy on GitHub Pages** manually. The deploy
   job requests `contents: write`; if an organization policy blocks it, or any step
   fails, the run log shows where.

## Configuration

Vite reads these settings at build time from the shell or `.env*` files and bakes
them into `dist/`. Changing variables on the server does not reconfigure an
existing build. Only Vite reads `.env*` files, but a shell `ERGOGEN_VERSION` is also
read by `scripts/preinstall.js` and engine preparation (`postinstall`, `predev`,
`prestart`, `prebuild`, `pretest:unit`), which fails unless it matches the
installed specifier, so it can break a canonical frozen install. Use
`VITE_ERGOGEN_VERSION` to change only the displayed identity.

| Variable (first non-empty wins)                                        | Default                                                                                 | Effect                                                                                                                                                             |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `VITE_PUBLIC_URL`, `PUBLIC_URL`                                        | `/`                                                                                     | Base path, with a leading and trailing slash, such as `/ergogen-gui/` (see [Self-hosting](#self-hosting)).                                                         |
| `VITE_GTAG_ID`                                                         | empty                                                                                   | GA4 tag ID. Empty disables analytics entirely and greys out **Send Usage Metrics**.                                                                                |
| `VITE_FORCE_ANALYTICS`                                                 | unset                                                                                   | Literal `true` lifts the development/localhost block for diagnostics. It does not supply an ID or bypass consent.                                                  |
| `VITE_FEATURE_TEMPLATES`, `REACT_APP_FEATURE_TEMPLATES`                | unset                                                                                   | Literal `true`/`false` forces custom templates on or off. Unset: on when the engine version is 4.3.0 or later.                                                     |
| `VITE_FEATURE_OUTLINES`, `REACT_APP_FEATURE_OUTLINES`                  | unset                                                                                   | Same, for custom outlines.                                                                                                                                         |
| `VITE_ERGOGEN_VERSION`, `ERGOGEN_VERSION`, `REACT_APP_ERGOGEN_VERSION` | The `package.json` specifier if it names a repository: `github:ceoloide/ergogen#v4.3.0` | Engine identity shown in the UI and written to share links. It does not install an engine. For a non-semver ref, feature checks use the installed package version. |

GitHub Actions passes repository variables `PUBLIC_URL` as `VITE_PUBLIC_URL` and
`VITE_GTAG_ID` unchanged. `CNAME_DOMAIN` writes `dist/CNAME` on `main`.

URL parameters change a running page: `?ff_templates=true|false` and
`?ff_outlines=true|false` override the feature settings above;
`?github=`, `?codeberg=`, `?forgejo=` or `?gitea=` load a repository; `?debug` logs
decoded share links and shows 3D preview diagnostics.

Installing a different engine is a contributor experiment; see
[DEVELOPMENT.md](DEVELOPMENT.md#engine-and-footprints).

## Share links

Tools that generate Ergogen configs can open them in any deployment with a link
`<deployment>/#<payload>`. The payload is `lz-string`'s
`compressToEncodedURIComponent(JSON.stringify(data))`, where `data` is:

```typescript
interface ShareableConfig {
  config: string; // YAML, JSON or KLE JSON (required)
  injections?: [
    type: 'footprint' | 'template' | 'outline',
    name: string,
    code: string,
  ][];
  guiVersion?: string; // e.g. '0.19.2'
  ergogenVersion?: string; // e.g. 'github:ceoloide/ergogen#v4.3.0'
}
```

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

The app asks before loading a link made with a newer GUI or engine, or with a
custom engine, and asks how to resolve name conflicts with existing injections.
Missing versions are treated as GUI `0.9.0` and Ergogen `4.2.1`. Keep links short:
browsers and chat apps truncate long URLs.

## Contributing

Issues and pull requests are welcome. [DEVELOPMENT.md](DEVELOPMENT.md) covers
architecture, validation and engine preparation; [AGENTS.md](AGENTS.md) lists the
rules for every change. User-facing changes are summarized in
[CHANGELOG.md](CHANGELOG.md).

Validation also needs native [actionlint 1.7.12](https://github.com/rhysd/actionlint/releases/tag/v1.7.12),
[ShellCheck 0.11.0](https://github.com/koalaman/shellcheck/releases/tag/v0.11.0) and
[zizmor 1.32.0](https://github.com/zizmorcore/zizmor/releases/tag/v1.32.0). They are
not needed to install, run or build. On Linux x86_64:

```shell
pnpm tools:install                  # checksum-verified, into ./.tools/bin
export PATH="$PWD/.tools/bin:$PATH"
pnpm validate:fast                  # format, lint, types, workflows, all unit tests
```

On other platforms, install the same releases on `PATH`.

## Credits and license

Ergogen is by [@MrZealot](https://github.com/MrZealot); this GUI was started by
[@MvEerd](https://github.com/MvEerd). Bundled footprints come from
[@ceoloide](https://github.com/ceoloide/ergogen-footprints) and
[@infused-kim](https://github.com/infused-kim/kb_ergogen_fp). PCB previews use
[KiCanvas](https://kicanvas.org) and share links use
[lz-string](https://github.com/pieroxy/lz-string).

This repository's code is released under the [MIT license](LICENSE). Ergogen, the
footprint libraries and other dependencies keep their own licenses.
