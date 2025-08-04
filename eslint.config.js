// ESLint v9 flat config
import js from '@eslint/js';
import globals from 'globals';
import n from 'eslint-plugin-n';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default [
  // Global ignores
  { ignores: ['node_modules', 'dist', 'coverage'] },

  // Language options for ESM on Node 22
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: { ...globals.node }
    }
  },

  // ESLint core recommended
  js.configs.recommended,

  // Node.js rules (ESM)
  n.configs['flat/recommended-module'],

  // Turn off rules that conflict with Prettier
  eslintConfigPrettier
];
