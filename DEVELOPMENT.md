# Ergogen Web UI - Developer Documentation & Knowledge Base

This document serves as a knowledge base and architectural guide for the project, tracking implementation details, design decisions, and future tasks.

## Ergogen CLI

[Ergogen](https://github.com/ergogen/ergogen) is a command line tool that allows users to define the characteristics of ergognomic keyboards (usually split ones) in YAML code, then generating assets to help fabricate the board. Ergogen helps with the general layout of the keys, the creation of a KiCad compatible PCB, the creation of DXF outlines for integration with other CAD software, and OpenJSCAD 3D models for keyboard case creation.

## Component Architecture

The project follows the principles of **Atomic Design** to structure its React components. This methodology helps create a scalable and maintainable component library. Components are organized into the following directories:

- **`src/atoms`**: The smallest, most basic building blocks of the UI. These are individual HTML elements like buttons, inputs, and icons. They are highly reusable and should not contain any business logic.
- **`src/molecules`**: Groups of atoms that function together as a single unit. For example, a search form might consist of an input atom and a button atom.
- **`src/organisms`**: More complex UI components composed of molecules and/or atoms. These components represent distinct sections of an interface, like a header or a file download list.
- **`src/pages`**: The highest-level components that represent entire pages in the application. They are responsible for composing organisms and other components to build a complete user view.

This structure promotes reusability and a clear separation of concerns, making it easier to develop and test components in isolation.

## Resizable Panels

The application uses a custom `ResizablePanel` component (`src/molecules/ResizablePanel.tsx`) for creating resizable split-panel layouts. This component replaced the `react-split` library to provide more control over styling and behavior.

### Features

- **Drag-to-resize**: Supports both mouse and touch interactions for resizing
- **Flexible constraints**: Supports `minWidth`, `maxWidth` (as pixels, percentages, or numbers), and `initialWidth`
- **Side-aware**: Can be configured as a left or right panel with appropriate handle positioning
- **Performance optimized**: Uses inline styles for width to avoid generating excessive CSS classes during resize operations

### Usage

The `ResizablePanel` component is used throughout the application for:

- **Config panel**: Left-side panel containing the configuration editor
- **Downloads panel**: Right-side panel containing the file downloads list
- **Settings panel**: Left-side panel containing options and injections list

### Implementation Details

- Width is managed via React state and updated during drag operations
- Maximum width calculation handles percentage strings (e.g., `"70%"`), pixel strings (e.g., `"600px"`), and numeric values
- On mobile devices (≤639px), panels automatically expand to 100% width and resize handles are hidden
- The resize handle includes visual feedback with hover effects and a gap effect using `box-shadow`

## Web Workers

The application offloads long-running, computationally intensive tasks to Web Workers to prevent the main UI thread from freezing. This ensures the user interface remains responsive while processing complex keyboard layouts or generating 3D models.

- **`ergogen.worker.ts`**: This worker is responsible for running the core Ergogen logic. It takes the user's YAML configuration as input and generates the raw output data, including outlines, PCB information, and case designs.
  - **Lifecycle Management**: To prevent custom injections (footprints, outlines, templates) from lingering in Ergogen's persistent module-level registry inside the worker thread when renamed or deleted, the worker is terminated and recreated fresh every time the settings panel (`showSettings`) transitions from open (`true`) to closed (`false`).
  - **Auto-Generation Suspension**: Auto-generation runs are suspended while the settings panel is open to ensure maximum performance and responsiveness when editing custom footprint code or modifying settings. Once the settings panel is closed, the worker is restarted and a generation run is triggered immediately to compile all edits.
  - **Custom Injection Evaluation**: Evaluates custom user-provided injection scripts (such as outlines, templates, or footprints) within the worker context. It binds a custom `require` resolver to support dynamic runtime module resolution for common packages/modules (e.g. `makerjs`, `../utils`, and internal Ergogen helpers like `assert`, `prepare`, etc.).

- **`jscad.worker.ts`**: This worker handles 3D geometry processing. It receives the output from the Ergogen worker and uses JSCAD to generate 3D models for previewing. It is also responsible for converting these models into the STL format for downloading.

Communication with the workers is managed through a standard message-passing system (`postMessage` and `onmessage`), with the main application thread and workers exchanging data as needed.

### Worker Factory & Jest Testing

To handle Web Worker instantiation in a centralized and testable way, the application uses `src/workers/workerFactory.ts`. This module exports `createErgogenWorker` and `createJscadWorker`.

Since these factory functions utilize ESM-native `import.meta.url` for locating the worker scripts in Webpack 5, executing them directly in Jest's Node/CommonJS runner would throw a syntax error (`SyntaxError: Cannot use 'import.meta' outside a module`).

To resolve this during testing without sacrificing production bundle safety:

1. The test runner dynamically reads `src/workers/workerFactory.ts` at execution time.
2. It replaces `import.meta.url` with a mockup URL string (`"http://localhost"`).
3. It writes a temporary file `src/workers/workerFactory.tmp.ts`.
4. It requires this temporary file dynamically to perform the assertions (e.g. mock environment checks, instantiation, and error recovery handling).
5. It cleans up the temporary file immediately after tests complete.

The temporary file pattern is registered in `.gitignore` and required dynamically to bypass Knip's unused-import checks.

## Local File Loading

The application supports loading Ergogen configurations from local files on the user's computer. This includes support for multiple file formats and drag-and-drop functionality.

### Supported File Types

- **YAML/JSON files** (`.yaml`, `.yml`, `.json`): Direct configuration files that are loaded as text
- **ZIP archives** (`.zip`): Archives containing `config.yaml` in the root and optionally `footprints`, `outlines`, or `templates` folders
- **EKB archives** (`.ekb`): Ergogen keyboard archives (essentially ZIP files with a different extension)

### Archive Structure

When loading ZIP or EKB archives, the application expects:

- **`config.yaml`** (required): Must be present in the root directory of the archive
- **`footprints/` folder** (optional): Contains custom footprints as `.js` files organized in subfolders
  - Names are derived from the relative path under `footprints`, excluding the `.js` extension
- **`outlines/` folder** (optional): Contains custom outlines as `.js` files organized in subfolders
  - Names are derived from the relative path under `outlines`, excluding the `.js` extension
- **`templates/` folder** (optional): Contains custom templates as `.js` files organized in subfolders
  - Names are derived from the relative path under `templates`, excluding the `.js` extension

### Drag and Drop

Users can drag and drop files anywhere on the welcome page to load them. Visual feedback includes:

- Dashed border around the page when dragging
- Overlay message indicating drop target
- Automatic file type validation
- Error messages for invalid file types or missing config.yaml

### Local File Conflict Resolution

When loading footprints, outlines, or templates from local archives, the same unified conflict resolution system applies. Users can choose to skip, overwrite, or keep both versions of conflicting injections. The system works for all injection types and shows type-specific dialogs (e.g., "Footprint Conflict", "Outline Conflict", "Template Conflict").

### Local File Implementation

- **`src/utils/localFiles.ts`**: Contains `loadLocalFile` function that handles all file types:
  - `loadTextFile`: Reads YAML/JSON files using FileReader
  - `loadZipArchive`: Extracts config.yaml, footprints, outlines, and templates from ZIP/EKB archives using JSZip
  - `extractFootprintName` / `extractOutlineName` / `extractTemplateName`: Generates names from relative file paths
- **`src/pages/Welcome.tsx`**: Integrates local file loading with drag-and-drop handlers and conflict resolution

## GitHub Integration

The application supports loading Ergogen configurations directly from GitHub repositories. This feature includes automatic footprint, outline, and template loading.

### Loading from GitHub

GitHub configurations can be loaded in two ways:

1. **Via Welcome Page Input**: User enters a GitHub URL in the input field on the Welcome page
2. **Via URL Parameter**: User navigates to a URL with `?github=user/repo` parameter (e.g., `https://ceoloide.github.io/ergogen-gui/?github=ceoloide/corney-island`)

When a user provides a GitHub repository URL (e.g., `user/repo` or `https://github.com/user/repo`), the application:

1. **Fetches the configuration file**: Attempts to load `config.yaml` from standard locations:
   - Root directory: `/config.yaml`
   - Ergogen subdirectory: `/ergogen/config.yaml`
   - Tries both `main` and `master` branches

2. **Fetches custom injections**: Recursively scans for `footprints/`, `outlines/`, and `templates/` folders alongside the config file:
   - Searches for `.js` files at any depth within these folders
   - Constructs injection names from the folder path and filename (e.g., `folder1/folder2/file_name`)
   - Uses the GitHub API to traverse directories

3. **Handles Git Submodules**: Checks for `.gitmodules` file in the repository root:
   - Parses the `.gitmodules` file to find submodules within footprints, outlines, or templates folders
   - For each matching submodule, fetches the submodule repository recursively
   - Loads all `.js` files from the submodule and prefixes names with the relative path

### GitHub Conflict Resolution

The application provides a unified conflict resolution system for all injection types (footprints, templates, and outlines) across multiple loading scenarios:

#### When Conflicts Occur

Conflict resolution is triggered when loading injections from:

1. **GitHub repository URLs** (via the Welcome page input or `?github=` URL parameter)
2. **Local files** (ZIP/EKB archives with injections)
3. **Shared configuration links** (hash fragments with injections)

#### Conflict Resolution Dialog

When a conflict is detected, a `ConflictResolutionDialog` is displayed to the user with:

1. **Type-specific messaging**: The dialog shows the specific injection type (e.g., "Footprint Conflict", "Outline Conflict", "Template Conflict") rather than generic "injection" terminology, making it clearer for users.

2. **Three resolution options**:
   - **Skip**: The new injection is not loaded
   - **Overwrite**: The new injection replaces the existing one
   - **Keep Both**: Both injections are retained; the new one gets a unique name with an incremental suffix (e.g., `footprint_1`)

3. **"Apply to all conflicts" checkbox**: Allows the user to use the same resolution strategy for all subsequent conflicts in the current load operation.

#### Generic Implementation

The conflict resolution infrastructure is generic and works with any injection type:

- Uses `checkForInjectionConflict(type, name, existingInjections)` for type-aware conflict detection
- Uses `mergeInjectionArraysWithResolution(newInjections, existingInjections, resolution)` for merging with conflict resolution
- The dialog accepts an `injectionType` prop to display type-specific messages
- Supports footprints, outlines, and templates

### GitHub Implementation

- **`src/utils/github.ts`**: Contains `fetchConfigFromUrl` function that returns config, footprints, outlines, and templates, plus helper functions:
  - `fetchFootprintsFromDirectory`: Recursive directory traversal for a single directory
  - `fetchFootprintsFromRepo`: Recursive traversal of an entire repository (for submodules)
  - `parseGitmodules`: Parses `.gitmodules` file to extract submodule paths and URLs
  - `bfsForYamlFiles`: Performs breadth-first search to find YAML files in repository
- **`src/utils/injections.ts`**: Generic utility functions for conflict resolution:
  - `checkForInjectionConflict(type, name, existingInjections)`: Type-aware conflict detection
  - `generateUniqueInjectionName(type, baseName, existingInjections)`: Generates unique names for any injection type
  - `mergeInjectionArraysWithResolution(newInjections, existingInjections, resolution)`: Merges injections with conflict resolution
  - `mergeInjections(newFootprints, existingInjections, resolution)`: Footprint-specific wrapper (deprecated, use `mergeInjectionArraysWithResolution` instead)
  - `mergeInjectionArrays(newInjections, existingInjections)`: Default merge with overwrite strategy
- **`src/molecules/ConflictResolutionDialog.tsx`**: React component for the conflict resolution UI that displays type-specific messages
- **`src/pages/Welcome.tsx`**: Orchestrates the loading process (both GitHub and local files), handles conflicts sequentially, and manages dialog state. Also includes drag-and-drop handlers for local file loading
- **`src/context/ConfigContext.tsx`**: Handles conflict resolution for GitHub URI parameter loading (`?github=...`)
- **`src/App.tsx`**: Handles conflict resolution for shared config hash fragment loading

### GitHub API Rate Limiting

The GitHub loading functionality uses unauthenticated requests, which are subject to GitHub's rate limits:

#### API Requests (api.github.com)

- **Rate Limit**: 60 requests per hour for unauthenticated requests
- **Detection**: The code checks for HTTP 403 status with `X-RateLimit-Remaining: 0` header
- **80% Warning**: Displays warning when 80% of hourly allowance is consumed
- **User Feedback**: When rate limit is exceeded, a clear error message is displayed: "Cannot load from GitHub right now. You've used your hourly request allowance. Please wait about an hour and try again."
- **Graceful Handling**: The loading process continues even if rate limit is hit, just showing the error to the user
- **Console Logging**: All rate limit headers (Limit, Remaining, Used, Reset) are logged with `[GitHub Rate Limit]` prefix

#### Raw Content Requests (raw.githubusercontent.com)

- **Rate Limit**: 5,000 requests per hour for unauthenticated requests
- **Detection**: The code checks for HTTP 429 status
- **User Feedback**: When rate limit is exceeded, displays: "You've reached your hourly request allowance for loading content from GitHub. Please wait 30 minutes and try again."
- **No 80% Warning**: raw.githubusercontent.com doesn't provide rate limit headers, so proactive warnings are not possible
- **Graceful Handling**: The loading process continues even if rate limit is hit, just showing the error to the user

**Future Enhancement**: Implement authenticated GitHub API requests to increase API rate limit to 5,000 requests per hour. This would require:

- OAuth integration or personal access token support
- Secure token storage
- UI for token configuration
- Fallback to unauthenticated requests if no token is provided

## Configuration Sharing

The application supports sharing keyboard configurations via URL hash fragments. Users can generate a shareable link that contains the configuration and only the custom footprints that are actually used, allowing recipients to load the complete setup with a single click.

### Share Link Format

Shareable links use the format: `<baseUrl>#<encoded-config>` (resolving to the deployment domain, e.g. `https://ceoloide.github.io/ergogen-gui/#<encoded-config>`) where the hash fragment contains:

- The keyboard configuration (YAML/JSON string)
- Only the footprint injections that were selected by the user in the Share dialog (filtered to those actually used in the design)
- All non-footprint injections (templates, etc.) that were selected by the user
- **Version metadata**:
  - `guiVersion`: The version of the GUI in package.json at the time of creation (e.g. `0.8.9`)
  - `ergogenVersion`: The full Ergogen version used (e.g. `github:ceoloide/ergogen#v4.3.0` or official `github:ergogen/ergogen#v4.2.1`)

The configuration, injections, and version metadata are compressed and URL-encoded using `lz-string`'s `compressToEncodedURIComponent` function for efficient transmission.

### Sharing Process

The sharing flow is a two-step wizard inside `ShareDialog`:

**Step 1 – Selection View:**

1. The user clicks the share button in the header or subheader. The `ShareDialog` opens at Step 1.
2. An **"Include custom libraries"** toggle is shown (defaulted to ON).
3. When ON and custom injections are present, the dialog immediately spawns a **temporary background worker** (via `createErgogenWorker()`) and runs Ergogen generation in debug mode.
4. The worker response includes the `canonical` output. The dialog calls `extractUsedFootprintsFromCanonical(canonical)` to identify which footprint names are referenced in the PCBs section.
5. The dialog builds a **checklist** of eligible injections:
   - Footprint injections are only included if they appear in the canonical output.
   - Template and outline injections are always included.
   - All items default to checked.
6. The user can uncheck individual items to exclude them from the share package.
7. When the toggle is OFF, no worker is spawned and no injections are shared.
8. The user clicks **Share** to proceed to Step 2.

**Step 2 – Copy Link View:**

1. `createShareableUri` is called with the config and the user-selected injections.
2. The generated link is displayed in a read-only input and **auto-copied** to the clipboard.
3. A "Copy link" button provides visual feedback (changes to "Link copied" with a check icon for 2.5 seconds).

### Dialog UI

The `ShareDialog` component provides:

- **Step 1**: Toggle switch, loading spinner (while analyzing), error message (if worker fails), injection checklist with type badges (footprint / outline / template), and a Share button.
- **Step 2**: Read-only share link input, Copy button with feedback, close button (X), Escape key support.

### Loading Shared Configurations

When a user navigates to a URL with a hash fragment:

1. **Initial Load / Hash Changes**: On page load or hash change, `App.tsx` checks for a hash fragment, decodes, and validates the shared payload structure.
2. **Version Compatibility Checking**: Before loading the configuration, the application performs environment checks:
   - If the current GUI version is older than the one in the share link, or if the current Ergogen version is older than the one in the share link, or if the share link used a custom Ergogen version:
     - The loading is intercepted and a **Version Compatibility Warning Modal** (`ShareVersionCompatibilityDialog`) is shown.
     - The user is alerted of the version mismatches (e.g., GUI/Ergogen version differences) or that a custom Ergogen fork was used (with a clickable link to the GitHub repository/ref for investigation).
     - The user can choose to **Accept and Load** (which imports the configuration as is) or **Cancel** (which aborts loading completely).
   - **Backward Compatibility**: If a parsed share link lacks version information (legacy links), the application assumes it was shared with GUI version `0.9.0` and official Ergogen version `4.2.1` (`github:ergogen/ergogen#v4.2.1`).
   - If all versions are compatible (or the user accepts the compatibility warning dialog), the configuration loading proceeds.

3. **Conflict Resolution**:
   - If injections are present, conflict resolution is performed using `ConflictResolutionDialog` for name conflicts.
   - Updates the configuration state and triggers regeneration.

### Error Handling

The share system provides comprehensive error handling:

- **Decode Errors**: Invalid or corrupted encoded strings display: "The shared configuration link is invalid or corrupted. The encoded data could not be decompressed."
- **Validation Errors**: Valid strings with invalid structure display: "The shared configuration link does not contain a valid configuration. The decoded data is missing required fields or has an invalid structure."
- **Console Logging**: All errors are logged to the console with `[Share]` prefix for debugging
- **Debug Mode**: Adding `?debug` to the URL enables debug logging that shows the decoded configuration object in the console

### Sharing Implementation

- **`src/utils/share.ts`**: Core sharing utilities:
  - `encodeConfig`: Compresses and encodes configuration and injections, automatically embedding GUI and Ergogen version metadata.
  - `decodeConfig`: Decompresses and validates shared configurations. Assigns default fallback versions (`0.9.0` for GUI, `github:ergogen/ergogen#v4.2.1` for Ergogen) for backward compatibility when versions are missing in the payload. Returns `DecodeResult`.
  - `createShareableUri`: Constructs the full shareable URL.
  - `getConfigFromHash`: Extracts and decodes hash fragment from current URL.
  - `extractUsedFootprintsFromCanonical`: Extracts footprint names from canonical output's PCBs section.
  - `filterInjectionsForSharing`: Filters injections to only include used footprints.
- **`src/utils/version.ts`**: Contains version parsing, comparison, and extraction utilities (`parseVersion`, `compareVersions`, `getSemverFromErgogenVersion`, `isCustomErgogenVersion`).
- **`src/utils/injections.ts`**: Contains functions for merging injection arrays.
- **`src/molecules/ShareDialog.tsx`**: Two-step dialog for sharing configurations.
- **`src/molecules/ShareDialog.test.tsx`**: Unit tests for the two-step sharing flow.
- **`src/molecules/ShareVersionCompatibilityDialog.tsx`**: Themed warning modal shown when loading a shared config with version mismatches or a custom Ergogen version.
- **`src/molecules/ShareVersionCompatibilityDialog.test.tsx`**: Unit tests for the warning dialog.
- **`src/App.tsx`**: Handles initial hash loading, hash change events, and integrates version compatibility warning checks before loading shared configurations.
- **`src/App.test.tsx`**: Integration tests verifying App's mount and hashchange behavior when receiving compatible, incompatible, and custom-version share links.
- **`src/atoms/Header.tsx`**: Contains the share button and share functionality.

### Future Enhancements

Several potential improvements could enhance the sharing feature:

1. **URL Length Validation**: Very large configurations might create URLs that exceed browser URL length limits (typically 2048-8192 characters depending on browser). Could add validation to warn users or suggest alternative sharing methods when URLs become too long.
2. **QR Code Generation**: For easier mobile sharing, could generate QR codes that users can scan to load configurations directly on mobile devices.
3. **Share Link Shortening**: Very long URLs can be unwieldy. Could integrate with URL shortening services or create a custom short link service with a backend API.
4. **Mobile Native Sharing**: On mobile devices, could integrate with native sharing APIs (Web Share API) to allow sharing through the device's native share menu (SMS, email, social media, etc.).
5. **Share Link History**: Track previously generated share links in localStorage, allowing users to easily access and re-share recent configurations.
6. **Share Link Validation**: Add a "Test Link" feature that validates a share link works correctly before sharing it with others.
7. **Better Error Recovery**: When encountering partially corrupted share links, attempt to recover and load what's possible rather than showing a complete error (e.g., load config even if injections are corrupted).
8. **Share Link Expiration**: Add optional expiration dates or time-to-live (TTL) for share links, useful for temporary sharing scenarios.
9. **Compression Optimization**: Investigate alternative compression algorithms or compression settings that might provide better compression ratios for large configurations while maintaining URL safety.

## Ergogen Version Override Lifecycle

To allow developers and CI to override the default Ergogen version using the `ERGOGEN_VERSION` environment variable without permanently modifying `package.json` (or breaking the build due to `yarn.lock` mismatch in CI), the project implements a temporary package.json patching workflow:

1. **Pre-install (`scripts/preinstall.js`)**:
   - Executes before dependencies are resolved and installed.
   - If `ERGOGEN_VERSION` is set and differs from the current `"ergogen"` dependency version in `package.json`, it backs up `package.json` to `packages.json.bak` and temporarily patches the `"ergogen"` dependency to the custom version.
   - If the version matches or is not set, it does nothing (and cleans up any stale `packages.json.bak` backups).

2. **Installation**:
   - In CI, if `ERGOGEN_VERSION` is set, `yarn install` is run without `--frozen-lockfile` to allow the package manager to dynamically update the lockfile in memory for the custom Ergogen dependency. If `ERGOGEN_VERSION` is not set, `yarn install --frozen-lockfile` is used to guarantee consistent builds.

3. **Post-install (`scripts/postinstall.js`)**:
   - Executes after dependencies are successfully installed.
   - If `packages.json.bak` exists, it restores the original `package.json` and deletes the backup file, ensuring that the workspace remains clean and no modified `package.json` is committed.

## Version Information & Custom Build Indicators

To improve transparency and debuggability for users running custom repositories, branches, tags, or commit hashes of Ergogen, the application displays version information directly in the sidebar footer and highlights custom builds using dedicated badges:

- **GUI Version Button**: Displays the GitHub logo alongside "GUI" and the local `package.json` version (e.g., `0.6.3`). Clicking it links directly to the GUI codebase on GitHub.
- **Ergogen Version Button**: Displays the GitHub logo alongside "Ergogen" and the currently built Ergogen version.
  - **Standard Releases**: Shows the standard version number (e.g., `4.2.1`) in standard gray.
  - **Custom Builds**: If built using a custom repository or reference (detected via `isCustom`), the version text is colored in green (`theme.colors.accent`) and a vertical `DEV` badge is shown on the right-hand edge of the button.
  - **Commit Hashes**: Full 40-character commit hashes are automatically truncated to 7 characters (e.g., `fb2509f`) and link directly to `/commit/` on GitHub instead of `/tree/`.
  - **Other References**: Shorter labels (such as tags like `v4.3.0` or branch names like `develop`) are kept intact and link to `/tree/` on GitHub.

### Custom DEV Chip & Explanation Modal

When the built Ergogen version is custom (`isCustom` is true), a green superscript DEV chip (`<DevChip>`) is displayed next to the app name in both the Header and Sidebar.

- **Icon and Badge**: Contains a beaker (`science`) icon and `DEV` text.
- **Hover/Tap Popover**: Hovering (desktop) or tapping (mobile) on the chip triggers a floating explanation popover card.
- **Close Delay**: Incorporates a 250ms mouse-leave transition delay to allow the user's cursor to navigate into the popover and click the repository link without closing the card prematurely.
- **Global Click Close**: Sets up global window click listeners to automatically close the popover on touch screens or outer clicks.

## Feature Flags

The application implements a hybrid feature flag system (`src/utils/featureFlags.ts`) to control the visibility and usage of capabilities based on the active environment and loaded Ergogen version.

This is primarily used to control outline and template injections, which require Ergogen `v4.3.0` or higher:

- **Production builds** (running the standard npm package release `v4.2.1`) have these features disabled to prevent compilation errors inside the worker thread.
- **Development/Custom builds** (running custom refs or versions `>= v4.3.0`) have them enabled.

### Evaluation Lifecycle

When querying `isFeatureEnabled(featureName)`, the system checks conditions in the following priority order:

1. **URL Query Param Overrides**: e.g., `?ff_templates=true` (high-priority override, useful for manual verification/debugging).
2. **Build-Time Environment Variables**: Checks if `REACT_APP_FEATURE_TEMPLATES` is set to `'true'` or `'false'`.
3. **Runtime Version Check**: Checks the loaded Ergogen version (`displayText`). If it is standard semver, it compares it against the feature's minimum required version (`4.3.0`). Custom development references (e.g. `develop` branch or commit hashes) default to enabling the feature.

### Integrated Gating

Feature flags are enforced across the following components:

- **Injections Side Panel (`Injections.tsx`)**: Outlines and Templates tabs and action/upload buttons are conditionally hidden.
- **Local File Loader (`localFiles.ts`)**: Drops and ZIP archive extraction skip outline/template folders if disabled.
- **GitHub Loader (`github.ts`)**: Traversal of outlines and templates subfolders/submodules is skipped if disabled.
- **Generation Payload (`ConfigContext.tsx`)**: Injections are filtered on the main thread before invoking `generateNow` on the worker to prevent compile-time crashes from stale/localStorage values.

## Multi-Configuration Management

The application features a built-in Multi-Configuration Management system allowing users to work on multiple YAML/JSON configurations, switch between them instantly, search their lists, rename, duplicate, and delete configurations.

### Key Architecture Components

1. **State & Actions Context (`ConfigContext.tsx`)**:
   - Manages active configuration ID (`activeConfigId`), active configuration name (`activeConfigName`), list of saved configurations (`configs`), and a temporary read-only state for URL-shared previews (`isPreview`).
   - Syncs active config code content (`configInput`) to whichever saved configuration is currently active, auto-saving it dynamically to `localStorage`.
   - Offers helpers like `createNewConfig`, `deleteConfig`, `duplicateConfig`, `renameConfig`, `selectConfig`, and `exportAllConfigs`.
2. **Persistence (`constants.ts`)**:
   - Key name: `ergogen:multi-config` maps to a JSON container following the `MultiConfigContainer` scheme.
   - Automatically migrates legacy configurations (saved on `LOCAL_STORAGE_CONFIG` or `ergogen:config` key) on startup.
   - **Version 2**: Upgraded to store formatted inline SVG previews (`previewSvg`) in `SavedConfig` metadata inside `ergogen:multi-config`.
   - **Background Compilation**: Triggers a silent compile on mount for all configurations that lack a preview SVG (e.g. legacy/v1 designs) to generate their SVGs, skipping the heavy STL generation phase.
3. **ZIP Exporter Utilities (`zip.ts`)**:
   - Offers background worker compilation sequences that compiles all configurations concurrently or sequentially and zips them up into a single file with custom folder structures.
   - **Optimization**: Employs a local folder cache Map (`writeInjections`) when injecting footprint, template, and outline files into ZIP archives to bypass redundant JSZip nested folder search and creation overhead, improving creation times by up to ~37%.

## Monaco Editor & Performance Optimization

To prevent editing lag and cursor jumping in the Monaco editor when working with heavy configurations or on slow CPUs:

- **Uncontrolled Editor Component**: The Monaco `Editor` component in `src/molecules/ConfigEditor.tsx` is configured as uncontrolled (using `defaultValue` instead of `value`). This prevents React from forcing value synchronizations on every render.
- **Debounced Context State Updates**: Keystrokes trigger a debounced context update (500ms delay) using `lodash.debounce`. This avoids triggering heavy React tree re-renders and synchronous `localStorage` disk writes (which stringify all configurations and their SVG previews) during active typing.
- **Focus Blur Flushing**: Any pending debounced state update is immediately flushed via `debouncedSetConfigInput.flush()` when the editor loses focus (such as when a user clicks the "Download" or "Generate" buttons), ensuring other components have the latest value immediately.
- **Realtime Context Reference**: The context exposes `getRealtimeConfigInput` and `updateRealtimeConfigInput` to track the synchronous, real-time code buffer value via a React ref. Action handlers (like download and compile generation) prefer this realtime value over the debounced state value to ensure they always operate on the absolute latest changes.

## Progressive Web App (PWA)

The application is configured as a fully offline-capable PWA using CRA's built-in Workbox integration.

### Service Worker Architecture

CRA's Workbox plugin detects `src/service-worker.ts` and automatically uses `InjectManifest` mode (instead of `GenerateSW`), giving full control over the service worker logic. The plugin injects the precache manifest into `self.__WB_MANIFEST` at build time.

### Caching Strategies

| Asset type                         | Strategy                      | Cache name                 |
| ---------------------------------- | ----------------------------- | -------------------------- |
| Webpack-bundled JS/CSS/HTML        | **Precache** (install-time)   | Workbox default            |
| `public/dependencies/*.js` scripts | **CacheFirst** (runtime)      | `public-dependencies-v1`   |
| Google Fonts CSS                   | **StaleWhileRevalidate**      | `google-fonts-stylesheets` |
| Google Fonts binaries              | **CacheFirst**                | `google-fonts-webfonts`    |
| gtag.js / GA scripts               | **NetworkFirst** (3s timeout) | `google-analytics-scripts` |
| GA measurement requests            | **Background Sync queue**     | `workbox-background-sync`  |

### Update Flow

1. Every page load (or every 24 hours max), the browser re-fetches `service-worker.js` from the server.
2. If the file has changed (new build deployed), the browser installs the new SW in a **"waiting"** state.
3. `serviceWorkerRegistration.ts` fires its `onUpdate` callback with the waiting `ServiceWorkerRegistration`.
4. `App.tsx`'s `useServiceWorkerUpdate` hook stores the registration and returns an `onUpdate` handler.
5. `Header.tsx` renders `UpdateChip` (a pulsing green pill) when `onUpdate` is defined.
6. User clicks the chip → `SKIP_WAITING` is posted to the new SW → SW activates → page reloads with fresh assets (with a 1-second safety fallback reload if the event doesn't fire).

### Google Analytics & Privacy Controls

To respect user privacy, Google Analytics is dynamically initialized and can be completely disabled via the **"Send Usage Metrics"** option in the settings pane:

- **Web Default**: Enabled by default to collect usage statistics.
- **PWA Default**: Disabled by default in standalone/PWA mode to ensure a fully private, offline-first experience.
- **Opt-out Behavior**: When disabled, the Google Analytics script tag (`gtag.js`) is completely omitted/removed from the DOM, and all global objects (`window.gtag`, `window.dataLayer`) are deleted. No interaction with GA4 occurs, and event tracking is entirely skipped.

When enabled:

- Offline queuing: `workbox-google-analytics` intercepts measurement requests and queues them in IndexedDB using Background Sync when the device is offline, replaying them automatically once connection is restored.
- Asset caching: The `gtag.js` script is cached with a `NetworkFirst` strategy (3-second timeout) to support offline loading.

#### Keyboard Generation Tracking

Upon successful keyboard generation, the layout is analyzed using `configAnalyzer.ts`.

This parses and extracts:

- Outline, PCB, and Case counts
- Boolean flags like `is_reversible` and `is_mirrored`
- `keyboard_keys` representing the estimated physical switch count (doubled if reversible and asymmetric, otherwise matching `matrix_keys`)
- Alpha-sorted granular matrix zone details (zone names, counts, column names, row names, etc.)
- A deterministic 12-character SHA-256 geometric `config_id` hash of the keyboard layout.
- A `previous_config_id` chaining layouts together inside the user session.

To ensure accuracy and prevent cluttering Google Analytics / BigQuery:

- **Settlement Debounce**: Keyboard layout generation is logged with a **5-second settlement debounce**. This filters out intermediate states as the user is typing, ensuring only final configurations are logged.
- **Redundancy Suppression**: The event is skipped if the generated geometric `config_id` is identical to the last successfully tracked `config_id`.
- **Load Boundary Resets**: Switching, creating, duplicating, or deleting configurations, or viewing previews, immediately clears the lineage context and cancels any pending tracking timeouts, ensuring subsequent builds start fresh.
- **Safety Exit Flushes**: When navigating away or closing the page, the window listens to `visibilitychange` (transitioning to `hidden`) and `pagehide` to immediately and synchronously flush any pending debounced events.

### PWA Manifest

`public/manifest.json` uses the full PWA manifest spec:

- `id: "./"` — canonical identity for the PWA install
- `display_override: ["window-controls-overlay", "standalone"]` — enables title-bar area on desktop PWAs
- `theme_color / background_color: "#2a2a2a"` — matches the app's dark theme for splash screens
- Icons: `public/icons/icon-192.png` and `public/icons/icon-512.png` (dark background, white logo)

### PWA Implementation Files

- **`src/service-worker.ts`**: Workbox service worker source (compiled by CRA's InjectManifest plugin)
- **`src/serviceWorkerRegistration.ts`**: SW registration utility with `onUpdate` callback
- **`src/atoms/UpdateChip.tsx`**: Pulsing chip rendered in Header when an update is waiting
- **`public/manifest.json`**: Full PWA web app manifest
- **`public/icons/`**: PWA icon set (192×192 and 512×512)
