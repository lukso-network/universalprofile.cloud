import { describe, expect, it } from 'vitest'

describe('Warpcast Parser', () => {
  it('can parse from profile URL', async () => {
    const input = 'https://warpcast.com/realfeindura'
    const result = await parsePlatformInput(
      GRID_WIDGET_TYPE.Enum.WARPCAST,
      input
    )

    expect(result).toEqual({
      widgetType: 'IFRAME',
      src: 'https://warpcast.com/realfeindura',
      allow: 'clipboard-write; encrypted-media; fullscreen; picture-in-picture',
    })
  })

  it.skip('can parse from post URL', async () => {
    const input = 'https://warpcast.com/realfeindura/0x0952bbc3'
    const result = await parsePlatformInput(
      GRID_WIDGET_TYPE.Enum.WARPCAST,
      input
    )

    expect(result).toEqual({
      widgetType: 'IFRAME',
      src: 'https://warpcast.com/realfeindura/0x0952bbc3',
      allow: 'clipboard-write; encrypted-media; fullscreen; picture-in-picture',
    })
  })
})
