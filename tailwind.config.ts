import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050816',
        panel: '#0B1020',
        electric: '#38BDF8'
      }
    }
  },
  plugins: []
};

export default config;
