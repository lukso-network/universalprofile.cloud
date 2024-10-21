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

const PLATFORM_PARSING_PARAMETERS: Record<
  GridWidgetType,
  PlatformParsingParameters | undefined
> = {
  [GRID_WIDGET_TYPE.TITLE_LINK]: undefined,
  [GRID_WIDGET_TYPE.TEXT]: undefined,
  [GRID_WIDGET_TYPE.IFRAME]: undefined,
  [GRID_WIDGET_TYPE.IMAGE]: undefined,
  [GRID_WIDGET_TYPE.X]: {
    type: GRID_WIDGET_TYPE.X,
    embedRegex:
      /https?:\/\/twitter\.com\/(?<handle>[a-zA-Z0-9_]+)(?:\/status\/(?<id>\d+))?(?:\?[^"'\s]*)?/,
    secondaryRegexesWithCallbacks: [
      // Match a handle with @ symbol
      {
        regex: /@([a-zA-Z0-9_]{1,15})/,
        callback: getXOEmbedFromHandle,
      },
      // Match a Twitter URL with or without https www and status
      {
        regex:
          /(https?:\/\/)?(?:x\.com|twitter\.com)\/[a-zA-Z0-9_]+(?:\/status\/(\d+))?/,
        callback: async url => sanitizeXEmbedUrl(url),
      },
    ],
  },
  [GRID_WIDGET_TYPE.INSTAGRAM]: {
    type: GRID_WIDGET_TYPE.INSTAGRAM,
    embedRegex:
      /https:\/\/www\.instagram\.com\/(?<type>p|reel|profile|tv)\/(?<id>[\w-]+)\/(?<params>\?[^"]*)?/,
  },
  [GRID_WIDGET_TYPE.WARPCAST]: undefined,
  [GRID_WIDGET_TYPE.SPOTIFY]: {
    type: GRID_WIDGET_TYPE.IFRAME,
    embedRegex:
      /https?:\/\/(?:open\.)?spotify\.com\/embed\/?(?<type>track|playlist|artist)\/(?<id>[^?]+)(?:\?utm_source=(?:generator|oembed))?(?:&theme=(?<theme>\d))?/,
    secondaryRegexesWithCallbacks: [
      {
        regex:
          /https:\/\/open\.spotify\.com\/(?<type>track|playlist|artist)\/(?<id>[^?]+)/,
        callback: getSpotifyOEmbed,
      },
    ],
    constantProperties: {
      allow:
        'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
    },
  },
  [GRID_WIDGET_TYPE.SOUNDCLOUD]: {
    type: GRID_WIDGET_TYPE.IFRAME,
    embedRegex:
      /https?:\/\/w\.soundcloud\.com\/player\/\?(?:(?!url=https).)*url=https(?::|%3A)(?:\/|%2F){2}api\.soundcloud\.com(?:\/|%2F)(?<type>tracks|playlists|users)(?:\/|%2F)\d+(?:[^"]*)?/,
    secondaryRegexesWithCallbacks: [
      {
        regex:
          /https:\/\/soundcloud\.com\/([a-zA-Z0-9_-]+)(?:\/(sets\/[a-zA-Z0-9_-]+|[a-zA-Z0-9_-]+))?\/?/,
        callback: getSoundCloudOEmbed,
      },
    ],
    constantProperties: {
      allow:
        'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
    },
  },
  [GRID_WIDGET_TYPE.YOUTUBE]: {
    type: GRID_WIDGET_TYPE.YOUTUBE,
    embedRegex: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
    secondaryRegexesWithCallbacks: [
      {
        regex: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
        callback: async url => sanitizeYoutubeEmbedUrl(url),
      },
    ],
    constantProperties: {
      allow:
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
    },
  },
  [GRID_WIDGET_TYPE.ADD_CONTENT]: undefined,
}

export const parsePlatformInput = async (
  platform: GridWidgetType,
  input: string
): Promise<GridWidgetProperties | never> => {
  const platformParsingParameters = PLATFORM_PARSING_PARAMETERS[platform]
  if (!platformParsingParameters) throw new Error('Invalid platform')

  // Check if the input matches the embed regex
  try {
    return parsePlatformEmbed(input, platformParsingParameters)
  } catch {}

  const { secondaryRegexesWithCallbacks } = platformParsingParameters
  if (!secondaryRegexesWithCallbacks) throw new Error('Invalid input')

  // Check if the input matches a secondary regex
  let callbackResult: string | undefined
  for (const { regex, callback } of secondaryRegexesWithCallbacks) {
    const match = input.match(regex)

    if (match) {
      callbackResult = await callback(match[0])

      break
    }
  }

  if (!callbackResult) throw new Error('Invalid input')

  return parsePlatformEmbed(callbackResult, platformParsingParameters)
}

const parsePlatformEmbed = (
  input: string,
  platformParsingParameters: PlatformParsingParameters
): GridWidgetProperties | never => {
  const { embedRegex, constantProperties } = platformParsingParameters
  const match = input.match(embedRegex)

  if (!match) throw new Error('Invalid input')

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

async function getSoundCloudOEmbed(url: string): Promise<string | undefined> {
  const encodedUrl = encodeURI(url)
  const response = await fetch(
    `https://soundcloud.com/oembed?url=${encodedUrl}&format=json`
  )

  return response.ok ? ((await response.json())?.html as string) : undefined
}

async function getSpotifyOEmbed(url: string): Promise<string | undefined> {
  const response = await fetch(
    `https://open.spotify.com/oembed?url=${url}&format=json`
  )

  return response.ok ? ((await response.json())?.html as string) : undefined
}

async function getXOEmbedFromHandle(handle: string) {
  handle = handle.replace('@', '')
  const response = await fetch(
    `https://publish.twitter.com/oembed?url=https://twitter.com/${handle}`
  )

  return response.ok ? ((await response.json())?.html as string) : undefined
}

function sanitizeXEmbedUrl(url: string): string {
  url = url.replace('x.com', 'twitter.com')

  if (!url.startsWith('https://')) {
    url = `https://${url}`
  }

  return url
}

function sanitizeYoutubeEmbedUrl(url: string): string {
  url = url.replace('watch?v=', 'embed/')

  if (!url.startsWith('https://')) {
    url = `https://${url}`
  }

  return url
}
