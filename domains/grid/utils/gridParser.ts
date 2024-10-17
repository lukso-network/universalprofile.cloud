/**
 * Represents the parameters required for parsing platform-specific input.
 *
 * @typedef {Object} PlatformParsingParameters
 * @property {GridWidgetType} type - The type of the grid widget.
 * @property {RegExp} embedRegex - The regular expression used to match the embed URL. Named capture groups are used to extract properties.
 * @property {RegExp[]} [secondaryRegexes] - Optional secondary regular expressions for additional matching. Whole match is used as input for the embed API callback.
 * @property {(url: string) => Promise<string | undefined>} [embedApiCallback] - Optional callback function to fetch the embed from the platform's API.
 * @property {Record<string, string>} [constantProperties] - Optional constant properties to be included in the parsed result.
 */
export type PlatformParsingParameters = {
  type: GridWidgetType
  embedRegex: RegExp
  secondaryRegexes?: RegExp[]
  secondaryRegexCallback?: (url: string) => Promise<string | undefined>
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
      /(?:https?:\/\/)?(?:www\.)?(?:x\.com|twitter\.com)\/(\w+)\/status\/(\d+)(?:\?ref_src=twsrc%5Etfw)?/,
    // propertyNames: ['src', 'type'],
  },
  [GRID_WIDGET_TYPE.INSTAGRAM]: {
    type: GRID_WIDGET_TYPE.INSTAGRAM,
    embedRegex:
      /https:\/\/www\.instagram\.com\/(p|reel|profile|tv)\/([\w-]+)\/(\?[^"]*)?/,
    // propertyNames: ['src', 'type'],
  },
  [GRID_WIDGET_TYPE.WARPCAST]: undefined,
  [GRID_WIDGET_TYPE.SPOTIFY]: {
    type: GRID_WIDGET_TYPE.IFRAME,
    embedRegex:
      /https?:\/\/(?:open\.)?spotify\.com\/embed\/?(?<type>track|playlist|artist)\/(?<id>[^?]+)(?:\?utm_source=(?:generator|oembed))?(?:&theme=(?<theme>\d))?/,
    secondaryRegexes: [
      /https:\/\/open\.spotify\.com\/(?<type>track|playlist|artist)\/(?<id>[^?]+)/,
    ],
    secondaryRegexCallback: getSpotifyEmbedUrl,
    constantProperties: {
      allow:
        'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
    },
  },
  [GRID_WIDGET_TYPE.SOUNDCLOUD]: {
    type: GRID_WIDGET_TYPE.IFRAME,
    embedRegex:
      /https?:\/\/w\.soundcloud\.com\/player\/\?(?:(?!url=https).)*url=https(?::|%3A)(?:\/|%2F){2}api\.soundcloud\.com(?:\/|%2F)(?<type>tracks|playlists|users)(?:\/|%2F)\d+(?:[^"]*)?/,
    secondaryRegexes: [
      /https:\/\/soundcloud\.com\/([a-zA-Z0-9_-]+)(?:\/(sets\/[a-zA-Z0-9_-]+|[a-zA-Z0-9_-]+))?\/?/,
    ],
    secondaryRegexCallback: getSoundCloudEmbedUrl,
    constantProperties: {
      allow:
        'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
    },
  },
  [GRID_WIDGET_TYPE.YOUTUBE]: {
    type: GRID_WIDGET_TYPE.IFRAME,
    embedRegex: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
  },
  [GRID_WIDGET_TYPE.ADD_CONTENT]: undefined,
}

export const parsePlatformInput = async (
  platform: GridWidgetType,
  input: string
): Promise<LayoutItemExtended | never> => {
  const platformParsingParameters = PLATFORM_PARSING_PARAMETERS[platform]
  if (!platformParsingParameters) throw new Error('Invalid platform')

  // Check if the input matches the embed regex
  try {
    return parsePlatformEmbed(input, platformParsingParameters)
  } catch {}

  const { secondaryRegexes, secondaryRegexCallback } = platformParsingParameters
  if (!secondaryRegexes || !secondaryRegexCallback)
    throw new Error('Invalid platform')

  // Check if the input matches a secondary regex
  let secondaryMatch: RegExpMatchArray | null = null
  secondaryRegexes.find(regex => {
    secondaryMatch = input.match(regex)

    return secondaryMatch
  })

  if (!secondaryMatch) throw new Error('Invalid input')

  const embedApiResult = await secondaryRegexCallback(secondaryMatch[0])
  if (!embedApiResult) throw new Error('Invalid input')

  return parsePlatformEmbed(embedApiResult, platformParsingParameters)
}

const parsePlatformEmbed = (
  input: string,
  platformParsingParameters: PlatformParsingParameters
): LayoutItemExtended | never => {
  const { type, embedRegex, constantProperties } = platformParsingParameters
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
    type,
    properties: {
      src: match[0],
      ...constantProperties,
      ...extractedProperties,
    },
  }
}

const parseYoutubeWidgetInput = (input: string): LayoutItemExtended | never => {
  const YOUTUBE_URL_REGEX =
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/
  const YOUTUBE_EMBED_REGEX =
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/
  const YOUTUBE_IFRAME_ALLOW =
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'

  const youtubeUrlMatch = input.match(YOUTUBE_URL_REGEX)

  if (youtubeUrlMatch) {
    return {
      type: GRID_WIDGET_TYPE.IFRAME,
      properties: {
        src: `https://www.youtube.com/embed/${youtubeUrlMatch[1]}`,
        allow: YOUTUBE_IFRAME_ALLOW,
      },
    }
  }

  const youtubeEmbedMatch = input.match(YOUTUBE_EMBED_REGEX)

  if (youtubeEmbedMatch) {
    return {
      type: GRID_WIDGET_TYPE.IFRAME,
      properties: {
        src: `https://www.youtube.com/embed/${youtubeEmbedMatch[1]}`,
        allow: YOUTUBE_IFRAME_ALLOW,
      },
    }
  }

  throw new Error('Invalid YouTube input')
}

const parseXWidgetInput = (input: string): LayoutItemExtended | never => {
  const X_POST_REGEX =
    /https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/(\w+)\/status\/(\d+)(?:\?ref_src=twsrc%5Etfw)?/
  const X_TIMELINE_REGEX =
    /https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/(\w+)(?:\?ref_src=twsrc%5Etfw)?/

  const [, postUser, postId] = input.match(X_POST_REGEX) || []

  if (postUser && postId) {
    return {
      type: GRID_WIDGET_TYPE.X,
      properties: {
        src: `https://twitter.com/${postUser}/status/${postId}?ref_src=twsrc%5Etfw`,
        type: 'post',
      },
    }
  }

  const [, timelineUser] = input.match(X_TIMELINE_REGEX) || []

  if (timelineUser) {
    return {
      type: GRID_WIDGET_TYPE.X,
      properties: {
        src: `https://twitter.com/${timelineUser}?ref_src=twsrc%5Etfw`,
        type: 'timeline',
      },
    }
  }

  throw new Error('Invalid X input')
}

const parseSpotifyWidgetInput = (input: string): LayoutItemExtended | never => {
  const SPOTIFY_URL_REGEX =
    /https?:\/\/(?:open\.)?spotify\.com\/(?:embed\/)?(?<type>track|playlist|artist)\/(?<id>[^?]+)(?:\?utm_source=generator)?(?:&theme=(?<theme>\d))?/
  const SPOTIFY_IFRAME_ALLOW =
    'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'

  const { groups } = input.match(SPOTIFY_URL_REGEX) || {}

  if (groups?.type && groups?.id) {
    const theme = groups.theme ? `&theme=${groups.theme}` : ''

    return {
      type: GRID_WIDGET_TYPE.SPOTIFY,
      properties: {
        src: `https://open.spotify.com/embed/${groups.type}/${groups.id}?utm_source=generator${theme}`,
        type: groups.type,
        allow: SPOTIFY_IFRAME_ALLOW,
        theme: groups.theme,
      },
    }
  }

  throw new Error('Invalid Spotify input')
}

async function getSoundCloudEmbedUrl(url: string): Promise<string | undefined> {
  const encodedUrl = encodeURI(url)
  const response = await fetch(
    `https://soundcloud.com/oembed?url=${encodedUrl}&format=json`
  )

  return response.ok ? ((await response.json())?.html as string) : undefined
}

async function getSpotifyEmbedUrl(url: string): Promise<string | undefined> {
  const response = await fetch(
    `https://open.spotify.com/oembed?url=${url}&format=json`
  )

  return response.ok ? ((await response.json())?.html as string) : undefined
}

const parseInstagramWidgetInput = (
  input: string
): LayoutItemExtended | never => {
  const INSTAGRAM_URL_REGEX =
    /https:\/\/www\.instagram\.com\/(p|reel|profile|tv)\/([\w-]+)\/(\?[^"]*)?/

  const [, type, id, params] = input.match(INSTAGRAM_URL_REGEX) || []

  if (id && type) {
    return {
      type: GRID_WIDGET_TYPE.INSTAGRAM,
      properties: {
        src: `https://www.instagram.com/${type}/${id}/${params}`,
        type: type,
      },
    }
  }

  throw new Error('Invalid Instagram input')
}
