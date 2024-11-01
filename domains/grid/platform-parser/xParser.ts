import { getPropertiesFromGroups } from './gridParser'

export const PLATFORM_PARSING_PARAMETERS_X: PlatformParsingParameters = {
  // type: GRID_WIDGET_TYPE.enum.X,
  regexWithCallbacks: [
    {
      regex:
        /(?:https?:\/\/(?:(?:www\.)?(?:twitter|x)\.com)\/(?<username>[a-zA-Z0-9_]+)(?:\/status\/(?<id>\d+))?(?:\?[^"'\s]*)?)|(?:data-media-max-width="(?<mediaWidth>\d+)")|(?:data-theme="(?<theme>\w+)")|(?:data-lang="(?<language>\w+)")|(?:data-dnt="(?<doNotTrack>true|false)")/g,
      callback: async (matches: RegExpMatchArray[]) => {
        // Flatten all matches' groups into a single object
        const properties = getPropertiesFromGroups(matches)
        const { username, id, mediaWidth, theme, language, doNotTrack } =
          properties

        return {
          type: mediaWidth ? 'video' : id ? 'status' : 'timeline',
          username,
          ...(id && { id }),
          ...(theme && { theme }),
          ...(language && { language }),
          ...(doNotTrack && { doNotTrack: doNotTrack === 'true' }),
        }
      },
    },
    // Match a handle with @ symbol
    {
      regex: /^@?(?<username>[a-zA-Z0-9_]{1,15})$/,
      callback: async (matches: RegExpMatchArray[]) => {
        const { username } = matches[0]?.groups ?? {} // Get the first match's first group

        return {
          type: 'timeline',
          username,
        }
      },
    },
  ],
}
