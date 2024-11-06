import {
  createIframeRegex,
  processIframeAttributes,
} from './iframeParserFactory'

export const PLATFORM_PARSING_PARAMETERS_SPOTIFY: PlatformParsingParameters = {
  regexWithCallbacks: [
    {
      regex: createIframeRegex(
        'https?:\\/\\/open\\.spotify\\.com\\/(?:embed\\/)?(?<type>track|album|playlist|artist)\\/(?<id>[^?"]+)(?:\\?(?<params>[^"\'\\s]*))?'
      ),
      callback: async (matches: RegExpMatchArray[]) => {
        return processIframeAttributes(matches, {
          createSrc: ({ type, id, params }) =>
            `https://open.spotify.com/embed/${type}/${id}${params ? `?${params}` : ''}`,
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
