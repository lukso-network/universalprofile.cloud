export const PLATFORM_PARSING_PARAMETERS_SOUNDCLOUD: PlatformParsingParameters =
  {
    regexWithCallbacks: [
      {
        regex: createIframeRegex(
          '(?:https?:\\/\\/w\\.soundcloud\\.com\\/player\\/\\?(?:(?!url=https).)*url=https(?::|%3A)(?:\\/|%2F){2}api\\.soundcloud\\.com(?:\\/|%2F)(?<type>tracks|playlists|users)(?:\\/|%2F)(?<id>\\d+)(?<params>[^"]*)?)|(?:https:\\/\\/soundcloud\\.com\\/(?<username>[a-zA-Z0-9_-]+)(?:\\/(?:(?<setType>sets)\\/(?<setName>[a-zA-Z0-9_-]+)|(?<trackName>[a-zA-Z0-9_-]+)))?\\/?)'
        ),
        callback: async (matches: RegExpMatchArray[]) => {
          return processIframeAttributes(matches, {
            createSrc: properties => {
              // Handle embedded player URL
              if (properties.type && properties.id) {
                return `https://w.soundcloud.com/player/?url=https://api.soundcloud.com/${properties.type}/${properties.id}${properties.params || ''}`
              }

              // Handle direct Soundcloud URL conversion
              if (properties.username) {
                const path =
                  properties.setType && properties.setName
                    ? `${properties.username}/sets/${properties.setName}`
                    : properties.trackName
                      ? `${properties.username}/${properties.trackName}`
                      : properties.username

                return `https://w.soundcloud.com/player/?url=https://soundcloud.com/${path}`
              }

              throw new Error('Invalid Soundcloud URL format')
            },
            defaultAllow:
              'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
            additionalProcessing: properties => ({
              ...properties,
              widgetType: 'IFRAME',
              height: properties.height || '166',
              width: properties.width || '100%',
            }),
          })
        },
      },
    ],
  }
