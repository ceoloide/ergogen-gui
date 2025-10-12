# Ergogen GUI

Welcome to the Ergogen GUI, a powerful web-based interface for the [Ergogen](https://github.com/mrzealot/ergogen) keyboard generation tool by [@MrZealot](https://github.com/MrZealot). This project, originally created by [@MvEerd](https://github.com/MvEerd) and enhanced by [@ceoloide](https://github.com/ceoloide) and the community, provides a user-friendly environment to design, preview, and export custom ergonomic keyboards.

With this GUI, you can write Ergogen configurations in YAML, see live 2D (SVG) previews of your design, and export the necessary files for manufacturing your own keyboard.

See the live demo at [ergogen.ceoloide.com](https://ergogen.ceoloide.com).

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

## Deployment to GitHub Pages

This repository includes a GitHub Actions workflow to automatically build and deploy the application to GitHub Pages.

### Manual Deployment

In addition to automatic deployments on pushes to `main`, the workflow can be triggered manually from the GitHub Actions tab. This is particularly useful for deploying changes that don't involve a code commit, such as updating static assets in the `/public` directory.

To manually trigger a deployment:

1. Navigate to your repository on GitHub.
2. Click on the **Actions** tab.
3. In the list of workflows on the left, select **GitHub Pages**.
4. Click the **Run workflow** button, choose the branch you want to deploy from, and confirm by clicking **Run workflow** again.

### Custom Domain Configuration

The deployment workflow supports configuring a custom domain via a repository variable. This allows forks of this repository to be deployed to their own custom domains.

To configure a custom domain for your deployment:

1. Navigate to your repository on GitHub.
2. Go to **Settings** > **Secrets and variables** > **Actions**.
3. Select the **Variables** tab and click **New repository variable**.
4. For the **Name**, enter `CNAME_DOMAIN`.
5. For the **Value**, enter your custom domain (e.g., `your.domain.com`).

When the workflow runs on the `main` branch, it will generate a `CNAME` file with the value of this variable. If the `CNAME_DOMAIN` variable is not set, no `CNAME` file will be created, and the site will be deployed to the default GitHub Pages URL (`<username>.github.io/<repository-name>`).

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
