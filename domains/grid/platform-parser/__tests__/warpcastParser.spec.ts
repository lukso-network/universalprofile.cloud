import { describe, expect, it } from 'vitest'

describe('Warpcast Parser', () => {
  it.each([
    [
      'can parse from profile URL',
      GRID_WIDGET_TYPE.Enum.WARPCAST,
      'https://warpcast.com/realfeindura',
      {
        widgetType: 'IFRAME',
        src: 'https://warpcast.com/realfeindura',
        allow:
          'clipboard-write; encrypted-media; fullscreen; picture-in-picture',
      },
    ],
    [
      'can parse from post URL',
      GRID_WIDGET_TYPE.Enum.WARPCAST,
      'https://warpcast.com/realfeindura/0x0952bbc3',
      {
        widgetType: 'IFRAME',
        src: 'https://warpcast.com/realfeindura/0x0952bbc3',
        allow:
          'clipboard-write; encrypted-media; fullscreen; picture-in-picture',
      },
    ],
    [
      'can parse username with @',
      GRID_WIDGET_TYPE.Enum.WARPCAST,
      '@realfeindura',
      {
        widgetType: 'IFRAME',
        src: 'https://warpcast.com/realfeindura',
        allow:
          'clipboard-write; encrypted-media; fullscreen; picture-in-picture',
      },
    ],
    [
      'can parse username without @',
      GRID_WIDGET_TYPE.Enum.WARPCAST,
      'realfeindura',
      {
        widgetType: 'IFRAME',
        src: 'https://warpcast.com/realfeindura',
        allow:
          'clipboard-write; encrypted-media; fullscreen; picture-in-picture',
      },
    ],
    [
      'can parse username without @ and post id',
      GRID_WIDGET_TYPE.Enum.WARPCAST,
      'realfeindura/0x0952bbc3',
      {
        widgetType: 'IFRAME',
        src: 'https://warpcast.com/realfeindura/0x0952bbc3',
        allow:
          'clipboard-write; encrypted-media; fullscreen; picture-in-picture',
      },
    ],
    [
      'can parse username with @ and post id',
      GRID_WIDGET_TYPE.Enum.WARPCAST,
      '@realfeindura/0x0952bbc3',
      {
        widgetType: 'IFRAME',
        src: 'https://warpcast.com/realfeindura/0x0952bbc3',
        allow:
          'clipboard-write; encrypted-media; fullscreen; picture-in-picture',
      },
    ],
  ])('%s', async (_, widgetType, input, expected) => {
    const result = await parsePlatformInput(widgetType, input)
    expect(result).toEqual(expected)
  })
})
