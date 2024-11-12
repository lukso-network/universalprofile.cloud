import { describe, expect, it } from 'vitest'

describe('SPOTIFY Input Parser', () => {
  it.each([
    [
      'Track URL',
      GRID_WIDGET_TYPE.enum.SPOTIFY,
      'https://open.spotify.com/track/7xGfFoTpQ2E7fRF5lN10tr',
      {
        widgetType: 'IFRAME',
        src: 'https://open.spotify.com/embed/track/7xGfFoTpQ2E7fRF5lN10tr',
        allow:
          'clipboard-write; encrypted-media; fullscreen; picture-in-picture',
      },
    ],
    [
      'Track Embed Code',
      GRID_WIDGET_TYPE.enum.SPOTIFY,
      '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/2BHj31ufdEqVK5CkYDp9mA?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
      {
        widgetType: 'IFRAME',
        src: 'https://open.spotify.com/embed/track/2BHj31ufdEqVK5CkYDp9mA?utm_source=generator',
        allow:
          'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
        style: 'border-radius:12px',
        width: '100%',
        allowfullscreen: true,
        frameBorder: 0,
        height: '352',
        loading: 'lazy',
      },
    ],
    [
      'Track Embed Code with theme',
      GRID_WIDGET_TYPE.enum.SPOTIFY,
      '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/48K735Rd3UQExzjXH004k1?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
      {
        widgetType: 'IFRAME',
        src: 'https://open.spotify.com/embed/track/48K735Rd3UQExzjXH004k1?utm_source=generator&theme=0',
        allow:
          'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
        allowfullscreen: true,
        frameBorder: 0,
        height: '352',
        loading: 'lazy',
        style: 'border-radius:12px',
        width: '100%',
      },
    ],
    [
      'Playlist URL',
      GRID_WIDGET_TYPE.enum.SPOTIFY,
      'https://open.spotify.com/playlist/7KFoK4LJ23EncELJwYmTDG',
      {
        widgetType: 'IFRAME',
        src: 'https://open.spotify.com/embed/playlist/7KFoK4LJ23EncELJwYmTDG',
        allow:
          'clipboard-write; encrypted-media; fullscreen; picture-in-picture',
      },
    ],
    [
      'Playlist Embed Code',
      GRID_WIDGET_TYPE.enum.SPOTIFY,
      '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/7KFoK4LJ23EncELJwYmTDG?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
      {
        widgetType: 'IFRAME',
        src: 'https://open.spotify.com/embed/playlist/7KFoK4LJ23EncELJwYmTDG?utm_source=generator',
        allow:
          'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
        allowfullscreen: true,
        frameBorder: 0,
        height: '352',
        loading: 'lazy',
        style: 'border-radius:12px',
        width: '100%',
      },
    ],
    [
      'Artist URL',
      GRID_WIDGET_TYPE.enum.SPOTIFY,
      'https://open.spotify.com/artist/4KY9rCrokaoFzvMfX98u1q',
      {
        widgetType: 'IFRAME',
        src: 'https://open.spotify.com/embed/artist/4KY9rCrokaoFzvMfX98u1q',
        allow:
          'clipboard-write; encrypted-media; fullscreen; picture-in-picture',
      },
    ],
    [
      'Artist Embed Code',
      GRID_WIDGET_TYPE.enum.SPOTIFY,
      '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/artist/4KY9rCrokaoFzvMfX98u1q?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
      {
        widgetType: 'IFRAME',
        src: 'https://open.spotify.com/embed/artist/4KY9rCrokaoFzvMfX98u1q?utm_source=generator',
        allow:
          'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
        allowfullscreen: true,
        frameBorder: 0,
        height: '352',
        loading: 'lazy',
        style: 'border-radius:12px',
        width: '100%',
      },
    ],
    [
      'Show URL',
      GRID_WIDGET_TYPE.enum.SPOTIFY,
      'https://open.spotify.com/show/34UHUOMlsMBf85aNOBhztV?si=5963aa1c2e8b4eef',
      {
        widgetType: 'IFRAME',
        src: 'https://open.spotify.com/embed/show/34UHUOMlsMBf85aNOBhztV?si=5963aa1c2e8b4eef',
        allow:
          'clipboard-write; encrypted-media; fullscreen; picture-in-picture',
      },
    ],
    [
      'Show Embed Code',
      GRID_WIDGET_TYPE.enum.SPOTIFY,
      '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/show/34UHUOMlsMBf85aNOBhztV?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
      {
        widgetType: 'IFRAME',
        src: 'https://open.spotify.com/embed/show/34UHUOMlsMBf85aNOBhztV?utm_source=generator',
        allow:
          'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
        allowfullscreen: true,
        frameBorder: 0,
        height: '352',
        loading: 'lazy',
        style: 'border-radius:12px',
        width: '100%',
      },
    ],
    [
      'Episode URL',
      GRID_WIDGET_TYPE.enum.SPOTIFY,
      'https://open.spotify.com/episode/1D7C6aliI9UjZVstdH69TH?si=ca07d31decff4d29',
      {
        widgetType: 'IFRAME',
        src: 'https://open.spotify.com/embed/episode/1D7C6aliI9UjZVstdH69TH?si=ca07d31decff4d29',
        allow:
          'clipboard-write; encrypted-media; fullscreen; picture-in-picture',
      },
    ],
    [
      'Show Embed Code',
      GRID_WIDGET_TYPE.enum.SPOTIFY,
      '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/1D7C6aliI9UjZVstdH69TH?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
      {
        widgetType: 'IFRAME',
        src: 'https://open.spotify.com/embed/episode/1D7C6aliI9UjZVstdH69TH?utm_source=generator',
        allow:
          'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
        allowfullscreen: true,
        frameBorder: 0,
        height: '352',
        loading: 'lazy',
        style: 'border-radius:12px',
        width: '100%',
      },
    ],
  ])('correctly parses %s', async (_description, platform, input, expected) => {
    const result = await parsePlatformInput(platform, input)
    expect(result).toEqual(expected)
  })
})
