export const PLATFORM_PARSING_PARAMETERS_YOUTUBE: PlatformParsingParameters = {
  regexWithCallbacks: [
    {
      regex: createIframeRegex(
        // Direct watch URL
        '(?:https?:\\/\\/(?:www\\.)?youtube\\.com\\/watch\\?v=(?<videoId>[^&\\s"]+)(?:&(?<params>[^"\'\\s]*))?)|' +
          // Embed URL
          '(?:https?:\\/\\/(?:www\\.)?youtube(?:-nocookie)?\\.com\\/embed\\/(?<embedVideoId>[^?"]+)(?:\\?(?<embedParams>[^"\'\\s]*))?)',
        ['title', 'referrerpolicy']
      ),
      callback: async (
        matches: RegExpMatchArray[]
      ): Promise<Record<string, any>> => {
        return processIframeAttributes(matches, {
          createSrc: properties => {
            const vid = properties.videoId || properties.embedVideoId
            const params = properties.params || properties.embedParams
            return `https://www.youtube-nocookie.com/embed/${vid}${params ? `?${params}` : ''}`
          },
          defaultAllow:
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
          additionalProcessing: properties => ({
            ...properties,
            width: properties.width || '560',
            height: properties.height || '315',
            frameborder: properties.frameborder || '0',
            allowfullscreen: true,
            referrerpolicy:
              properties.referrerpolicy || 'strict-origin-when-cross-origin',
          }),
        })
      },
    },
    // Fallback for direct video ID input
    {
      regex: /^(?<videoId>[a-zA-Z0-9_-]{11})$/,
      callback: async (
        matches: RegExpMatchArray[]
      ): Promise<Record<string, any>> => {
        const { videoId } = getPropertiesFromGroups(matches)
        return {
          videoId,
          src: `https://www.youtube-nocookie.com/embed/${videoId}`,
          width: '560',
          height: '315',
          frameborder: '0',
          allow:
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
          allowfullscreen: true,
          referrerpolicy: 'strict-origin-when-cross-origin',
        }
      },
    },
  ],
}
