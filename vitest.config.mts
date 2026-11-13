import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
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
    outputFile: { junit: './reports/unit.xml' },
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
    ],
  },
});
