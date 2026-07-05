# Ergogen Web UI

This project is a React-based web interface for the [Ergogen](https://github.com/ergogen/ergogen) project, including quality-of-life improvements to the users like live reload of outputs, integrated footprint libraries and loading directly from GitHub.

For detailed component architecture, feature implementations, and the list of future tasks, please refer to [DEVELOPMENT.md](file:///Users/mmassarelli/Documents/GitHub/ergogen-gui/DEVELOPMENT.md).

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
- **Update DEVELOPMENT.md**: You **MUST** update the `DEVELOPMENT.md` file to reflect any significant changes to the application's architecture, component structure, or development workflow. This ensures the knowledge base remains current.
- **Update CHANGELOG.md**: For every major change or PR, you **MUST** add an entry to `CHANGELOG.md`. See the Changelog section below for formatting guidelines.

## Design principles

- When writing unit tests, follow the "Arrange, Act, Assert" pattern and clearly delineate the three.
- **Test-Driven Development (TDD)**: Follow a strict "Red-Green-Refactor" cycle. Before implementing any new feature or bug fix, first write a failing test that clearly defines the expected outcome. Then, write the minimum amount of code required to make the test pass. Finally, refactor the code while ensuring the tests continue to pass.
- Components should be accessible. Use semantic HTML and ARIA attributes (e.g., `aria-label`) where appropriate to ensure a good user experience for everyone, including users of assistive technologies. This also improves testability.
- Tests should be robust and user-centric. Prefer selecting elements by user-facing attributes (like accessible name, text, or role) over implementation details (like class names or DOM structure). Use `data-testid` for elements where no other stable, user-facing selector is available.
- **Centralized Theming**: All colors and other theme-related properties (e.g., font sizes, spacing) should be centralized in `src/theme/theme.ts`. Components should import and use variables from this theme file instead of using hardcoded values.
- **Styled Components for Styling**: All styling, including global styles, should be managed using `styled-components`. Global styles should be defined in a `GlobalStyle` component to ensure consistency and encapsulation within the React component architecture, avoiding the use of separate CSS files like `index.css`.
- **Styled-components Transient Props**: When passing props to styled-components that are only used for styling and should not be passed to the DOM, prefix them with `$` (e.g., `$isVisible`, `$isDragging`). This prevents React warnings about unrecognized props on DOM elements.
- **Styled-components Performance**: For frequently changing values (e.g., width during drag operations), use inline styles via the `style` prop instead of CSS template literals. This prevents styled-components from generating excessive classes and avoids performance warnings. Example: Instead of `width: ${props.$width}px` in the template, pass `style={{ width:`${width}px`}}` to the component.

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

Important architectural information and outstanding development tasks are recorded in [DEVELOPMENT.md](file:///Users/mmassarelli/Documents/GitHub/ergogen-gui/DEVELOPMENT.md), which acts as the project's knowledge base. Analyze your chat history and `DEVELOPMENT.md` sections to propose changes, additions, or deletions. These changes will inform future actions in the same repository for the same user.

### User preferences & instructions

- **Always run tests in headless/CI mode.** When running tests, ensure they are configured to execute once and exit.
- **Propose a plan before complex refactoring.** For non-trivial changes, especially concerning tests or core logic, present a plan of action before implementing it. This allows for feedback and ensures alignment.
- **Critique your work and log follow-up tasks.** After making significant changes, provide a critique of the work, identifying areas for improvement. Log these areas as actionable items in the `DEVELOPMENT.md` "Future Tasks" section.
- **CRITICAL: Confirm task completion before removal.** You **MUST** always confirm with the user that a task from the "Future Tasks" list in `DEVELOPMENT.md` is complete before removing it from that document. Once the user confirms, and only then, the task should be removed from the "Future Tasks" section.
- **Focus on a single failing test.** When fixing tests, run only the specific test that you are currently working on. This isolates the problem and speeds up the feedback cycle.
- **Focus on relevant lint errors.** When running the linter, only address errors that are directly related to the files and code you have modified. It is acceptable to ignore pre-existing, unrelated errors in other parts of the codebase.
- **Use the Theme File**: When implementing or modifying UI components, you **MUST** use variables from the theme file (`src/theme/theme.ts`) for all colors and other theme-related properties. If a required value is not present in the theme, you **MUST** add it.

### Instructions on proposals to change the knowledge base

When creating proposals for the knowledge base, modify [DEVELOPMENT.md](file:///Users/mmassarelli/Documents/GitHub/ergogen-gui/DEVELOPMENT.md) (not this file), primarily focusing on extracting information from these categories:

- **User Preferences & Instructions**
  - **Directives**: Record direct, persistent commands from the user that should act as rules for future tasks (e.g., "Always add type hints", "Do not run tests unless asked").
  - **Style & Conventions**: Document explicit preferences for programming languages, frameworks, libraries, coding styles, and formatting rules. Note they shouldn't be task-specific but things that can apply for the entire codebase.
- **Repository & Project Context**
  - **Purpose & Architecture**: Summarize the repository's primary purpose and architectural patterns (e.g., "microservices architecture").
- **Environment & Execution**
  - **Setup Commands**: Detail the exact, sequential commands required to set up the development environment and install all dependencies if they are proven useful.
  - **Execution Commands**: List the commands needed to build, test, and run the project (e.g., `yarn build`, `yarn test`) if they are proven useful.
