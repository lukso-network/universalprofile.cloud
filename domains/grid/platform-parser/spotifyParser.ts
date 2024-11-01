export const PLATFORM_PARSING_PARAMETERS_SPOTIFY: PlatformParsingParameters = {
  // type: GRID_WIDGET_TYPE.enum.IFRAME,
  regexWithCallbacks: [
    {
      regex:
        /https?:\/\/(?:open\.)?spotify\.com\/embed\/?(?<type>track|playlist|artist)\/(?<id>[^?]+)(?:\?utm_source=(?:generator|oembed))?(?:&theme=(?<theme>\d))?/,
      callback: async () => undefined,
    },
    {
      regex:
        /https:\/\/open\.spotify\.com\/(?<type>track|playlist|artist)\/(?<id>[^?]+)/,
      callback: async () => undefined,
    },
  ],
  // constantProperties: {
  //   allow: 'clipboard-write; encrypted-media; fullscreen; picture-in-picture',
  // },
}

export async function getSpotifyOEmbed(
  url: string
): Promise<string | undefined> {
  const response = await fetch(
    `https://open.spotify.com/oembed?url=${url}&format=json`
  )

  return response.ok ? ((await response.json())?.html as string) : undefined
}
