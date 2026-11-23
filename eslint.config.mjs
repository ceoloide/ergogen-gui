import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import prettierConfig from 'eslint-config-prettier';
import eslint from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import jest from 'eslint-plugin-jest';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import path from 'node:path';

const LAYER_ORDER = [
  'types',
  'theme',
  'utils',
  'workers',
  'hooks',
  'context',
  'atoms',
  'molecules',
  'organisms',
  'pages',
];

// R20-10 (#283) removes these imports.
const LAYER_EXCEPTIONS = [
  {
    file: 'src/atoms/Header.tsx',
    imports: 'src/molecules/ShareDialog.tsx',
    expires: '2027-01-31',
  },
  {
    file: 'src/utils/zip.ts',
    imports: 'src/workers/ergogen.worker.types.ts',
    expires: '2027-01-31',
  },
  {
    file: 'src/utils/zip.ts',
    imports: 'src/workers/workerFactory.ts',
    expires: '2027-01-31',
  },
];

const today = new Date().toISOString().slice(0, 10);
const activeLayerExceptions = LAYER_EXCEPTIONS.filter(
  ({ expires }) => today <= expires
);

function layerOrderRule(exceptions) {
  const zones = LAYER_ORDER.flatMap((layer, index) =>
    LAYER_ORDER.slice(index + 1).map((laterLayer) => {
      const from = `src/${laterLayer}`;
      return {
        target: `src/${layer}`,
        from,
        except: exceptions
          .filter(({ imports }) => imports.startsWith(`${from}/`))
          .map(({ imports }) => `./${path.relative(from, imports)}`),
        message: `src/${layer} must not import ${from}. A folder imports only from the folders before it in ${LAYER_ORDER.join(', ')}. Move what both need to an earlier folder, such as a shared type to src/types.`,
      };
    })
  );
  return ['error', { basePath: import.meta.dirname, zones }];
}

export default tseslint.config(
  {
    ignores: [
      'build',
      'dist',
      'node_modules',
      '.tools',
      '.generated',
      'reports',
      '**/*.timestamp-*.mjs',
      'public',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...reactRecommended,
    files: ['src/**/*.{ts,tsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  prettierConfig,
  {
    files: [
      'scripts/**/*.{js,mjs,ts,mts}',
      '*.{js,mjs,ts,mts}',
      'tests/**/*.ts',
      'e2e/**/*.ts',
    ],
    languageOptions: { globals: globals.node },
  },
  {
    // CommonJS: Node scripts, and the footprint index copied into the engine.
    files: ['scripts/**/*.js', 'patch/**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    // Ergogen injections: the app's evaluator supplies `module` and `require`.
    files: ['tests/engine-contract/corpus/footprints/**/*.js'],
    languageOptions: { sourceType: 'commonjs', globals: globals.commonjs },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    // Use explicit react-hooks rules to avoid config shape mismatches across versions
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      ...jsxA11y.configs.recommended.rules,
      'import/no-cycle': 'error',
      'import/no-restricted-paths': layerOrderRule([]),
    },
    // eslint-plugin-import skips modules it cannot resolve, and by default it
    // resolves only .js files, so without these both rules pass silently.
    settings: {
      'import/extensions': ['.ts', '.tsx'],
      'import/resolver': { node: { extensions: ['.ts', '.tsx'] } },
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  ...Object.entries(
    Object.groupBy(activeLayerExceptions, ({ file }) => file)
  ).map(([file, exceptions]) => ({
    files: [file],
    rules: { 'import/no-restricted-paths': layerOrderRule(exceptions) },
  })),
  {
    files: ['src/**/*.test.{ts,tsx}', 'src/setupTests.tsx'],
    ...jest.configs['flat/recommended'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      // Tests often use flexible types and throwaway params
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    files: ['scripts/ga/ga-config.test.mjs'],
    languageOptions: { globals: globals.browser },
  },
  // Allow permissive typing in declaration files
  {
    files: ['src/**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  // Workers and service workers configurations
  {
    files: ['src/workers/**/*.ts', 'src/service-worker.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
    languageOptions: {
      globals: {
        ...globals.worker,
        ...globals.serviceworker,
      },
    },
  }
);
