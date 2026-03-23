/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bci: {
          50:  '#E8F2FC',
          100: '#C5DFF7',
          200: '#9FCBF2',
          300: '#78B6EC',
          400: '#5AA7E8',
          500: '#3D97E3',
          600: '#2080D0',
          700: '#1366B5',
          800: '#0A4E98',
          900: '#003087',
          950: '#001E5C',
        },
      },
    },
  },
  plugins: [],
};
