import { describe, expect, it, test } from 'vitest'
import { detectSocialMedia } from '../socialLinkParser'

describe('socialLinkParser', () => {
  test('should return facebook', () => {
    expect(detectSocialMedia('https://www.facebook.com/')).toBe('facebook')
    expect(detectSocialMedia('https://www.messenger.com/')).toBe('facebook')
    expect(detectSocialMedia('https://www.fb.com/')).toBe('facebook')
    expect(detectSocialMedia('https://www.fb.me/')).toBe('facebook')
  })

  it('should return x', () => {
    expect(detectSocialMedia('https://www.x.com/')).toBe('x')
    expect(detectSocialMedia('https://www.twitter.com/')).toBe('x')
    expect(detectSocialMedia('https://t.co/')).toBe('x')
  })

  it('should return instagram', () => {
    expect(detectSocialMedia('https://www.instagram.com/')).toBe('instagram')
  })

  it('should return medium', () => {
    expect(detectSocialMedia('https://www.medium.com/')).toBe('medium')
  })

  it('should return discord', () => {
    expect(detectSocialMedia('https://www.discord.com/')).toBe('discord')
    expect(detectSocialMedia('https://www.discordapp.com/')).toBe('discord')
    expect(detectSocialMedia('https://www.discord.gg/')).toBe('discord')
  })

  it('should return snapchat', () => {
    expect(detectSocialMedia('https://www.snapchat.com/')).toBe('snapchat')
  })

  it('should return whatsapp', () => {
    expect(detectSocialMedia('https://www.whatsapp.com/')).toBe('whatsapp')
    expect(detectSocialMedia('https://wa.me/')).toBe('whatsapp')
  })

  it('should return telegram', () => {
    expect(detectSocialMedia('https://www.telegram.com/')).toBe('telegram')
    expect(detectSocialMedia('https://t.me/')).toBe('telegram')
  })

  it('should return linkedin', () => {
    expect(detectSocialMedia('https://www.linkedin.com/')).toBe('linkedin')
  })

  it('should return github', () => {
    expect(detectSocialMedia('https://www.github.com/')).toBe('github')
  })

  it('should return universal-page', () => {
    expect(detectSocialMedia('https://www.universal.page/')).toBe(
      'universal-page'
    )
  })

  it('should return for an invalid url', () => {
    expect(detectSocialMedia('https://www.example.com/')).toBeUndefined()
    expect(detectSocialMedia('')).toBeUndefined()
    expect(detectSocialMedia()).toBeUndefined()
  })
})
