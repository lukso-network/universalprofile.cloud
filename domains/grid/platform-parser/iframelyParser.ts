export const PLATFORM_PARSING_PARAMETERS_IFRAMELY: PlatformParsingParameters = {
  regexWithCallbacks: [
    // Match whole embed code
    {
      regex:
        /data-iframely-url="(?<iframelyUrl>[^"]+)"|href="(?<url>[^"]+)"/g,
      callback: async (matches: RegExpMatchArray[]) => {
        const properties = getPropertiesFromGroups(matches)
        const { url, iframelyUrl } = properties

        return {
          widgetType: 'IFRAMELY',
          url,
          iframelyUrl,
        }
      },
    },
  ],
}
