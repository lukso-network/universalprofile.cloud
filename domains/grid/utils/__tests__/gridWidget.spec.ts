import { describe, expect, it } from 'vitest'
import { GRID_WIDGET_SUPPORTED_PLATFORMS } from '../../shared/config'
import { parseSupportedPlatformInput } from '../gridWidget'

describe('Widget Input Parsing', () => {
  it.each([
    // X (Twitter) Post URL test case
    [
      'X (Twitter) URL',
      GRID_WIDGET_SUPPORTED_PLATFORMS.X,
      'https://x.com/someuser/status/123456789',
      {
        type: GRID_WIDGET_TYPE.X_POST,
        properties: {
          src: 'https://twitter.com/someuser/status/123456789?ref_src=twsrc%5Etfw',
        },
      },
    ],

    // X (Twitter) Post Embed Code test case
    [
      'X (Twitter) Embed Code',
      GRID_WIDGET_SUPPORTED_PLATFORMS.X,
      '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">After many tests and watching the stability of the Ethereum network 🧬, we are finally proposing the Dencun hard fork for the LUKSO Testnet 👈 as a first step towards the Mainnet hard fork, which will follow very soon. ⌚️<br><br>If you are a LUKSO Testnet validator, RPC provider or run… <a href="https://t.co/nByHeouIXB">pic.twitter.com/nByHeouIXB</a></p>&mdash; LUKSO (@lukso_io) <a href="https://twitter.com/lukso_io/status/1830581485331521962?ref_src=twsrc%5Etfw">September 2, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
      {
        type: GRID_WIDGET_TYPE.X_POST,
        properties: {
          src: 'https://twitter.com/lukso_io/status/1830581485331521962?ref_src=twsrc%5Etfw',
        },
      },
    ],

    // X (Twitter) Timeline URL test case
    [
      'X (Twitter) Timeline URL',
      GRID_WIDGET_SUPPORTED_PLATFORMS.X,
      'https://twitter.com/lukso_io',
      {
        type: GRID_WIDGET_TYPE.X_TIMELINE,
        properties: {
          src: 'https://twitter.com/lukso_io?ref_src=twsrc%5Etfw',
        },
      },
    ],

    // X (Twitter) Timeline Embed Code test case
    [
      'X (Twitter) Timeline Embed Code',
      GRID_WIDGET_SUPPORTED_PLATFORMS.X,
      '<a class="twitter-timeline" href="https://twitter.com/lukso_io?ref_src=twsrc%5Etfw">Tweets by lukso_io</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
      {
        type: GRID_WIDGET_TYPE.X_TIMELINE,
        properties: {
          src: 'https://twitter.com/lukso_io?ref_src=twsrc%5Etfw',
        },
      },
    ],

    // YouTube URL test case
    [
      'YouTube URL',
      GRID_WIDGET_SUPPORTED_PLATFORMS.YOUTUBE,
      'https://www.youtube.com/watch?v=Vw4JE64hsO8',
      {
        type: GRID_WIDGET_TYPE.IFRAME,
        properties: {
          src: 'https://www.youtube.com/embed/Vw4JE64hsO8',
          allow:
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        },
      },
    ],

    // YouTube Embed Code test case
    [
      'YouTube Embed Code',
      GRID_WIDGET_SUPPORTED_PLATFORMS.YOUTUBE,
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/Vw4JE64hsO8?si=OwVdFZCStaL90G2W" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
      {
        type: GRID_WIDGET_TYPE.IFRAME,
        properties: {
          src: 'https://www.youtube.com/embed/Vw4JE64hsO8',
          allow:
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        },
      },
    ],
  ])('correctly parses %s', (_description, platform, input, expected) => {
    const result = parseSupportedPlatformInput(platform, input)
    expect(result).toEqual(expected)
  })
})
