# Ergogen Web UI: rules for every change

A React and Vite web interface for [Ergogen](https://github.com/ergogen/ergogen).
Read [README.md](README.md) for setup and hosting and
[DEVELOPMENT.md](DEVELOPMENT.md) for architecture, validation and procedures.
These rules apply to people and coding agents alike.

## Dependencies and inputs

- Use pnpm only, at the versions in `.node-version` and `packageManager`. Install
  with `PNPM_CONFIG_BLOCK_EXOTIC_SUBDEPS=false pnpm install --frozen-lockfile`;
  keep the prefix on every `pnpm install` or `pnpm add`.
- Declare every directly imported package in `package.json`; never rely on
  transitive hoisting.
- Canonical work uses the committed `package.json`, `pnpm-lock.yaml`, engine
  specifier and footprint pins. Change them only on purpose, in review. Never
  commit inputs or generated previews from an engine experiment
  ([procedure](DEVELOPMENT.md#engine-experiments)).

## Validation

- Run `pnpm precommit` before every commit and fix what it reports. Use
  `pnpm validate` when the build is affected and `pnpm validate:extended` (or
  `pnpm test:e2e`) for behavior visible in the browser. Commands are described in
  [DEVELOPMENT.md](DEVELOPMENT.md#validation).
- Never skip, disable or silently ignore a failing check. Fix failures your change
  introduces; report pre-existing failures and warnings separately, with the
  command and output.
- A Vite build is not a type check.
- Write a failing test before fixing a bug or adding behavior where practical.
  Arrange, act, assert; mock heavy work; keep global setup in
  `src/setupTests.tsx`. Run one file with
  `pnpm exec vitest run <path> --reporter=verbose`.
- Select elements in tests by role, accessible name or text; use `data-testid`
  only as a fallback.

## Code style

- Prefer clear code over short code.
- Style with `styled-components`, including global styles; no CSS files. Colors
  and spacing come from `src/theme/theme.ts`; add a token rather than hardcoding.
- Prefix styled-only props with `$`. Use inline `style` for values that change
  often, such as widths while dragging.
- Use semantic HTML and ARIA labels.
- ESLint rules live only in `eslint.config.mjs`. Keep `vite.config.mts` as an
  `.mts` file.

## Documentation

- Keep `README.md` (users and self-hosters) and `DEVELOPMENT.md` (contributors)
  accurate when behavior, configuration or procedures change. Describe each
  procedure in one file and link to it from others.
