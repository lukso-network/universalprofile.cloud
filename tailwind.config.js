const plugin = require('tailwindcss/plugin')

const wordBreakPlugin = plugin(({ addUtilities, theme, e }) => {
  const values = theme('wordBreak')
  const utilities = Object.entries(values).map(([key, value]) => {
    return {
      [`.${e(`break-${key}`)}`]: { wordBreak: `${value}` },
    }
  })
  addUtilities(utilities)
})

module.exports = {
  presets: [require('@lukso/web-components/tailwind.config')],
  theme: {
    extend: {
      maxWidth: {
        content: '880px',
      },
      wordBreak: {
        word: 'break-word',
      },
      transitionProperty: {
        width: 'width',
      },
      animation: {
        'fade-in-20': 'fade-in-20 0.5s ease-in-out',
      },
      keyframes: {
        'fade-in-20': {
          '0%': { opacity: '0' },
          '100%': { opacity: '0.2' },
        },
      },
    },
  },
  plugins: [wordBreakPlugin],
}
