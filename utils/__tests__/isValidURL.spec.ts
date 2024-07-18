import { describe, it, expect } from 'vitest'
import { isValidURL } from '../isValidURL'

describe('isValidURL', () => {
  it('should return false for undefined', () => {
    expect(isValidURL(undefined)).toBe(false)
  })

  it('should return false for an empty string', () => {
    expect(isValidURL('')).toBe(false)
  })

  it('should return false for an invalid URL string', () => {
    expect(isValidURL('invalidurl')).toBe(false)
  })

  it('should return true for a valid HTTP URL', () => {
    expect(isValidURL('http://example.com')).toBe(true)
  })

  it('should return true for a valid HTTPS URL', () => {
    expect(isValidURL('https://example.com')).toBe(true)
  })

  it('should return true for a URL with query parameters', () => {
    expect(isValidURL('https://example.com?query=123')).toBe(true)
  })
})
