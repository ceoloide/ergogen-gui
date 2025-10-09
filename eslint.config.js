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
  ...reactHooks.configs['flat/recommended'].map((config) => ({
    ...config,
    files: ['src/**/*.{ts,tsx}'],
  })),
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
    files: ['src/**/*.test.{ts,tsx}', 'src/setupTests.js'],
    plugins: {
      jest: jest,
    },
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...jest.configs['flat/recommended'].rules,
      '@typescript-eslint/no-require-imports': 'off',
    },
  }
);
