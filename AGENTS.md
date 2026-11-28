# Ergogen Web UI: rules for every change

Ergogen Web UI is a React and Vite web interface for
[Ergogen](https://github.com/ergogen/ergogen). Read [README.md](README.md) for
setup and hosting, and see [DEVELOPMENT.md](DEVELOPMENT.md) for architecture,
validation, and procedures. These rules apply to people and coding agents.

## Dependencies and inputs

- Use only pnpm, matching the Node.js version in `.node-version` and the pnpm
  version in `packageManager`. Install dependencies with
  `pnpm install --frozen-lockfile`.
- Declare every directly imported package in `package.json`. Never rely on
  transitive hoisting.
- Canonical work uses the committed `package.json`, `pnpm-lock.yaml`, engine
  specifier, and footprint pins. Change them only on purpose, in review. Never
  commit inputs or generated previews from an engine experiment. See
  [Engine experiments](DEVELOPMENT.md#engine-experiments).

## Validation

- Run `pnpm precommit` before every commit and fix what it reports. When your
  change affects the build, run `pnpm validate`. For behavior visible in the
  browser, run `pnpm validate:extended` or `pnpm test:e2e`. See
  [Validation in DEVELOPMENT.md](DEVELOPMENT.md#validation) for all validation
  commands.
- Never skip, disable, or silently ignore a failing check. Fix failures that
  your change introduces. Report pre-existing failures and warnings separately
  with the command and output.
- A Vite build is not a type check.
- Where practical, write a failing test before you fix a bug or add behavior.
  Follow the arrange, act, assert pattern. Mock heavy work and keep global setup
  in `src/setupTests.tsx`. Run one test file with
  `pnpm exec vitest run <path> --reporter=verbose`.
- Select elements in tests by role, accessible name, or text. Use `data-testid`
  only as a fallback.

## Code style

- Prefer clear code over short code.
- Style components and global styles with `styled-components`. Do not use CSS
  files. Read colors and spacing from `src/theme/theme.ts`, and add a token
  instead of hardcoding values.
- Prefix styled-only props with `$`. Use inline `style` for values that change
  often, such as widths while dragging.
- Use semantic HTML and ARIA labels.
- Put ESLint rules only in `eslint.config.mjs`. Keep `vite.config.mts` as an
  `.mts` file.

## Documentation

- When behavior, configuration, or procedures change, keep `README.md` accurate
  for users and self-hosters and `DEVELOPMENT.md` accurate for contributors.
  Describe each procedure in one file and link to it from other files.

## Checks for each rule

Each row names the checks that fail when a change breaks the rule. A check ID is
`script:<name>` for a script in `package.json`, `eslint:<rule>` for a rule that
`eslint.config.mjs` turns on, `budget:<key>` for a key of `budgets.json`, or
`test:<path>` for a test file. `tests/rule-checks.test.ts` fails when a check ID
names nothing.

| Rule                                                         | Check                                                    | Status                                                                       |
| ------------------------------------------------------------ | -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Use only pnpm at the pinned versions, with a frozen lockfile | `test:tests/workflow-security.test.ts`                   | partly. It checks only the CI install. No task adds a local check.           |
| Declare every directly imported package                      | `script:lint`                                            | enforced. Knip reports an unlisted dependency.                               |
| Change the canonical inputs only on purpose, in review       | `test:tests/workflow-security.test.ts`                   | partly. CI must install them. #300 flags a changed pin for review.           |
| Commit no inputs or previews from an engine experiment       | `test:tests/engine-contract/preview-consistency.test.ts` | partly. It checks only previews. #300 flags a changed pin for review.        |
| Run `pnpm precommit`, `pnpm validate`, and the browser tests | `script:metrics`, `script:test:e2e`                      | partly. CI runs them per pull request, not per commit. No task adds a check. |
| Never skip, disable, or silently ignore a failing check      | `script:test:reports`, `budget:eslint_disable`           | partly. A deleted test passes. #300 flags it for review.                     |
| Fix new failures, and report old ones with their output      | `script:metrics`                                         | partly. Nothing checks the report. No task adds a check.                     |
| Do not count a Vite build as a type check                    | `script:typecheck`                                       | enforced.                                                                    |
| Write a failing test first, in arrange, act, assert          | none                                                     | unenforced. No task adds a check.                                            |
| Mock heavy work, with global setup in `src/setupTests.tsx`   | none                                                     | unenforced. No task adds a check.                                            |
| Select by role, name, or text before `data-testid`           | `budget:by_test_id`                                      | unenforced. The budget only stops growth. #349 adds the check.               |
| Prefer clear code over short code                            | none                                                     | unenforced. No task adds a check.                                            |
| Style with `styled-components`, with no CSS files            | none                                                     | unenforced. No task adds a check.                                            |
| Read colors and spacing from `src/theme/theme.ts`            | none                                                     | unenforced. #348 checks hex colors. No task checks spacing.                  |
| Prefix styled-only props with `$`                            | none                                                     | unenforced. No task adds a check.                                            |
| Use inline `style` for values that change often              | none                                                     | unenforced. No task adds a check.                                            |
| Use semantic HTML                                            | `eslint:jsx-a11y/no-static-element-interactions`         | partly. Lint reads only JSX source. #372 runs axe in every journey.          |
| Use ARIA labels                                              | none                                                     | unenforced. #372 runs axe in every journey.                                  |
| Put ESLint rules only in `eslint.config.mjs`                 | `budget:eslint_disable`                                  | unenforced. The budget only caps `eslint-disable`. No task adds a check.     |
| Keep `vite.config.mts` as an `.mts` file                     | `test:tests/build-version.test.ts`                       | enforced.                                                                    |
| Keep README.md and DEVELOPMENT.md accurate                   | `test:tests/markdown-links.test.ts`                      | partly. It finds only broken relative links. No task adds a check.           |
| Describe each procedure in one file, and link to it          | none                                                     | unenforced. No task adds a check.                                            |
