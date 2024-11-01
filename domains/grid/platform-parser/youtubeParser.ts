export const PLATFORM_PARSING_PARAMETERS_YOUTUBE: PlatformParsingParameters = {
  // type: GRID_WIDGET_TYPE.enum.YOUTUBE,
  regexWithCallbacks: [
    {
      regex: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
      callback: async () => undefined,
    },
    {
      regex: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
      callback: async () => undefined,
    },
  ],
  // constantProperties: {
  //   allow:
  //     'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
  // },
}

export function sanitizeYoutubeEmbedUrl(url: string): string {
  let newUrl = url.replace('watch?v=', 'embed/')

  if (!url.startsWith('https://')) {
    newUrl = `https://${newUrl}`
  }

  return newUrl
}
