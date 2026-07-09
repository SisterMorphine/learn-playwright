import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import playwright from 'eslint-plugin-playwright';
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["**/*.js", "**/*.cjs", "**/*.mjs"]),
  { files: ["**/*.{ts}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.ts'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-wait-for-timeout': 'error',
      'playwright/missing-playwright-await': 'error',
      'playwright/prefer-web-first-assertions': 'error',
      'playwright/no-force-option': 'warn',
    }
  }
]);