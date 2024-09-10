const SOCIAL_MEDIA = {
  facebook: ['facebook.com', 'messenger.com', 'fb.com', 'fb.me'],
  x: ['x.com', 'twitter.com', 't.co'],
  instagram: ['instagram.com'],
  medium: ['medium.com'],
  discord: ['discord.com', 'discordapp.com', 'discord.gg'],
  snapchat: ['snapchat.com'],
  whatsapp: ['whatsapp.com', 'wa.me'],
  telegram: ['telegram.com', 't.me', 'telegram.org'],
  linkedin: ['linkedin.com'],
  github: ['github.com'],
  'universal-page': ['universal.page'],
  youtube: ['youtube.com', 'youtu.be'],
}

/**
 * Detect social media from a given URL
 *
 * @param url
 * @returns
 */
export const detectSocialMedia = (url?: string) => {
  if (!url) {
    return
  }

  try {
    const hostname = new URL(url).hostname

    for (const [key, domains] of Object.entries(SOCIAL_MEDIA)) {
      const hostnameFormatted = hostname.replace('www.', '')
      const match = domains.some(domain =>
        new RegExp(`\\b${domain}\\b`, 'i').test(hostnameFormatted)
      )

      if (match) {
        return key
      }
    }
  } catch {
    return
  }
}
