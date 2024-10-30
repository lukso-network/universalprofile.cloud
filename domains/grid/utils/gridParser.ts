export type RegexWithCallback = {
  regex: RegExp
  callback: (url: string) => Promise<string | undefined>
}

export type PlatformParsingParameters = {
  type: GridWidgetType
  embedRegex: RegExp
  secondaryRegexesWithCallbacks?: RegexWithCallback[]
  constantProperties?: Record<string, string>
}

export const parsePlatformInput = async (
  platform: GridWidgetType,
  input: string
) => {
  const platformParsingParameters = PLATFORM_PARSING_PARAMETERS[platform]

  if (!platformParsingParameters) {
    throw new Error('Invalid platform')
  }

  // Check if the input matches the embed regex
  try {
    return parsePlatformEmbed(input, platformParsingParameters)
  } catch {}

  const { secondaryRegexesWithCallbacks } = platformParsingParameters

  if (!secondaryRegexesWithCallbacks) {
    throw new Error('Invalid input')
  }

  // Check if the input matches a secondary regex
  let callbackResult: string | undefined

  for (const { regex, callback } of secondaryRegexesWithCallbacks) {
    const match = input.match(regex)

    if (match) {
      callbackResult = await callback(match[0])

      break
    }
  }

  if (!callbackResult) {
    throw new Error('Invalid input')
  }

  return parsePlatformEmbed(callbackResult, platformParsingParameters)
}

const parsePlatformEmbed = (
  input: string,
  platformParsingParameters: PlatformParsingParameters
) => {
  const { embedRegex, constantProperties } = platformParsingParameters
  const match = input.match(embedRegex)

  if (!match) {
    throw new Error('Invalid input')
  }

  const { groups } = match
  let extractedProperties: Record<string, string> = {}

  if (groups) {
    // Extract the  properties from capture groups from the regex match
    extractedProperties = Object.entries(groups).reduce(
      (acc: Record<string, string>, [key, value]) => {
        if (value) acc[key] = value

        return acc
      },
      {}
    )
  }

  return {
    src: match[0],
    ...constantProperties,
    ...extractedProperties,
  }
}

export async function getSoundCloudOEmbed(
  url: string
): Promise<string | undefined> {
  const encodedUrl = encodeURI(url)
  const response = await fetch(
    `https://soundcloud.com/oembed?url=${encodedUrl}&format=json`
  )

  return response.ok ? ((await response.json())?.html as string) : undefined
}

export async function getSpotifyOEmbed(
  url: string
): Promise<string | undefined> {
  const response = await fetch(
    `https://open.spotify.com/oembed?url=${url}&format=json`
  )

  return response.ok ? ((await response.json())?.html as string) : undefined
}

export async function getXOEmbedFromHandle(handle: string) {
  const response = await fetch(
    `https://publish.twitter.com/oembed?url=https://twitter.com/${handle.replace('@', '')}`
  )

  return response.ok ? ((await response.json())?.html as string) : undefined
}

export function sanitizeXEmbedUrl(url: string): string {
  let newUrl = url.replace('x.com', 'twitter.com')

  if (!newUrl.startsWith('https://')) {
    newUrl = `https://${newUrl}`
  }

  return newUrl
}

export function sanitizeYoutubeEmbedUrl(url: string): string {
  let newUrl = url.replace('watch?v=', 'embed/')

  if (!url.startsWith('https://')) {
    newUrl = `https://${newUrl}`
  }

  return newUrl
}
