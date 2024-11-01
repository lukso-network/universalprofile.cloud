import { describe, expect, it } from 'vitest'
const YOUTUBE_IFRAME_ALLOW =
  'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'

describe('YOUTUBE Input Parser', () => {
  it.each([
    [
      'URL',
      GRID_WIDGET_TYPE.enum.YOUTUBE,
      'https://www.youtube.com/watch?v=Vw4JE64hsO8',
      {
        src: 'https://www.youtube.com/embed/Vw4JE64hsO8',
        allow: YOUTUBE_IFRAME_ALLOW,
      },
    ],
    [
      'Embed Code',
      GRID_WIDGET_TYPE.enum.YOUTUBE,
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/Vw4JE64hsO8?si=OwVdFZCStaL90G2W" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
      {
        src: 'https://www.youtube.com/embed/Vw4JE64hsO8',
        allow: YOUTUBE_IFRAME_ALLOW,
      },
    ],
  ])('correctly parses %s', async (_description, platform, input, expected) => {
    const result = await parsePlatformInput(platform, input)
    expect(result).toEqual(expected)
  })
})
