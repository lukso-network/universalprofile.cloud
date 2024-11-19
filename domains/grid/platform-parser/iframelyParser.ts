export const PLATFORM_PARSING_PARAMETERS_IFRAMELY: PlatformParsingParameters = {
  regexWithCallbacks: [
    // Match whole embed code
    {
      regex:
        /data-iframely-url="(?<url>[^"]+)"/,
      callback: async (matches: RegExpMatchArray[]) => {
        const properties = getPropertiesFromGroups(matches)
        const { url } = properties

        return {
          widgetType: 'IFRAMELY',
          url,
        }
      },
    },
  ],
}
