import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import astroEslintPlugin from 'eslint-plugin-astro';
import reactPlugin from 'eslint-plugin-react';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,

  // TypeScript設定
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        MutationObserver: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLInputElement: 'readonly',
        MouseEvent: 'readonly',
        KeyboardEvent: 'readonly',
        Node: 'readonly',
        IntersectionObserver: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        HTMLImageElement: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      react: reactPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off', // TypeScriptを使用しているため無効化
      'react/react-in-jsx-scope': 'off', // React 17+では不要
    },
  },

  // Astroファイル設定
  ...astroEslintPlugin.configs.recommended,

  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroEslintPlugin.parser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
  },

  // 共通設定
  {
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'off', // TypeScript用の@typescript-eslint/no-unused-varsを優先
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // Prettierとの統合（ESLintとPrettierの競合を回避）
  eslintConfigPrettier,

  // 除外設定
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.astro/',
      'public/',
      'src/content/',
      '*.config.js',
      '*.config.mjs',
    ],
  },
];
