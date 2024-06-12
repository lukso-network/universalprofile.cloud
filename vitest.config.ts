import { defineVitestConfig } from '@nuxt/test-utils/config'
import { config } from 'dotenv'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    exclude: ['**/tests/e2e/**', '**/node_modules/**'],
    globals: true,
    env: {
      ...config({ path: './.env' }).parsed,
    },
  },
})
