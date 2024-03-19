const plugin = require('tailwindcss/plugin')

const wordBreakPlugin = plugin(function ({ addUtilities, theme, e }) {
  const values = theme('wordBreak')
  var utilities = Object.entries(values).map(([key, value]) => {
    return {
      [`.${e(`break-${key}`)}`]: { wordBreak: `${value}` },
    }
  })
  addUtilities(utilities)
})

const scrollbarGutter = plugin(function ({ addUtilities }) {
  addUtilities([
    {
      '.scrollbar-gutter-auto': {
        'scrollbar-gutter': 'auto',
      },
      '.scrollbar-stable': {
        'scrollbar-gutter': 'stable',
      },
      '.scrollbar-both-edges': {
        'scrollbar-gutter': 'stable both-edges',
      },
    },
  ])
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
    },
  },
  plugins: [wordBreakPlugin, scrollbarGutter],
}
