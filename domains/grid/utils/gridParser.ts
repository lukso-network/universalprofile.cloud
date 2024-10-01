export const parsePlatformInput = (
  platform: GridWidgetType,
  input: string
): LayoutItemExtended | never => {
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

const parseSoundCloudWidgetInput = (
  input: string
): LayoutItemExtended | never => {
  const SOUNDCLOUD_URL_REGEX =
    /https?:\/\/w\.soundcloud\.com\/player\/\?url=https%3A\/\/api\.soundcloud\.com\/(tracks|playlists)\/(\d+)([^"]*)/
  const SOUNDCLOUD_IFRAME_ALLOW =
    'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'

  const [, embedType, id, params] = input.match(SOUNDCLOUD_URL_REGEX) || []

  if (id) {
    return {
      type: GRID_WIDGET_TYPE.IFRAME,
      properties: {
        src: `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/${embedType}/${id}${params}`,
        allow: SOUNDCLOUD_IFRAME_ALLOW,
        embedType,
      },
    }
  }

  throw new Error('Invalid SoundCloud input')
}

const parseInstagramWidgetInput = (
  input: string
): LayoutItemExtended | never => {
  const INSTAGRAM_URL_REGEX =
    /https:\/\/www\.instagram\.com\/(p|reel|profile|tv)\/[\w-]+\/(?:\?[^"]*)?/

  const match = input.match(INSTAGRAM_URL_REGEX)
  if (match) {
    return {
      type: GRID_WIDGET_TYPE.INSTAGRAM,
      properties: {
        src: match[0],
        embedType: match[1],
      },
    }
  }

  throw new Error('Invalid Instagram input')
}
