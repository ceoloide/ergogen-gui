# Ergogen Web UI

This project is a React-based web interface for the [Ergogen](https://github.com/ergogen/ergogen) project, including quality-of-life improvements to the users like live reload of outputs, integrated footprint libraries and loading directly from GitHub.

## Ergogen CLI

[Ergogen](https://github.com/ergogen/ergogen) is a command line tool that allows users to define the characteristics of ergognomic keyboards (usually split ones) in YAML code, then generating assets to help fabricate the board. Ergogen helps with the general layout of the keys, the creation of a KiCad compatible PCB, the creation of DXF outlines for integration with other CAD software, and OpenJSCAD 3D models for keyboard case creation.

## Building and testing

- The project uses `yarn` to handle dependencies, build, test, and run the dev web server. While `npm` is present, it should not be used for any development related activities.
- Always use `yarn add` when you need to install a new dependency, do NOT use `npm` directly.
- Before making any changes, make sure the target builds and the tests pass. Use `yarn build` and `yarn test`, respectively.
- When running unit tests with `yarn test:unit`, you can add the `--verbose` argument to see failure reasons and additional test details. This argument is not supported for end-to-end tests.
- Prefer test-driven development; first write the tests for the bug fix or new feature, make sure they fail in the expected way, then make them pass.
- Try to make tests fast, for example by mocking heavy operations or other similar things when appropriate.
- Use `yarn knip` to tidy up dependencies before finishing. Always ignore unusued files warning for files in the `patch` of `public` directories.
- Use `yarn format` and `yarn lint` to check and fix formatting errors before finishing. You MUST always run `yarn format` and `yarn lint` before committing any file.
- Run `yarn precommit` before any commit, which formats, lints, checks for dependencies, and runs tests. You MUST address all errors before proceeding. You can ignore warnings, just mentioning them to the user as a proposal for future refactoring.
- Global test setup for Jest should be placed in `src/setupTests.js`. This file is automatically loaded by the test runner and does not require manual configuration.

### Commit Procedure

- **CRITICAL:** You **MUST** run `yarn precommit` before every commit. This command formats, lints, checks for unused dependencies, and runs the entire test suite. Address all errors before proceeding. Warnings can be ignored, but should be mentioned as potential follow-up tasks.
- **Update AGENTS.md**: You **MUST** update the `AGENTS.md` file to reflect any significant changes to the application's architecture, component structure, or development workflow. This ensures the knowledge base remains current.
- **Update CHANGELOG.md**: For every major change or PR, you **MUST** add an entry to `CHANGELOG.md`. See the Changelog section below for formatting guidelines.

## Design principles

- When writing unit tests, follow the "Arrange, Act, Assert" pattern and clearly delineate the three.
- **Test-Driven Development (TDD)**: Follow a strict "Red-Green-Refactor" cycle. Before implementing any new feature or bug fix, first write a failing test that clearly defines the expected outcome. Then, write the minimum amount of code required to make the test pass. Finally, refactor the code while ensuring the tests continue to pass.
- Components should be accessible. Use semantic HTML and ARIA attributes (e.g., `aria-label`) where appropriate to ensure a good user experience for everyone, including users of assistive technologies. This also improves testability.
- Tests should be robust and user-centric. Prefer selecting elements by user-facing attributes (like accessible name, text, or role) over implementation details (like class names or DOM structure). Use `data-testid` for elements where no other stable, user-facing selector is available.
- **Centralized Theming**: All colors and other theme-related properties (e.g., font sizes, spacing) should be centralized in `src/theme/theme.ts`. Components should import and use variables from this theme file instead of using hardcoded values.
- **Styled Components for Styling**: All styling, including global styles, should be managed using `styled-components`. Global styles should be defined in a `GlobalStyle` component to ensure consistency and encapsulation within the React component architecture, avoiding the use of separate CSS files like `index.css`.

## Development environment

### Linting and formatting

- The project uses ESLint for linting and Prettier for formatting.
- All ESLint configuration is managed in the `eslint.config.js` file at the root of the project. This is the single source of truth for linting rules.
- The `eslintConfig` key in `package.json` is deprecated for this project and must not be used.
- The configuration in `eslint.config.js` includes specific settings for test files (e.g., `*.test.tsx`, `setupTests.js`) to provide the necessary Jest globals and rules.

## Coding principles

- Code should always prioritize human legibility and clarity over least lines of codes.
- Prioritize small and incremental changes, captured in a single commit. It's easier for a human reviewer to spend 5 minutes to review a small change than set aside 30 minutes to review a large one. In general each change should be a self-contained one, this means that:
  - The change addresses **just one thing**. This is usally just one part of a feature, rather than the whole feature at once.
  - The change should include related test code.
  - The commit description should explain what the committed changes aim to address. Avoid repeating the same general context, and focus on information that makes it possible for the reviewer to understand the change and the reasoning behind it. Briefly call out things that will be implemented at a later stage, but avoid including too much future planning.

## Changelog

The `CHANGELOG.md` file tracks user-facing changes to the application in reverse chronological order (newest first). Each entry should be written in a blog post style that non-technical users can understand.

### Changelog Entry Format

**Title**: Use format "## Brief Feature Title"

**Date**: Use format "Month DD, YYYY"

**Image**: Use format: ![A description of a screenshot of the feature.](./public/images/changelog/placeholder.png)

**Opening Paragraph**: Describe the user problem or challenge that existed before the change. Make it relatable and concrete.

**Middle Paragraphs**: Explain how the feature solves the problem. Focus on benefits and user experience, avoiding technical jargon. Keep the total entry under 300 words (maximum 500 words).

**What changed section**: End with a bulleted list under "**What changed:**" that provides specific details:

- Use present tense and active voice
- Focus on user-visible changes, not implementation details
- Keep bullets concise (one line each)
- Highlight the most impactful changes first

**Example structure:**

```markdown
## Feature Title

Month DD, YYYY

![A description of a screenshot of the feature.](./public/images/changelog/placeholder.png)

[Problem description - 1-2 sentences about what was difficult before]

[Solution explanation - 2-3 sentences about how it works now and why it's better]

**What changed:**

- **Key feature**: Brief description of what users can now do
- **Another feature**: How it improves the experience
- **Supporting feature**: Additional benefit or capability
```

### When to Add Changelog Entries

Add an entry for:

- New user-facing features
- Significant improvements to existing features
- Bug fixes that notably impact user experience
- Changes to workflows or user interactions

Skip entries for:

- Internal refactoring without user-visible changes
- Dependency updates
- Minor bug fixes
- Documentation-only changes

## Knowledge base

Your task is to record important information in this file (`AGENTS.md`), which acts as a knowledge base. Analyze your chat history and `AGENTS.md` sections to propose changes, adidtions, or deletions. These changes will inform future actions in the same repository for the same user.

### User preferences & instructions

- **Always run tests in headless/CI mode.** When running tests, ensure they are configured to execute once and exit.
- **Propose a plan before complex refactoring.** For non-trivial changes, especially concerning tests or core logic, present a plan of action before implementing it. This allows for feedback and ensures alignment.
- **Critique your work and log follow-up tasks.** After making significant changes, provide a critique of the work, identifying areas for improvement. Log these areas as actionable items in the AGENTS.md "Future Tasks" section. This formalizes the process we followed after the test refactoring.
- **CRITICAL: Confirm task completion before removal.** You **MUST** always confirm with the user that a task from the "Future Tasks" list is complete before removing it from this document. Once the user confirms, and only then, the task should be removed from the "Future Tasks" section.
- **Focus on a single failing test.** When fixing tests, run only the specific test that you are currently working on. This isolates the problem and speeds up the feedback cycle.
- **Focus on relevant lint errors.** When running the linter, only address errors that are directly related to the files and code you have modified. It is acceptable to ignore pre-existing, unrelated errors in other parts of the codebase.
- **Use the Theme File**: When implementing or modifying UI components, you **MUST** use variables from the theme file (`src/theme/theme.ts`) for all colors and other theme-related properties. If a required value is not present in the theme, you **MUST** add it.

### Instructions on proposals to change the knowlege base

When creating proposals for the knowledge base, primarily focus on extracting information from these categories:

- **User Preferences & Instructions**
  - **Directives**: Record direct, persistent commands from the user that shold act as rules for future tasks (e.g., "Always add type hints", "Do not run tests unless asked").
  - **Style & Conventions**: Document explicity preferences for programming languages, frameworks, libraries, coding styles, and formatting rules. Not they shouldn't be task specific but things that can apply for entire codebase.
- **Repository & Project Context**
  - **Purpose & Architecture**: Summarize the repository's primary purpose and architectural patterns (e.g., "microservices architecture").
- **Environment & Execution**
  - **Setup Commands**: Detail the exact, sequential commands required to set up the development environment and install all dependencies if they are proven useful.
  - **Execution Commands**: List the commands needed to build, test, and run the project (e.g., `yarn build`, `yarn test`) if they are proven useful.

### Component Architecture

The project follows the principles of **Atomic Design** to structure its React components. This methodology helps create a scalable and maintainable component library. Components are organized into the following directories:

- **`src/atoms`**: The smallest, most basic building blocks of the UI. These are individual HTML elements like buttons, inputs, and icons. They are highly reusable and should not contain any business logic.
- **`src/molecules`**: Groups of atoms that function together as a single unit. For example, a search form might consist of an input atom and a button atom.
- **`src/organisms`**: More complex UI components composed of molecules and/or atoms. These components represent distinct sections of an interface, like a header or a file download list.
- **`src/pages`**: The highest-level components that represent entire pages in the application. They are responsible for composing organisms and other components to build a complete user view.

This structure promotes reusability and a clear separation of concerns, making it easier to develop and test components in isolation.

## Web Workers

The application offloads long-running, computationally intensive tasks to Web Workers to prevent the main UI thread from freezing. This ensures the user interface remains responsive while processing complex keyboard layouts or generating 3D models.

- **`ergogen.worker.ts`**: This worker is responsible for running the core Ergogen logic. It takes the user's YAML configuration as input and generates the raw output data, including outlines, PCB information, and case designs.

- **`jscad.worker.ts`**: This worker handles 3D geometry processing. It receives the output from the Ergogen worker and uses JSCAD to generate 3D models for previewing. It is also responsible for converting these models into the STL format for downloading.

Communication with the workers is managed through a standard message-passing system (`postMessage` and `onmessage`), with the main application thread and workers exchanging data as needed.

## GitHub Integration

The application supports loading Ergogen configurations directly from GitHub repositories. This feature has been extended to include automatic footprint loading.

### Loading from GitHub

When a user provides a GitHub repository URL (e.g., `user/repo` or `https://github.com/user/repo`), the application:

1. **Fetches the configuration file**: Attempts to load `config.yaml` from standard locations:
   - Root directory: `/config.yaml`
   - Ergogen subdirectory: `/ergogen/config.yaml`
   - Tries both `main` and `master` branches

2. **Fetches footprints**: Recursively scans for a `footprints` folder alongside the config file:
   - Searches for `.js` files at any depth within the `footprints` folder
   - Constructs footprint names from the folder path and filename (e.g., `folder1/folder2/file_name`)
   - Uses the GitHub API to traverse directories

3. **Handles Git Submodules**: Checks for `.gitmodules` file in the repository root:
   - Parses the `.gitmodules` file to find submodules within the footprints folder
   - For each matching submodule, fetches the submodule repository recursively
   - Loads all `.js` files from the submodule and prefixes names with the relative path
   - Example: A submodule at `footprints/external` with `switch.js` becomes `external/switch`

### Conflict Resolution

When loading footprints from GitHub, the application checks for naming conflicts with existing custom footprints. If a conflict is detected:

1. A `ConflictResolutionDialog` is displayed to the user with three options:
   - **Skip**: The new footprint is not loaded
   - **Overwrite**: The new footprint replaces the existing one
   - **Keep Both**: Both footprints are retained; the new one gets a unique name with an incremental suffix (e.g., `footprint_1`)

2. An "Apply to all conflicts" checkbox allows the user to use the same resolution strategy for all subsequent conflicts in the current load operation.

### Implementation Files

- **`src/utils/github.ts`**: Contains `fetchConfigFromUrl` function that returns both config and footprints, plus helper functions:
  - `fetchFootprintsFromDirectory`: Recursive directory traversal for a single directory
  - `fetchFootprintsFromRepo`: Recursive traversal of an entire repository (for submodules)
  - `parseGitmodules`: Parses `.gitmodules` file to extract submodule paths and URLs
  - `bfsForYamlFiles`: Performs breadth-first search to find YAML files in repository
- **`src/utils/injections.ts`**: Utility functions for conflict detection (`checkForConflict`), unique name generation (`generateUniqueName`), and merging injections (`mergeInjections`)
- **`src/molecules/ConflictResolutionDialog.tsx`**: React component for the conflict resolution UI
- **`src/pages/Welcome.tsx`**: Orchestrates the loading process, handles conflicts sequentially, and manages dialog state

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

## Future Tasks

When adding a new future task, always structure them with a unique ID, a brief title, the context, and the task, for example:

```md
### TASK-001: Eliminate Magic Values in Tests

**Context:** During a refactoring of the `InjectionRow.tsx` component, the test suite was improved to check for the presence of a green highlight when a row is active. The test currently asserts that the border color is a hardcoded hex value (`#28a745`).

**Task:** Refactor the test to remove this "magic value." This can be achieved by defining theme colors in a central location (e.g., a `theme.ts` file), exporting them, and importing the color variable into both the `InjectionRow.tsx` component and its test file, `InjectionRow.test.tsx`.
I also want you to add instructions on how to structure and add future tasks.
```

### [TASK-001] Redundant State in ConfigContextProvider

Description: The ConfigContextProvider component uses multiple individual useState hooks for settings like debug, autoGen, autoGen3D, kicanvasPreview, and jscadPreview. It then manually saves each of these to localStorage in a useEffect hook. This approach is verbose and leads to a lot of boilerplate code.

Proposed Fix: I will refactor this by consolidating all these settings into a single settings object, managed by a single useState hook. I can then use the useLocalStorage hook to automatically persist this entire settings object to local storage. This will significantly reduce the amount of code, eliminate the manual useEffect, and make the component cleaner and less error-prone.

### [TASK-002] Unnecessary Prop Drilling

Description: Currently, the main App.tsx component initializes the configInput state and then passes both the state and its setter function (setConfigInput) as props to the ConfigContextProvider. However, ConfigContextProvider is the component that actually uses and manages this state. This is a classic case of unnecessary prop drilling.

Proposed Fix: I will move the useState hook for configInput directly into the ConfigContextProvider. This will make the context provider the single source of truth for the configuration, which is more aligned with its purpose. It will also simplify App.tsx and make the overall data flow of the application more logical and easier to follow.

### [TASK-003] Complex runGeneration Function

Description: The runGeneration function is a critical part of the application, but it has grown to be very long and complex. It currently handles multiple distinct responsibilities: parsing the configuration, checking for deprecation warnings, preparing a simplified config for previews, and finally executing the generation process. This makes the function difficult to read, test, and debug.

Proposed Fix: I will break down the runGeneration function into several smaller, more focused functions. For example, I can create separate utility functions for parseConfig, checkForDeprecationWarnings, preparePreviewConfig, and executeGeneration. This will make the main runGeneration function a much simpler coordinator of these smaller functions, improving readability, maintainability, and making it much easier to write targeted unit tests.

### [TASK-004] Replace Resizable Panel Library

**Context:** The application currently uses an unspecified or custom implementation for resizable panels. The user has expressed a desire to switch to a more robust and feature-rich solution, specifically `react-resizable-panels`, to better emulate the UI behavior of modern editors like VS Code.

**Task:** Replace the existing resizable panel implementation throughout the application with `react-resizable-panels`. This will involve:

1. Adding `react-resizable-panels` as a project dependency.
2. Identifying all components that use the current resizable panel system.
3. Refactoring these components to use the `PanelGroup`, `Panel`, and `PanelResizeHandle` components from the new library.
4. Ensuring that the new implementation is styled consistently with the application's theme and provides a smooth, VS Code-like user experience.
5. Verifying that all related functionality, including E2E tests, remains intact after the migration.

### [TASK-005] Unify Results Types Between Main and Worker

**Context:** After updating the JSCAD pipeline to send and receive the entire `results` object, we introduced a lightweight `ResultsLike` type for worker messaging. The UI has a separate `Results` shape in `ConfigContext.tsx`. Maintaining two parallel shapes risks drift.

**Task:** Extract a shared results type definition used by both the main thread and workers. Consider placing it under `src/types/results.ts` and importing it in `ConfigContext.tsx` and `src/workers/jscad.worker.types.ts` to ensure a single source of truth and stronger type safety.

### [TASK-006] Modernize React act Usage In Tests

**Context:** Some tests use `react-dom/test-utils` for `act`, which emits deprecation warnings. The recommended approach in React 18+ is to use `import { act } from 'react'`.

**Task:** Update test files to import `act` from `react` instead of `react-dom/test-utils`, and adjust usage where needed. Verify no deprecation warnings remain during unit test runs.

### [TASK-007] Optimize STL Handling in Worker

**Context:** After migrating the JSCAD worker to use the new `convert` API, we continue to request ASCII `stla` output and decode it into strings for compatibility. This maintains current behavior but increases payload size and requires extra decoding logic in the worker.

**Task:** Investigate switching to binary `stlb` output with typed array handling end-to-end. Update the worker and download pipeline to support binary blobs without manual header replacement, ensuring previews and downloads still function as expected.

### [TASK-008] Implement Authenticated GitHub API Requests

**Context:** The GitHub loading functionality currently uses unauthenticated API requests, which are limited to 60 requests per hour. For repositories with many footprints or submodules, this rate limit can be easily exceeded, preventing users from loading configurations.

**Task:** Implement authenticated GitHub API requests to increase the rate limit to 5,000 requests per hour. This will involve:

1. Adding OAuth integration or personal access token support
2. Implementing secure token storage (localStorage with encryption or browser's credential storage)
3. Creating a UI for users to configure their GitHub token (Settings page)
4. Updating all fetch calls in `src/utils/github.ts` to include the Authorization header when a token is available
5. Implementing fallback to unauthenticated requests if no token is provided
6. Adding clear documentation on how to create a GitHub personal access token with appropriate permissions (public_repo scope)
7. Handling token expiration and invalid token errors gracefully
