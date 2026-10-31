import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

// O lint cobre o código do produto (Portfólio Creator). O site da Carol (em produção) fica fora até
// alguém pedir para mexer nele.
const PRODUTO = [
  'src/app/**',
  'src/blocks/**',
  'src/themes/**',
  'src/lib/**',
  'src/server/**',
  'src/pages/app/**',
  'src/pages/api/**',
  'e2e/**',
  'playwright.config.ts',
  'vitest.config.ts',
];

export default defineConfig(
  { ignores: ['src/lib/banco.tipos.ts', 'dist/**', '.astro/**', 'node_modules/**', '.wrangler/**', 'test-results/**'] },
  {
    files: PRODUTO,
    extends: [js.configs.recommended, ...tseslint.configs.recommended, ...astro.configs.recommended],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  { files: ['src/app/**/*.tsx', 'src/blocks/**/*.tsx'], extends: [reactHooks.configs.flat.recommended] },
);
