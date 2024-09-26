import { GRID_WIDGET_SUPPORTED_PLATFORMS } from '../shared/config'

export function parseSupportedPlatformInput(
  platform: GRID_WIDGET_SUPPORTED_PLATFORMS,
  input: string
): Partial<GridWidget> | undefined {
  switch (platform) {
    case GRID_WIDGET_SUPPORTED_PLATFORMS.X:
      return parseXWidgetInput(input)
    case GRID_WIDGET_SUPPORTED_PLATFORMS.INSTAGRAM:
      return parseInstagramWidgetInput(input)
    case GRID_WIDGET_SUPPORTED_PLATFORMS.YOUTUBE:
      return parseYoutubeWidgetInput(input)
    case GRID_WIDGET_SUPPORTED_PLATFORMS.SPOTIFY:
      return parseSpotifyWidgetInput(input)
    case GRID_WIDGET_SUPPORTED_PLATFORMS.SOUNDCLOUD:
      return parseSoundCloudWidgetInput(input)
    default:
      return
  }
}

function parseYoutubeWidgetInput(
  input: string
): Partial<GridWidget> | undefined {
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

  return
}

function parseXWidgetInput(input: string): Partial<GridWidget> | undefined {
  const X_URL_REGEX =
    /https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/(\w+)(?:\/status\/(\d+))?/

  const xUrlMatch = input.match(X_URL_REGEX)
  if (xUrlMatch) {
    if (xUrlMatch[2])
      return {
        type: GRID_WIDGET_TYPE.X_POST,
        properties: {
          src: `https://twitter.com/${xUrlMatch[1]}/status/${xUrlMatch[2]}?ref_src=twsrc%5Etfw`,
        },
      }

    return {
      type: GRID_WIDGET_TYPE.X_TIMELINE,
      properties: {
        src: `https://twitter.com/${xUrlMatch[1]}?ref_src=twsrc%5Etfw`,
      },
    }
  }

  return
}

function parseSpotifyWidgetInput(
  input: string
): Partial<GridWidget> | undefined {
  const SPOTIFY_URL_REGEX =
    /https?:\/\/(?:open\.)?spotify\.com\/(?:embed\/)?(track|playlist|artist)\/([^?]+)(?:\?utm_source=generator)?/
  const SPOTIFY_IFRAME_ALLOW =
    'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'

  const spotifyMatch = input.match(SPOTIFY_URL_REGEX)
  if (spotifyMatch) {
    return {
      type: GRID_WIDGET_TYPE.IFRAME,
      properties: {
        src: `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}?utm_source=generator`,
        allow: SPOTIFY_IFRAME_ALLOW,
      },
    }
  }

  return
}

function parseSoundCloudWidgetInput(
  input: string
): Partial<GridWidget> | undefined {
  const SOUNDCLOUD_URL_REGEX =
    /https?:\/\/w\.soundcloud\.com\/player\/\?url=https%3A\/\/api\.soundcloud\.com\/(tracks|playlists)\/(\d+)([^"]*)/
  const SOUNDCLOUD_IFRAME_ALLOW =
    'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'

  const soundCloudMatch = input.match(SOUNDCLOUD_URL_REGEX)
  if (soundCloudMatch) {
    return {
      type: GRID_WIDGET_TYPE.IFRAME,
      properties: {
        src: `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/${soundCloudMatch[1]}/${soundCloudMatch[2]}${soundCloudMatch[3]}`,
        allow: SOUNDCLOUD_IFRAME_ALLOW,
      },
    }
  }

  return
}

function parseInstagramWidgetInput(input: string) {
  // TODO: Add support for instagram timeline embeds when we have the widget type
  const INSTAGRAM_PERMALINK_REGEX = /data-instgrm-permalink="([^"]+)"/
  const instagramMatch = input.match(INSTAGRAM_PERMALINK_REGEX)
  if (instagramMatch) {
    return {
      type: GRID_WIDGET_TYPE.INSTAGRAM_POST,
      properties: {
        src: instagramMatch[1],
      },
    }
  }

  return
}
