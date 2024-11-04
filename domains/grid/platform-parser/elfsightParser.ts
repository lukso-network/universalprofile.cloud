export const PLATFORM_PARSING_PARAMETERS_ELFSIGHT: PlatformParsingParameters = {
  regexWithCallbacks: [
    {
      regex: /class="elfsight-app-([\w-]+)"/,
      callback: async (matches: RegExpMatchArray[]) => {
        const properties = getPropertiesFromGroups(matches)
        const { id } = properties

        return {
          id,
        }
      },
    },
  ],
}
