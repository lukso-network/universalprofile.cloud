import { expect } from '@playwright/test'

import { test } from './helpers/fixtures'

test('landing page when no browser extension', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL('/')
  await expect(page).toHaveScreenshot('landing-no-extension.png')
})
