import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Tests that assert what the canonical engine generates. They run unless
// ERGOGEN_VERSION selects another engine, as a deployment override does; that
// run keeps the GUI tests and tests/engine-smoke.test.ts. `pnpm test:contract`
// (mode "contract") runs them with any engine. See DEVELOPMENT.md, "Engine
// contract tests".
const contractTests = 'tests/engine-contract/**';

export default defineConfig(({ mode }) => {
  const contractRun = mode === 'contract';
  const overrideEngine = process.env.ERGOGEN_VERSION?.trim() ?? '';
  const excludeContract = !contractRun && overrideEngine !== '';
  // Other tools, such as Knip, also load this file; only a test run says it.
  if (excludeContract && process.env.VITEST) {
    console.log(
      `[vitest] ERGOGEN_VERSION=${overrideEngine}: excluding ${contractTests} (engine contract tests); run them with pnpm test:contract.`
    );
  }

  return {
    resolve: {
      alias: [
        {
          find: /^ergogen(?=\/|$)/,
          replacement: fileURLToPath(
            new URL('./node_modules/.ergogen-engine', import.meta.url)
          ),
        },
      ],
    },
    plugins: [react()],
    test: {
      globals: true,
      include: [
        'src/**/*.test.{ts,tsx}',
        'tests/**/*.test.ts',
        'scripts/**/*.test.mjs',
      ],
      reporters: ['default', 'junit'],
      outputFile: {
        junit: contractRun ? './reports/contract.xml' : './reports/unit.xml',
      },
      environment: 'jsdom',
      setupFiles: './src/setupTests.tsx',
      css: true,
      exclude: [
        'node_modules',
        'dist',
        '.git',
        '.cache',
        'e2e',
        '.generated',
        '.tools',
        ...(excludeContract ? [contractTests] : []),
      ],
    },
  };
});
