export const PLATFORM_PARSING_PARAMETERS_SOUNDCLOUD: PlatformParsingParameters =
  {
    // type: GRID_WIDGET_TYPE.enum.IFRAME,
    regexWithCallbacks: [
      {
        regex:
          /https?:\/\/w\.soundcloud\.com\/player\/\?(?:(?!url=https).)*url=https(?::|%3A)(?:\/|%2F){2}api\.soundcloud\.com(?:\/|%2F)(?<type>tracks|playlists|users)(?:\/|%2F)\d+(?:[^"]*)?/,
        callback: async () => undefined,
      },
      {
        regex:
          /https:\/\/soundcloud\.com\/([a-zA-Z0-9_-]+)(?:\/(sets\/[a-zA-Z0-9_-]+|[a-zA-Z0-9_-]+))?\/?/,
        callback: async () => undefined,
      },
    ],
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
