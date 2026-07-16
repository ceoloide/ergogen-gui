import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import prettierConfig from 'eslint-config-prettier';
import eslint from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import jest from 'eslint-plugin-jest';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  {
    ignores: ['build', 'node_modules', 'patch', 'public'],
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
