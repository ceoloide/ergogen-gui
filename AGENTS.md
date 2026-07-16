# Ergogen Web UI

This project is a React-based web interface for the [Ergogen](https://github.com/ergogen/ergogen) project, including quality-of-life improvements to the users like live reload of outputs, integrated footprint libraries and loading directly from GitHub.

For detailed component architecture, feature implementations, and the list of future tasks, please refer to `DEVELOPMENT.md`.

## Development & Test Workflow

- **pnpm Only:** Use `pnpm` exclusively for dependency management (`pnpm add`), building (`pnpm run build`), and testing. Do not use `yarn` or `npm`.
  - **Exotic Dependencies Override**: Prepend `PNPM_CONFIG_BLOCK_EXOTIC_SUBDEPS=false` to any `pnpm install` or `pnpm add` commands to allow Git-based subdependencies inside `ergogen` to resolve correctly.
  - **Transitive Dependencies**: If a library is imported directly (e.g., `makerjs`), it must be declared as a direct dependency in `package.json` (do not rely on implicit transitive hoisting).
  - **CI Overrides**: When overriding dependency versions dynamically in CI (like using `ERGOGEN_VERSION`), explicitly append the `--no-frozen-lockfile` flag to `pnpm install`.
- **Precommit Check:** You **MUST** run `pnpm run precommit` before committing. This automatically executes formatting (`prettier`), linting (ESLint/Knip), and unit tests. Address all errors before proceeding. Warnings can be ignored but should be reported to the user as potential follow-up tasks.
- **Unit Testing:**
  - Run unit tests with `pnpm run test:unit`. You can add the `--verbose` argument to see detailed failure reasons.
  - Follow the **Arrange, Act, Assert (AAA)** pattern in tests.
  - Follow a strict **Red-Green-Refactor (TDD)** cycle: write a failing test first, implement the minimum code to pass, then refactor.
  - Keep tests fast (e.g. by mocking heavy operations). Global Vitest setup is located in `src/setupTests.tsx`.
  - Focus on a single failing test at a time when fixing issues.
- **E2E Testing:** Run `pnpm run test:e2e` for Playwright end-to-end tests. Note that this is not run during `pnpm run precommit`.
- **Knip Check:** Dependency pruning is checked via `pnpm knip` (run automatically as part of `pnpm run lint`). Ignore unused file warnings for files within `patch/` or `public/` directories.
- **Focus Linting:** Only address lint/format errors in files you modified.

### Commit, Issue & Documentation Guidelines

- **Small Commits:** Keep changes small, incremental, and self-contained (typically addressing one part of a feature at a time, including related test code). Explain the "why" and decisions in your commit description.
- **Environment Isolation:** Do not commit `pnpm-lock.yaml`, `ergogen.js`, or `corney_island.svg` if the environment is running with a custom `ERGOGEN_VERSION` environment variable (treat them as temporary files).
- **Knowledge Base:** Keep `DEVELOPMENT.md` up-to-date with architectural/component changes. Propose updates for user preferences, directives, styles, context, and execution setup.
- **GitHub Issue Creation for Tasks:** Do NOT add new future tasks or follow-up items to `DEVELOPMENT.md`. Instead, create a GitHub issue on `ceoloide/ergogen-gui` for each task or refactoring idea using the `gh` command-line tool.
  - **Issue Title Format:** Use `[TASK-XXX] Title` (starting with `022` as the next sequential task ID).
  - **Issue Body:** Include a clear description of the context, problem, and proposed fix.
  - **Escape Hatch:** If the `gh` CLI tool is unavailable or unauthenticated, report the task details clearly to the user in your final response so they can log the issue manually.
- **Changelog Updates:** For major user-facing changes, add an entry to `CHANGELOG.md` using the format detailed below.

---

## Design Principles

- **Clarity Over Brevity:** Code should prioritize human legibility and clarity over minimizing lines of code.
- **Centralized Theming:** All colors and spacing properties must be centralized in `src/theme/theme.ts`. Use theme variables instead of hardcoded values, adding new variables if needed.
- **Styled Components:** Manage all styling (including global styles via `GlobalStyle`) with `styled-components`. Avoid separate CSS files like `index.css`.
  - **Transient Props:** Prefix styled-component-only props with `$` (e.g., `$isVisible`) to prevent them from passing to the DOM.
  - **Performance:** Use inline `style` props for high-frequency updates (e.g., width during drag operations) to prevent excessive class generation.
- **Accessibility:** Use semantic HTML and ARIA attributes (e.g., `aria-label`) to ensure accessibility and simplify testing.
- **User-Centric Selectors:** Select elements in tests by accessible name, role, or text. Use `data-testid` only as a fallback.

---

## Development Environment Configuration

- **Linting & Formatting:** ESLint manages linting and Prettier manages formatting.
- **ESLint Single Source of Truth:** All rules are defined in `eslint.config.mjs`. The `eslintConfig` key in `package.json` is deprecated and must not be used.
- **Vite Config Format**: Keep the Vite configuration file named as `vite.config.mts` to force native ES Module loading and bypass Node/Vite CommonJS API deprecation warnings.

---

## Changelog Guidelines

`CHANGELOG.md` tracks user-facing changes in reverse chronological order in a blog-post style (under 300 words).

### When to Add Changelog Entries

- **Add for:** New features, major enhancements, user-impactful bug fixes, workflow changes.
- **Skip for:** Internal refactoring, dependency updates, minor bug fixes, documentation-only changes.

### Changelog Entry Format

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

---

## Knowledge Base Update Instructions

When creating proposals for the knowledge base in `DEVELOPMENT.md` (do not edit `AGENTS.md` for this), organize them as follows:

- **User Preferences & Instructions**: Directives (persistent commands) and Style/Conventions (general design preferences).
- **Repository & Project Context**: Purpose & Architecture (core patterns).
- **Environment & Execution**: Setup Commands and Execution Commands.

---

## Swarms, Worktrees, and Pull Request Workflows

- **Wave-Based Swarming**: When executing multi-task projects or addressing multiple issues:
  - Organize issues into logical waves of work (e.g., parallel optimization tasks vs authentication tasks).
  - Delegate independent issues to parallel subagents using the `invoke_subagent` tool.
- **Git Worktree Workspace Isolation**:
  - Always spawn subagents with `Workspace: "share"` configuration. This creates a lightweight git worktree branch mapping for each subagent, permitting parallel sandboxed workspaces without lockfile or source collisions.
  - Instruct subagents to create, build, and test inside their respective worktree paths.
- **Pull Request Creation**:
  - Never push changes directly to the remote `main` branch.
  - Subagents must commit their changes in their worktree, push the topic branch, and use the GitHub CLI (`gh pr create`) to open individual Pull Requests for user review.
- **Local Validation Gating**:
  - Never consider a task fully complete or merge a PR until the user has had an opportunity to build and test the changes locally (e.g. at `http://localhost:3000`).
  - Keep a dev server running or prompt the user with server details to confirm changes match their expectations before finalizing.
