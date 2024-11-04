import { describe, expect, it } from 'vitest'

describe('WARPCAST Input Parser', () => {
  it.each([
    [
      'correctly parses URL',
      GRID_WIDGET_TYPE.enum.WARPCAST,
      'https://warpcast.com/vitalik.eth',
      {
        widgetType: 'IFRAME',
        src: 'https://warpcast.com/vitalik.eth',
        allow:
          'clipboard-write; encrypted-media; fullscreen; picture-in-picture',
      },
    ],
  ])('correctly parses %s', async (_description, platform, input, expected) => {
    const result = await parsePlatformInput(platform, input)
    expect(result).toEqual(expected)
  })
})
