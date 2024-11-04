export const PLATFORM_PARSING_PARAMETERS_WARPCAST: PlatformParsingParameters = {
  regexWithCallbacks: [
    // Match whole embed code
    {
      regex: createIframeRegex('https:\\/\\/warpcast\\.com\\/(?<id>[\\w.-]+)'),
      callback: async (matches: RegExpMatchArray[]) => {
        return processIframeAttributes(matches, {
          createSrc: ({ id }) => `https://warpcast.com/${id}`,
          defaultAllow:
            'clipboard-write; encrypted-media; fullscreen; picture-in-picture',
          additionalProcessing: properties => ({
            ...properties,
            widgetType: 'IFRAME',
          }),
        })
      },
    },
  ],
}
