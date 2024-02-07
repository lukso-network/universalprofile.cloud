import {
  validateTags,
  validateLinks,
  validateName,
  validateDescription,
} from '../validateLsp3Metadata'
import { expect, test } from '@playwright/test'

test('validateTags', async ({ page }) => {
  expect(validateTags([])).toEqual([])
  expect(validateTags(['tag1', ''])).toEqual(['tag1'])
  expect(validateTags(['tag1', 'tag2', 'tag3', 'tag4'])).toEqual([
    'tag1',
    'tag2',
    'tag3',
  ])
  expect(validateTags([123, 'tag2', { test: '123' }, 'tag4'])).toEqual(['tag2'])
})

test('validateLinks', async ({ page }) => {
  expect(validateLinks([])).toEqual([])
  expect(
    validateLinks([
      'link1',
      { title: 'link1', url: 'url1' },
      { title: '', url: 'url2' },
    ])
  ).toEqual([{ title: 'link1', url: 'url1' }])
})

test('validateName', async ({ page }) => {
  expect(validateName([])).toEqual('')
  expect(validateName(123)).toEqual('')
  expect(validateName('CoolBro')).toEqual('coolbro')
})

test('validateDescription', async ({ page }) => {
  expect(validateDescription([])).toEqual('')
  expect(validateDescription(123)).toEqual('')
  expect(
    validateDescription(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    )
  ).toEqual(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut a'
  )
})
