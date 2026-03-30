/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./assets/styles/**/*.{css,scss}"
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#f5f5f5',
        },
        foreground: {
          DEFAULT: '#22223a',
        },
      },
    },
  },
  plugins: [],
};

export default config;
