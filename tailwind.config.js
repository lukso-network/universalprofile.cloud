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
      backgroundImage: {
        'dashed-border': `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%239CB6C9FF' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
      },
    },
  },
  plugins: [wordBreakPlugin],
}
