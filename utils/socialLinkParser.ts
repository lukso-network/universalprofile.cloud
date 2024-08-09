const SOCIAL_MEDIA = {
  facebook: ['facebook.com', 'messenger.com', 'fb.com', 'fb.me'],
  x: ['x.com', 'twitter.com', 't.co'],
  instagram: ['instagram.com'],
  medium: ['medium.com'],
  discord: ['discord.com', 'discordapp.com', 'discord.gg'],
  snapchat: ['snapchat.com'],
  whatsapp: ['whatsapp.com', 'wa.me'],
  telegram: ['telegram.com', 't.me'],
  linkedin: ['linkedin.com'],
  github: ['github.com'],
  'universal-page': ['universal.page'],
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

  const hostname = new URL(url).hostname

  for (const [key, domains] of Object.entries(SOCIAL_MEDIA)) {
    if (domains.includes(hostname.replace('www.', ''))) {
      return key
    }
  }
}
