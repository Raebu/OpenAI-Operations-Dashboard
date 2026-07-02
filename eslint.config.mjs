export default [
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
