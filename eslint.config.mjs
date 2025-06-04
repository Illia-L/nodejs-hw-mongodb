import js from '@eslint/js';
import globals from 'globals';
import json from '@eslint/json';
import { defineConfig } from 'eslint/config';
import pluginJs from '@eslint/js';

export default defineConfig([
  pluginJs.configs.recommended,
  { files: ['src/**/*.js'], plugins: { js }, extends: ['js/recommended'] },
  { files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.node } },
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
  },
  {
    rules: {
      semi: 'error',
      'no-unused-vars': ['error', { args: 'none' }],
      'no-undef': 'error',
    },
  },
]);
