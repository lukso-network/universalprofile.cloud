import { describe, expect, it } from 'vitest'

describe('YOUTUBE Input Parser', () => {
  it.each([
    [
      'URL',
      GRID_WIDGET_TYPE.enum.YOUTUBE,
      'https://www.youtube.com/watch?v=Vw4JE64hsO8',
      {
        widgetType: 'IFRAME',
        allow:
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        allowfullscreen: true,
        frameborder: '0',
        height: '315',
        referrerpolicy: 'strict-origin-when-cross-origin',
        src: 'https://www.youtube-nocookie.com/embed/Vw4JE64hsO8',
        width: '560',
      },
    ],
    [
      'Embed Code',
      GRID_WIDGET_TYPE.enum.YOUTUBE,
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/Vw4JE64hsO8?si=OwVdFZCStaL90G2W" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
      {
        widgetType: 'IFRAME',
        allow:
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        allowfullscreen: true,
        frameborder: '0',
        height: '315',
        referrerpolicy: 'strict-origin-when-cross-origin',
        src: 'https://www.youtube-nocookie.com/embed/Vw4JE64hsO8?si=OwVdFZCStaL90G2W',
        width: '560',
      },
    ],
  ])('correctly parses %s', async (_description, platform, input, expected) => {
    const result = await parsePlatformInput(platform, input)
    expect(result).toEqual(expected)
  })
})
