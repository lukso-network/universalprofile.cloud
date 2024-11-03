import { describe, expect, it } from 'vitest'

describe('X Input Parser', () => {
  it.each([
    [
      'Handle',
      '@feindura',
      {
        type: 'timeline',
        username: 'feindura',
      },
    ],
    [
      'Handle without @',
      'feindura',
      {
        type: 'timeline',
        username: 'feindura',
      },
    ],
    [
      'Status URL',
      'https://x.com/feindura/status/1804519711377436675',
      {
        type: 'status',
        username: 'feindura',
        id: '1804519711377436675',
      },
    ],
    [
      'Status URL twitter.com',

      'https://twitter.com/feindura/status/1804519711377436675',
      {
        type: 'status',
        username: 'feindura',
        id: '1804519711377436675',
      },
    ],
    [
      'Status Embed Code with extra props',
      '<blockquote class="twitter-tweet" data-lang="en" data-dnt="true" data-theme="dark"><p lang="en" dir="ltr">Get to know the <a href="https://twitter.com/lukso_io?ref_src=twsrc%5Etfw">@lukso_io</a> ecosystem in 3min 🎧 <a href="https://t.co/UUh23NgdfQ">pic.twitter.com/UUh23NgdfQ</a></p>&mdash; Fabian Vogelsteller (@feindura) <a href="https://twitter.com/feindura/status/1804519711377436675?ref_src=twsrc%5Etfw">June 22, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
      {
        type: 'status',
        username: 'feindura',
        id: '1804519711377436675',
        theme: 'dark',
        language: 'en',
        donottrack: true,
      },
    ],
    [
      'Timeline URL',
      'https://x.com/lukso_io',
      {
        type: 'timeline',
        username: 'lukso_io',
      },
    ],
    [
      'Timeline URL twitter.com',
      'https://twitter.com/lukso_io',
      {
        type: 'timeline',
        username: 'lukso_io',
      },
    ],
    [
      'Timeline Embed Code',
      '<a class="twitter-timeline" href="https://twitter.com/lukso_io?ref_src=twsrc%5Etfw">Tweets by lukso_io</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
      {
        type: 'timeline',
        username: 'lukso_io',
      },
    ],
  ])('correctly parses %s', async (_description, input, expected) => {
    const result = await parsePlatformInput(GRID_WIDGET_TYPE.Enum.X, input)
    expect(result).toEqual(expected)
  })
})
