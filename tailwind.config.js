/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@lukso/web-components/tailwind.config')],
  theme: {
    extend: {
      maxWidth: {
        content: '870px',
      },
    },
  },
  plugins: [],
}
