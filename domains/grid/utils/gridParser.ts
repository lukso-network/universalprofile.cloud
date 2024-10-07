export const parsePlatformInput = async (
  platform: GridWidgetType,
  input: string
): Promise<LayoutItemExtended> => {
  switch (platform) {
    case GRID_WIDGET_TYPE.X:
      return parseXWidgetInput(input)
    case GRID_WIDGET_TYPE.INSTAGRAM:
      return parseInstagramWidgetInput(input)
    case GRID_WIDGET_TYPE.YOUTUBE:
      return parseYoutubeWidgetInput(input)
    case GRID_WIDGET_TYPE.SPOTIFY:
      return parseSpotifyWidgetInput(input)
    case GRID_WIDGET_TYPE.SOUNDCLOUD:
      return parseSoundCloudWidgetInput(input)
    default:
      throw new Error('Invalid platform')
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
        embedType: 'post',
      },
    }
  }

  const [, timelineUser] = input.match(X_TIMELINE_REGEX) || []

  if (timelineUser) {
    return {
      type: GRID_WIDGET_TYPE.X,
      properties: {
        src: `https://twitter.com/${timelineUser}?ref_src=twsrc%5Etfw`,
        embedType: 'timeline',
      },
    }
  }

  throw new Error('Invalid X input')
}

const parseSpotifyWidgetInput = (input: string): LayoutItemExtended | never => {
  const SPOTIFY_URL_REGEX =
    /https?:\/\/(?:open\.)?spotify\.com\/(?:embed\/)?(track|playlist|artist)\/([^?]+)(?:\?utm_source=generator)?/
  const SPOTIFY_IFRAME_ALLOW =
    'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'

  const [, embedType, id] = input.match(SPOTIFY_URL_REGEX) || []

  if (embedType && id) {
    return {
      type: GRID_WIDGET_TYPE.SPOTIFY,
      properties: {
        src: `https://open.spotify.com/embed/${embedType}/${id}?utm_source=generator`,
        embedType,
        allow: SPOTIFY_IFRAME_ALLOW,
      },
    }
  }

  throw new Error('Invalid Spotify input')
}

const parseSoundCloudWidgetInput = async (
  input: string
): Promise<LayoutItemExtended> => {
  const SOUNDCLOUD_SHARE_URL_REGEX =
    /https:\/\/soundcloud\.com\/([a-zA-Z0-9_-]+)(?:\/(sets\/[a-zA-Z0-9_-]+|[a-zA-Z0-9_-]+))?\/?/

  // Check if the input already contains an embed URL
  try {
    return parseSoundCloudWidgetInputFromEmbed(input)
  } catch {}

  // Check if the input is a SoundCloud share URL
  const [shareUrlMatch] = input.match(SOUNDCLOUD_SHARE_URL_REGEX) || []
  if (shareUrlMatch) {
    const soundCloudEmbed = await getSoundCloudEmbedUrl(shareUrlMatch)

    if (soundCloudEmbed) {
      return parseSoundCloudWidgetInputFromEmbed(soundCloudEmbed)
    }
  }

  throw new Error('Invalid SoundCloud input')
}

export const parseSoundCloudWidgetInputFromEmbed = (
  input: string
): LayoutItemExtended | never => {
  const SOUNDCLOUD_EMBED_URL_REGEX =
    /https?:\/\/w\.soundcloud\.com\/player\/\?(?:(?!url=https).)*url=https(?::|%3A)(?:\/|%2F){2}api\.soundcloud\.com(?:\/|%2F)(tracks|playlists)(?:\/|%2F)\d+(?:[^"]*)?/
  const SOUNDCLOUD_IFRAME_ALLOW =
    'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
  const [match, embedType] = input.match(SOUNDCLOUD_EMBED_URL_REGEX) || []

  if (match) {
    return {
      type: GRID_WIDGET_TYPE.IFRAME,
      properties: {
        src: match,
        allow: SOUNDCLOUD_IFRAME_ALLOW,
        embedType,
      },
    }
  }

  throw new Error('Invalid SoundCloud input')
}

export const getSoundCloudEmbedUrl = async (
  url: string
): Promise<string | undefined> => {
  const encodedUrl = encodeURI(url)
  const response = await fetch(
    `https://soundcloud.com/oembed?url=${encodedUrl}&format=json`
  )

  if (!response.ok) {
    return response.statusText
  }

  const { html } = await response.json()
  const [, srcMatch] = html.match(/src="([^"]+)"/) || []

  return srcMatch
}

const parseInstagramWidgetInput = (
  input: string
): LayoutItemExtended | never => {
  const INSTAGRAM_URL_REGEX =
    /https:\/\/www\.instagram\.com\/(p|reel|profile|tv)\/([\w-]+)\/(\?[^"]*)?/

  const [, embedType, id, params] = input.match(INSTAGRAM_URL_REGEX) || []

  if (id && embedType) {
    return {
      type: GRID_WIDGET_TYPE.INSTAGRAM,
      properties: {
        src: `https://www.instagram.com/${embedType}/${id}/${params}`,
        embedType: embedType,
      },
    }
  }

  throw new Error('Invalid Instagram input')
}
