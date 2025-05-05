import ts from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    ignores: ['dist', 'build', 'coverage', '.turbo', '.pnpm-store'],
    languageOptions: {
      parser,
      parserOptions: { project: ['./tsconfig.json'], tsconfigRootDir: import.meta.dirname },
    },
    plugins: {
      '@typescript-eslint': ts,
      import: importPlugin,
      'unused-imports': unusedImports,
      react,
      'react-hooks': reactHooks,
      jsxA11y,
    },
    rules: {
      // TypeScript‑specific
      '@typescript-eslint/consistent-type-imports': 'warn',

      // Import hygiene
      'unused-imports/no-unused-imports': 'error',
      'import/order': ['warn', { 'newlines-between': 'always' }],

      // React
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
  },

  // keep this LAST – disables rules that conflict with prettier
  prettier,
];
