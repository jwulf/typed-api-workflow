// Flat config for ESLint v8 (experimental but supported with --config)
const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('typescript-eslint');
const enforceEventuallyRule = require('./enforce-eventually-usage.js');

const customPlugin = {
  rules: {
    'enforce-eventually-usage': enforceEventuallyRule,
  },
};

module.exports = [
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js, '@typescript-eslint': tseslint.plugin, custom: customPlugin },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      globals: globals.browser,
    },
    rules: {
      'custom/enforce-eventually-usage': 'error',
    },
  },
  ...tseslint.configs.recommended,
];
