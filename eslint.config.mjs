import nextTs from 'eslint-config-next/typescript';

export default [
  ...nextTs,
  {
    ignores: ['.next/**', 'node_modules/**', 'coverage/**', 'dist/**']
  },
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    rules: {
      'no-console': 'warn'
    }
  }
];
