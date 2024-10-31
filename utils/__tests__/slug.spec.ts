import { describe, expect, it } from 'vitest'

import { slug } from '../slug'

describe('slug', () => {
  it('returns an empty string for undefined or empty input', () => {
    expect(slug()).toBe('')
    // @ts-expect-error
    expect(slug(null)).toBe('')
    expect(slug('')).toBe('')
  })

  it('converts all characters to lowercase', () => {
    expect(slug('TEST')).toBe('test')
  })

  it('converts spaces to hyphens', () => {
    expect(slug('some attribute')).toBe('some-attribute')
  })

  it('replaces non-alphanumeric characters with hyphens', () => {
    expect(slug('test@slug')).toBe('test-slug')
  })

  it('removes leading and trailing hyphens', () => {
    expect(slug('-test-slug-')).toBe('test-slug')
  })

  it('reduces multiple hyphens to a single one', () => {
    expect(slug('test---slug')).toBe('test-slug')
  })
})
