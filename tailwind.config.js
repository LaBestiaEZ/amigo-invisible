/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#667eea',
          light: '#7c8ef0',
          dark: '#5a6fd1',
        },
        secondary: {
          DEFAULT: '#764ba2',
          light: '#8a5fb8',
          dark: '#64408a',
        },
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
    },
  },
  plugins: [],
}
