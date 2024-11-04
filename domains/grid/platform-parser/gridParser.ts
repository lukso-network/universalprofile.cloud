import type { GridWidgetType } from '@/types/grid'

export type RegexWithCallback = {
  regex: RegExp
  callback: (
    matches: RegExpMatchArray[]
  ) => Promise<{
    properties: Record<string, unknown> | undefined
    type: GridWidgetType
  }>
}

export type PlatformParsingParameters = {
  type: GridWidgetType
  regexWithCallbacks?: RegexWithCallback[]
}

export const parsePlatformInput = async (
  platform: GridWidgetType,
  input: string
) => {
  const platformParsingParameters = PLATFORM_PARSING_PARAMETERS[platform]

  if (!platformParsingParameters) {
    throw new Error('Invalid platform')
  }

  const { regexWithCallbacks: regexesWithCallbacks } = platformParsingParameters

  if (!regexesWithCallbacks?.length) {
    throw new Error('No regex patterns configured')
  }

  // Check each regex in order
  for (const { regex, callback } of regexesWithCallbacks) {
    let matches: RegExpMatchArray[] = []
    // Check if the regex is global
    if (regex.global) {
      matches = Array.from(input.matchAll(regex))
    } else {
      const match = input.match(regex)

      if (match) {
        matches.push(match)
      }
    }

    if (matches.length) {
      return await callback(matches)
    }
  }

  throw new Error('Invalid input')
}

export const getPropertiesFromGroups = (matches: RegExpMatchArray[]) => {
  return matches.reduce(
    (acc, match) => {
      return Object.assign(
        acc,
        Object.fromEntries(
          Object.entries(match.groups || {}).filter(
            ([, value]) => value !== undefined
          ) // Filter out undefined values
        )
      )
    },
    {} as Record<string, string>
  )
}
