/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#16161b',
        lighterBlack: '#1D1D21',
        darkGray: '#29292f',
        deepPink: '#EB7E8A',
        lightPink: '#F7C6C8',
      },
    },
  },
  plugins: [],
};
