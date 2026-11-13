# Ergogen GUI

Welcome to the Ergogen GUI, a powerful web-based interface for the [Ergogen](https://github.com/mrzealot/ergogen) keyboard generation tool by [@MrZealot](https://github.com/MrZealot). This project, originally created by [@MvEerd](https://github.com/MvEerd) and enhanced by [@ceoloide](https://github.com/ceoloide) and the community, provides a user-friendly environment to design, preview, and export custom ergonomic keyboards.

With this GUI, you can write Ergogen configurations in YAML, see live 2D (SVG) previews of your design, and export the necessary files for manufacturing your own keyboard.

See the live demo at [ergogen.xyz](https://ergogen.xyz).

## Features

- **Live 2D Previews**: Instantly see your changes reflected in 2D (SVG) previews as you type.
- **PCB Preview**: Visualize your generated PCBs directly in the browser using an integrated KiCanvas viewer.
- **Integrated Monaco Editor**: Enjoy a rich, VSCode-like editing experience for your YAML configurations with syntax highlighting.
- **Real-time Output Generation**: Automatically regenerates outlines, 3D models, and PCB files.
- **File Downloads**: Easily download generated files, including DXF for outlines, JSCAD for 3D models, and KiCad files for PCBs.
- **Custom Footprints**: Bundles custom footprints from [ceoloide/ergogen-footprints](https://github.com/ceoloide/ergogen-footprints) and allows for custom user-defined footprints. (Note: Custom template injection is not yet supported).
- **Example Loader**: Load example configurations directly from GitHub URLs or choose from a list of built-in examples to get started quickly.
- **Adjustable Settings**: Fine-tune the generation process with options to toggle auto-generation, debug mode, and experimental preview features.

## Getting Started

To run the Ergogen GUI on your local machine, please follow these steps.

### Prerequisites

- **Node.js**: You must have Node.js v20 or newer installed (e.g., Node.js v24). We recommend using a version manager like [nvm](https://github.com/nvm-sh/nvm) to easily switch between Node versions.
  - `nvm install 24`
  - `nvm use 24`
- **pnpm**: This project uses pnpm for package management.
  - `npm install -g pnpm`

### Installation and Setup

1. **Clone the repository:**

   ```shell
   git clone https://github.com/ceoloide/ergogen-gui.git
   cd ergogen-gui
   ```

2. **Install dependencies:**

   ```shell
    pnpm install
   ```

   This command prepares a checkout-owned Ergogen copy with the pinned footprint libraries; it does not patch the shared pnpm store.

3. **Start the development server:**

   ```shell
    pnpm run dev
   ```

   This will start a development server and open the application in your default browser at `http://localhost:3000`.

### Validation for Contributors and Agents

Use Node **24.22.3** (`.node-version`) and pnpm **11.12.0** (`packageManager`).
Install locked dependencies with `PNPM_CONFIG_BLOCK_EXOTIC_SUBDEPS=false pnpm install --frozen-lockfile`.

Workflow validation requires native [actionlint 1.7.12](https://github.com/rhysd/actionlint/releases/tag/v1.7.12),
[ShellCheck 0.11.0](https://github.com/koalaman/shellcheck/releases/tag/v0.11.0) and
[zizmor 1.32.0](https://github.com/zizmorcore/zizmor/releases/tag/v1.32.0) on `PATH`.
On Linux x86_64, the shared installer downloads official releases, verifies pinned
SHA-256 checksums and writes only to this checkout's ignored `.tools/bin`:

```shell
pnpm tools:install
export PATH="$PWD/.tools/bin:$PATH"
pnpm validate:fast
pnpm validate
```

On other platforms, install the matching native releases yourself. No Docker or
Python is required. CI uses the same installer and commands.

- `pnpm validate:fast`: check formatting, Markdown, ESLint, Knip, workflow syntax/security,
  shell scripts, application/test/tooling types and the complete Vitest suite.
  The suite includes maintained analytics scripts and repository workflow policy.
- `pnpm validate`: all fast checks plus the production build.
- `pnpm validate:extended`: fast checks plus a fresh production build and the complete Playwright suite.
- `pnpm fix`: explicitly apply formatting and supported lint fixes. Acceptance
  commands do not fix source files.
- `pnpm test:e2e`: build a fresh production site and run Playwright against its own
  strict loopback port. A build-identity check rejects stale or foreign servers.
  Install browsers first with `pnpm exec playwright install chromium`.
- `pnpm precommit`: the same non-mutating fast checks. Husky/lint-staged provide
  quick staged-file fixes/checks; GitHub independently enforces validation.

Vitest writes `reports/unit.xml`. Playwright writes `reports/browser.xml`, an HTML
report, and traces/screenshots on failure even with zero retries. These outputs
are ignored by Git and should accompany failure reports along with the tested
commit and exact command. Browser runs own their server lifecycle and do not
reuse your development server. The editor and its workers are bundled locally;
acceptance blocks external requests except explicit provider fixtures. One legacy
URL-import regression remains disabled and is tracked in [#227](https://github.com/ceoloide/ergogen-gui/issues/227).

## How to Use

The Ergogen GUI is divided into three main sections: the configuration editor on the left, the file preview in the middle, and the downloads/outputs list on the right.

- **Configuration Editor**: Write or paste your Ergogen YAML configuration here. The previews will update automatically as you type (if auto-generation is enabled).
- **File Preview**: This panel shows a preview of the selected output file. You can switch between different outputs, like outlines (SVG) or PCBs (via KiCanvas), by clicking the "Preview" button next to the file name in the "Outputs" list.
- **Outputs**: This section lists all the files generated from your configuration. You can download any file by clicking the download icon next to it.
- **Settings**: Click the gear icon in the header to open the settings panel. Here, you can manage custom footprints and adjust generation options.

## Creating Share Links (For External Developers)

If you're building a tool that generates Ergogen configurations, you can create share links that open the Ergogen GUI with your configuration preloaded. This allows your users to instantly preview and edit the generated config.

### Share Link Format

Share links use URL hash fragments: `https://ergogen.xyz/#<encoded-data>`

The encoded data is a JSON object compressed using [lz-string](https://github.com/pieroxy/lz-string):

```typescript
interface ShareableConfig {
  config: string; // The YAML or JSON configuration (required)
  injections?: string[][]; // Optional custom injections (footprints, templates, outlines): [type, name, code][]
  guiVersion?: string; // Optional GUI version compatibility check
  ergogenVersion?: string; // Optional Ergogen version compatibility check
}
```

### Basic Example (JavaScript)

```javascript
import { compressToEncodedURIComponent } from 'lz-string';

function createErgogenShareLink(yamlConfig) {
  const shareableConfig = {
    config: yamlConfig,
  };

  const encoded = compressToEncodedURIComponent(
    JSON.stringify(shareableConfig)
  );
  return `https://ergogen.xyz/#${encoded}`;
}

// Usage
const config = `
points:
  zones:
    matrix:
      columns:
        pinky:
        ring:
        middle:
        index:
      rows:
        bottom:
        home:
        top:
`;

const shareLink = createErgogenShareLink(config);
console.log(shareLink);
```

### Including Custom Injections (Footprints, Templates, Outlines)

If your configuration uses custom footprints, templates, or outlines, include them in the `injections` array. Each injection is a tuple of `[type, name, code]`, where type can be `'footprint'`, `'template'`, or `'outline'`:

```javascript
import { compressToEncodedURIComponent } from 'lz-string';

function createErgogenShareLink(yamlConfig, injections = []) {
  const shareableConfig = {
    config: yamlConfig,
  };

  // Add custom injections if provided
  if (injections.length > 0) {
    shareableConfig.injections = injections.map((inj) => [
      inj.type, // 'footprint', 'template', or 'outline'
      inj.name, // e.g., 'my_custom_switch'
      inj.code, // JavaScript footprint code, template code, or outline SVG
    ]);
  }

  const encoded = compressToEncodedURIComponent(
    JSON.stringify(shareableConfig)
  );
  return `https://ergogen.xyz/#${encoded}`;
}

// Usage with custom footprint injection
const config = `
points:
  zones:
    matrix:
      columns:
        pinky:
      rows:
        home:
pcbs:
  main:
    footprints:
      switch:
        what: my_custom_footprint
        where: true
`;

const footprints = [
  {
    type: 'footprint',
    name: 'my_custom_footprint',
    code: `
module.exports = {
  params: {
    designator: '',
  },
  body: p => \`\`
}
  `,
  },
];

const shareLink = createErgogenShareLink(config, footprints);
```

### Notes

- The configuration can be either YAML or [KLE (Keyboard Layout Editor)](http://www.keyboard-layout-editor.com/) JSON format
- Share links work with any Ergogen GUI deployment (not just `ergogen.xyz`)
- Very large configurations may create long URLs; consider URL length limits (~2000-8000 chars depending on browser)
- When users open a share link, the configuration is loaded and Ergogen immediately processes it

## Deployment to GitHub Pages

This repository includes a GitHub Actions workflow to automatically build and deploy the application to GitHub Pages whenever changes are pushed to the `main` branch.

### Dynamic Deployment URL

The deployment workflow is designed to be flexible for forks and custom domains. It uses a repository variable to set the correct `PUBLIC_URL` during the build process. This ensures that all asset paths are generated correctly for the environment where the application will be hosted.

To configure the deployment URL for your repository:

1. Go to your repository on GitHub.
1. Navigate to **Settings** > **Secrets and variables** > **Actions**.
1. Select the **Variables** tab and click **New repository variable**.
1. For the **Name**, enter `PUBLIC_URL`.
1. For the **Value**, enter the relative path where the application will be hosted. For example:
   - For a custom domain: `https://ergogen.xyz` enter `/`
   - For a standard GitHub Pages site: `https://<username>.github.io/<repository-name>` enter `/<repository-name>`
1. Click **New repository variable** again.
1. For the **Name**, enter `REACT_APP_GTAG_ID`.
1. For the **Value**, enter your Google Tag ID to capture Google Analytics for the site.

If the `PUBLIC_URL` variable is not set, the workflow will automatically use `/` as the default value.

### Troubleshooting GitHub Pages

If you are having issues deploying after forking this repository, try renaming the `deploy.yaml` workflow configuration to any other name. This should prompt GitHub to load the new configuration and get unstuck.

## Project Structure

The codebase is organized into the following main directories:

- `index.html`: The main entry point file.
- `public/`: Contains static assets, including the Ergogen and KiCanvas libraries.
- `src/`: Contains the main React application source code.
  - `atoms/`: Individual, reusable UI components (e.g., `Button`, `Input`).
  - `molecules/`: More complex components composed of atoms (e.g., `ConfigEditor`, `FilePreview`).
  - `organisms/`: Large UI sections composed of molecules and atoms (e.g., `Tabs`).
  - `context/`: React context providers, primarily for managing the global configuration state (`ConfigContext`).
  - `examples/`: Contains built-in example configurations.
  - `utils/`: Utility functions, such as for fetching data from GitHub.
- `patch/`: Contains scripts and patches for customizing the `ergogen` dependency.

## Using a Custom Ergogen Version or Branch

Canonical CI and deployment use the `package.json` dependency and committed frozen
lockfile. To change production Ergogen, update and review both files in a PR;
a repository variable cannot silently replace the validated engine.

For a compatibility experiment, use an isolated checkout. pnpm 11 reads the
manifest before its root preinstall hook, so explicitly patch it first:

```shell
export ERGOGEN_VERSION=github:ceoloide/ergogen#v4.3.0
node scripts/preinstall.js
PNPM_CONFIG_BLOCK_EXOTIC_SUBDEPS=false pnpm install --no-frozen-lockfile
pnpm dev
```

The helper also accepts `ergogen@<version>`. Postinstall restores the original
manifest; the experiment's lockfile and generated previews must not be committed.
Keep `ERGOGEN_VERSION` set during the experiment: preparation rejects a mismatch
between the requested and installed specifier. Restore canonical inputs and do a
frozen install before reporting canonical acceptance.

### Engine and Footprint Inputs

`pnpm build-ergogen` copies the installed engine to `node_modules/.ergogen-engine`
and adds the two footprint libraries at full commit SHAs recorded in
`patch/patch_ergogen.sh`. Vite and Vitest alias `ergogen` and its subpaths to this
copy. The installed package and global Git configuration remain untouched.
A successful input stamp makes repeated preparation a no-op. Bump a footprint
pin through a reviewed change and run full validation, including browser tests.
For experiments, `CEOLOIDE_FOOTPRINTS_COMMIT` and `INFUSED_KIM_FOOTPRINTS_COMMIT`
accept full SHAs; matching `*_FOOTPRINTS_URL` variables allow a mirror.

Example preview SVGs are version-controlled. Regenerate them explicitly with
`pnpm generate-previews` and review changes; ordinary builds do not rewrite them.
