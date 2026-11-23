# Ergogen Web UI: rules for every change

Ergogen Web UI is a React and Vite web interface for
[Ergogen](https://github.com/ergogen/ergogen). Read [README.md](README.md) for
setup and hosting, and see [DEVELOPMENT.md](DEVELOPMENT.md) for architecture,
validation, and procedures. These rules apply to people and coding agents.

## Dependencies and inputs

- Use only pnpm, matching the Node.js version in `.node-version` and the pnpm
  version in `packageManager`. Install dependencies with
  `PNPM_CONFIG_BLOCK_EXOTIC_SUBDEPS=false pnpm install --frozen-lockfile`. Keep
  that prefix on every `pnpm install` or `pnpm add`.
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
