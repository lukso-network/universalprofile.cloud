import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'happy-dom',
    exclude: ['**/tests/e2e/**', '**/node_modules/**'],
    globals: true,
  },
})
