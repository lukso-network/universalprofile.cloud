import { GRID_WIDGET_SUPPORTED_PLATFORMS } from '../shared/config'

export function parseSupportedPlatformInput(
  platform: GRID_WIDGET_SUPPORTED_PLATFORMS,
  input: string
): Partial<GridWidget> | undefined {
  switch (platform) {
    case GRID_WIDGET_SUPPORTED_PLATFORMS.X:
      return parseXWidgetInput(input)
    case GRID_WIDGET_SUPPORTED_PLATFORMS.YOUTUBE:
      return parseYoutubeWidgetInput(input)
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
    else
      return {
        type: GRID_WIDGET_TYPE.X_TIMELINE,
        properties: {
          src: `https://twitter.com/${xUrlMatch[1]}?ref_src=twsrc%5Etfw`,
        },
      }
  }

  return
}
