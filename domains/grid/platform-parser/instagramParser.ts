export const PLATFORM_PARSING_PARAMETERS_INSTAGRAM: PlatformParsingParameters =
  {
    regexWithCallbacks: [
      {
        regex:
          /https:\/\/www\.instagram\.com\/(?<type>p|reel|profile|tv)\/(?<id>[\w-]+)\/?(?<params>\?[^"]*)?/,
        callback: async (matches: RegExpMatchArray[]) => {
          const properties = getPropertiesFromGroups(matches)
          const { type, id } = properties

          return {
            widgetType: 'INSTAGRAM',
            type,
            id,
          }
        },
      },
    ],
  }
