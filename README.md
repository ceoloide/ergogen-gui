# Ergogen GUI

Welcome to the Ergogen GUI, a powerful web-based interface for the [Ergogen](https://github.com/mrzealot/ergogen) keyboard generation tool by [@MrZealot](https://github.com/MrZealot). This project, originally created by [@MvEerd](https://github.com/MvEerd) and enhanced by [@ceoloide](https://github.com/ceoloide) and the community, provides a user-friendly environment to design, preview, and export custom ergonomic keyboards.

With this GUI, you can write Ergogen configurations in YAML, see live 2D (SVG) previews of your design, and export the necessary files for manufacturing your own keyboard.

See the live demo at [ergogen.xyz](https://ergogen.xyz).

> [!WARNING]
> This repository currently relies on Node.js v20. It will not build with newer versions like Node v22 due to outdated dependencies. Please ensure you are using a compatible Node version for development.

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

- **Node.js**: You must have Node.js v20 installed. We recommend using a version manager like [nvm](https://github.com/nvm-sh/nvm) to easily switch between Node versions.
  - `nvm install 20`
  - `nvm use 20`
- **Yarn**: This project uses Yarn for package management.
  - `npm install -g yarn`

### Installation and Setup

1. **Clone the repository:**

   ```shell
   git clone https://github.com/ceoloide/ergogen-gui.git
   cd ergogen-gui
   ```

2. **Install dependencies:**

   ```shell
   yarn install
   ```

   This command will also build a local copy of Ergogen from the patched source in the `patch/` directory.

3. **Start the development server:**

   ```shell
   yarn start
   ```

   This will start a development server and open the application in your default browser at `http://localhost:3000`.

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
  injections?: string[][]; // Optional custom footprints: [type, name, code][]
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

### Including Custom Footprints

If your configuration uses custom footprints, include them in the `injections` array. Each injection is a tuple of `[type, name, code]`:

```javascript
import { compressToEncodedURIComponent } from 'lz-string';

function createErgogenShareLink(yamlConfig, footprints = []) {
  const shareableConfig = {
    config: yamlConfig,
  };

  // Add footprints if provided
  if (footprints.length > 0) {
    shareableConfig.injections = footprints.map((fp) => [
      'footprint', // type
      fp.name, // e.g., 'my_custom_switch'
      fp.code, // JavaScript footprint code
    ]);
  }

  const encoded = compressToEncodedURIComponent(
    JSON.stringify(shareableConfig)
  );
  return `https://ergogen.xyz/#${encoded}`;
}

// Usage with custom footprint
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

- `public/`: Contains the main `index.html` file and static assets, including the Ergogen and KiCanvas libraries.
- `src/`: Contains the main React application source code.
  - `atoms/`: Individual, reusable UI components (e.g., `Button`, `Input`).
  - `molecules/`: More complex components composed of atoms (e.g., `ConfigEditor`, `FilePreview`).
  - `organisms/`: Large UI sections composed of molecules and atoms (e.g., `Tabs`).
  - `context/`: React context providers, primarily for managing the global configuration state (`ConfigContext`).
  - `examples/`: Contains built-in example configurations.
  - `utils/`: Utility functions, such as for fetching data from GitHub.
- `patch/`: Contains scripts and patches for customizing the `ergogen` dependency.

## Using a Custom Ergogen Branch

To test this GUI with a specific branch of Ergogen from GitHub:

1. Open the `package.json` file.
2. Find the `dependencies` section and modify the `ergogen` entry to point to your desired branch using the format `<username>/<repo>#<branch>`:

   ```json
   "ergogen": "ergogen/ergogen#develop",
   ```

3. Re-install dependencies and start the application:

   ```shell
   yarn install && yarn start
   ```

## Contributing

Contributions are welcome! If you have a feature request, bug report, or want to contribute to the code, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
