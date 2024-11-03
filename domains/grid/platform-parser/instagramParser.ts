export const PLATFORM_PARSING_PARAMETERS_INSTAGRAM: PlatformParsingParameters =
  {
    // type: GRID_WIDGET_TYPE.enum.INSTAGRAM,
    regexWithCallbacks: [
      {
        regex:
          /https:\/\/www\.instagram\.com\/(?<type>p|reel|profile|tv)\/(?<id>[\w-]+)\/(?<params>\?[^"]*)?/,
        callback: async (matches: RegExpMatchArray[]) => {
          const properties = getPropertiesFromGroups(matches)
          const { type, id } = properties

          return {
            type,
            id,
          }
        },
      },
    ],
  }
