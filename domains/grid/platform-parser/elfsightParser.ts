export const PLATFORM_PARSING_PARAMETERS_ELFSIGHT: PlatformParsingParameters = {
  regexWithCallbacks: [
    // Match whole embed code
    {
      regex:
        /(?:elfsight-app-)?(?<id>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:\s+class="([^"]+)")?/,
      callback: async (matches: RegExpMatchArray[]) => {
        const properties = getPropertiesFromGroups(matches)
        const { id } = properties

        return {
          widgetType: 'ELFSIGHT',
          id,
        }
      },
    },
  ],
}
