import { describe, expect, it } from 'vitest'

describe('Iframely Input Parser', () => {
  it.each([
    [
      'Kickstarter Embed code',
      GRID_WIDGET_TYPE.enum.IFRAMELY,
      '<div class="iframely-embed"><div class="iframely-responsive" style="padding-bottom: 56.25%; padding-top: 120px;"><a href="https://www.kickstarter.com/projects/flipper-devices/flipper-zero-tamagochi-for-hackers" data-iframely-url="//iframely.net/MKfVddg"></a></div></div><script async src="//iframely.net/embed.js"></script>',
      {
        widgetType: 'IFRAMELY',
        url: 'https://www.kickstarter.com/projects/flipper-devices/flipper-zero-tamagochi-for-hackers',
        iframelyUrl: '//iframely.net/MKfVddg',
      },
    ],
    [
      'Kickstarter Embed code with option',
      GRID_WIDGET_TYPE.enum.IFRAMELY,
      '<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://www.kickstarter.com/projects/flipper-devices/flipper-zero-tamagochi-for-hackers" data-iframely-url="//iframely.net/MKfVddg?card=small"></a></div></div><script async src="//iframely.net/embed.js"></script>',
      {
        widgetType: 'IFRAMELY',
        url: 'https://www.kickstarter.com/projects/flipper-devices/flipper-zero-tamagochi-for-hackers',
        iframelyUrl: '//iframely.net/MKfVddg?card=small',
      },
    ],
    [
      'Wired Embed code',
      GRID_WIDGET_TYPE.enum.IFRAMELY,
      '<div class="iframely-embed"><div class="iframely-responsive" style="padding-bottom: 52.3438%; padding-top: 120px;"><a href="https://www.wired.com/story/every-game-should-let-you-cross-save/" data-iframely-url="//cdn.iframe.ly/api/iframe?url=https%3A%2F%2Fwww.wired.com%2Fstory%2Fevery-game-should-let-you-cross-save%2F&key=2fbc9426af756d689fe683d5585d9eb0"></a></div></div><script async src="//cdn.iframe.ly/embed.js" charset="utf-8"></script>',
      {
        widgetType: 'IFRAMELY',
        url: 'https://www.wired.com/story/every-game-should-let-you-cross-save/',
        iframelyUrl: '//cdn.iframe.ly/api/iframe?url=https%3A%2F%2Fwww.wired.com%2Fstory%2Fevery-game-should-let-you-cross-save%2F&key=2fbc9426af756d689fe683d5585d9eb0',
      },
    ],
  ])('correctly parses %s', async (_description, platform, input, expected) => {
    const result = await parsePlatformInput(platform, input)
    expect(result).toEqual(expected)
  })
})
