# Agent Instructions for ergogen-gui

This document provides guidance for AI agents working on the `ergogen-gui` codebase.

## Project Overview

`ergogen-gui` is a web-based graphical user interface for the `ergogen` keyboard layout generator. It is a React application built with Create React App.

## Development Setup

To set up the development environment, follow these steps:

1.  **Install Yarn:** If you don't have Yarn installed, you can install it globally using npm:
    ```bash
    npm install -g yarn
    ```

2.  **Install Dependencies:** The project uses Yarn for package management. Install the dependencies with:
    ```bash
    yarn install
    ```
    This will also run the `postinstall` script which patches and builds the `ergogen` dependency.

3.  **Start the Development Server:** To run the application locally, use:
    ```bash
    yarn start
    ```
    The application should be available at `http://localhost:3000`.

## Codebase Structure

-   `src/`: Contains the main source code of the React application.
    -   `src/Ergogen.tsx`: The main application component.
    -   `src/context/ConfigContext.tsx`: Manages the application's global state, including YAML parsing and processing logic.
    -   The project uses an Atomic Design-like structure with `atoms`, `molecules`, and `organisms` directories for components.
    -   `src/examples/`: Contains example configurations that are loaded into the editor.
-   `public/`: Contains static assets, including the built `ergogen.js` file.
-   `patch/`: Contains patches for dependencies, applied during the `postinstall` script.

## Key Technologies

-   **React:** The core UI library.
-   **TypeScript:** The primary language used.
-   **styled-components:** For component-level styling.
-   **js-yaml:** For parsing YAML configuration files.
-   **ergogen:** The core keyboard generation logic, included as a dependency.

## Working on the Code

-   When making changes, be mindful of the state management in `ConfigContext.tsx`.
-   UI components are organized following the Atomic Design methodology (`atoms`, `molecules`, `organisms`).
-   The application is sensitive to the `ergogen` dependency. If you encounter issues with it, check the `patch/` directory and the `postinstall` script in `package.json`.
