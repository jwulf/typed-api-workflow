import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint";
import enforceEventuallyRule from "./enforce-eventually-usage.js";

// Define a minimal custom plugin object so ESLint can resolve the rule id 'custom/enforce-eventually-usage'
// Provide rule inline instead of a plugin package; we can reference it via its key directly
const customPlugin = {
  rules: {
    'enforce-eventually-usage': enforceEventuallyRule,
  },
};

export default defineConfig([
  // Base JS/TS files config including our custom rule
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
  plugins: { js, '@typescript-eslint': tseslint.plugin, custom: customPlugin },
    extends: ["js/recommended"],
    languageOptions: {
      parser: tseslint.parser,
      globals: globals.browser,
    },
    rules: {
      'custom/enforce-eventually-usage': 'error',
    },
  },
  // Apply recommended TypeScript ESLint settings after, to augment (not override) unless conflicting
  ...tseslint.configs.recommended,
]);
