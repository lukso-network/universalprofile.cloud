import { expect } from '@playwright/test'

import { test } from './helpers/fixtures'

test('can access 404 page', async ({ page }) => {
  await page.goto('/404')
  await expect(page).toHaveURL('/404')
  await expect(page).toHaveScreenshot('404.png')
})

test('whe page not found it redirect to 404 page', async ({ page }) => {
  await page.goto('/1234')
  await expect(page).toHaveURL('/404')
  await expect(page).toHaveScreenshot('404.png')
})
