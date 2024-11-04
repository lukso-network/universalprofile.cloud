import { describe, expect, it } from 'vitest'

describe('X Parser', () => {
  describe('X timeline', () => {
    it('can parse into X timeline from username without @', async () => {
      const input = 'feindura'
      const result = await parsePlatformInput(GRID_WIDGET_TYPE.Enum.X, input)

      expect(result).toEqual({
        widgetType: 'X',
        type: 'timeline',
        username: 'feindura',
      })
    })

    it('can parse into X timeline from username with @', async () => {
      const input = '@feindura'
      const result = await parsePlatformInput(GRID_WIDGET_TYPE.Enum.X, input)

      expect(result).toEqual({
        widgetType: 'X',
        type: 'timeline',
        username: 'feindura',
      })
    })

    it('can parse into X timeline from x.com URL', async () => {
      const input = 'https://x.com/lukso_io'
      const result = await parsePlatformInput(GRID_WIDGET_TYPE.Enum.X, input)

      expect(result).toEqual({
        widgetType: 'X',
        type: 'timeline',
        username: 'lukso_io',
      })
    })

    it('can parse into X timeline from twitter.com URL', async () => {
      const input = 'https://twitter.com/lukso_io'
      const result = await parsePlatformInput(GRID_WIDGET_TYPE.Enum.X, input)

      expect(result).toEqual({
        widgetType: 'X',
        type: 'timeline',
        username: 'lukso_io',
      })
    })

    it('can parse into X timeline from embed code', async () => {
      const input =
        '<a class="twitter-timeline" href="https://twitter.com/lukso_io?ref_src=twsrc%5Etfw">Tweets by lukso_io</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
      const result = await parsePlatformInput(GRID_WIDGET_TYPE.Enum.X, input)

      expect(result).toEqual({
        widgetType: 'X',
        type: 'timeline',
        username: 'lukso_io',
      })
    })
  })

  describe('X status (post)', () => {
    it('can parse into X status from x.com URL', async () => {
      const input = 'https://x.com/feindura/status/1804519711377436675'
      const result = await parsePlatformInput(GRID_WIDGET_TYPE.Enum.X, input)

      expect(result).toEqual({
        widgetType: 'X',
        type: 'status',
        username: 'feindura',
        id: '1804519711377436675',
      })
    })

    it('can parse into X status from twitter.com URL', async () => {
      const input = 'https://twitter.com/feindura/status/1804519711377436675'
      const result = await parsePlatformInput(GRID_WIDGET_TYPE.Enum.X, input)

      expect(result).toEqual({
        widgetType: 'X',
        type: 'status',
        username: 'feindura',
        id: '1804519711377436675',
      })
    })

    it('can parse into X status from embed code', async () => {
      const input =
        '<blockquote class="twitter-tweet" data-lang="en" data-dnt="true" data-theme="dark"><p lang="en" dir="ltr">Get to know the <a href="https://twitter.com/lukso_io?ref_src=twsrc%5Etfw">@lukso_io</a> ecosystem in 3min 🎧 <a href="https://t.co/UUh23NgdfQ">pic.twitter.com/UUh23NgdfQ</a></p>&mdash; Fabian Vogelsteller (@feindura) <a href="https://twitter.com/feindura/status/1804519711377436675?ref_src=twsrc%5Etfw">June 22, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
      const result = await parsePlatformInput(GRID_WIDGET_TYPE.Enum.X, input)

      expect(result).toEqual({
        widgetType: 'X',
        type: 'status',
        username: 'feindura',
        id: '1804519711377436675',
        theme: 'dark',
        language: 'en',
        donottrack: true,
      })
    })
  })

  describe('X video', () => {
    it('can parse into X video from embed code', async () => {
      const input =
        '<blockquote class="twitter-tweet" data-media-max-width="560"><p lang="en" dir="ltr">Devcon is around the corner, and we’ve got some exciting plans lined up from Nov 9th-16th.<br><br>From the first-ever LUKSO Pink Pop-Up Village to Universal Profile NFC Cards, team talks &amp; side events—there’s plenty to look forward to. Get the details below👇 <a href="https://t.co/2MZvcYghsU">https://t.co/2MZvcYghsU</a></p>&mdash; LUKSO (@lukso_io) <a href="https://twitter.com/lukso_io/status/1852375479275192423?ref_src=twsrc%5Etfw">November 1, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'

      const result = await parsePlatformInput(GRID_WIDGET_TYPE.Enum.X, input)
      expect(result).toEqual({
        widgetType: 'X',
        type: 'video',
        id: '1852375479275192423',
        username: 'lukso_io',
      })
    })
  })
})
