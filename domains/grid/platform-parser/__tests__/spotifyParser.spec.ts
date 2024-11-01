import { describe, expect, it } from 'vitest'

const SPOTIFY_IFRAME_ALLOW =
  'clipboard-write; encrypted-media; fullscreen; picture-in-picture'

describe('SPOTIFY Input Parser', () => {
  it.each([
    [
      'Track URL',
      GRID_WIDGET_TYPE.enum.SPOTIFY,
      'https://open.spotify.com/track/7xGfFoTpQ2E7fRF5lN10tr',
      {
        src: 'https://open.spotify.com/embed/track/7xGfFoTpQ2E7fRF5lN10tr?utm_source=oembed',
        type: 'track',
        id: '7xGfFoTpQ2E7fRF5lN10tr',
        allow: SPOTIFY_IFRAME_ALLOW,
      },
    ],
    [
      'Track Embed Code',
      GRID_WIDGET_TYPE.enum.SPOTIFY,
      '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/2BHj31ufdEqVK5CkYDp9mA?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
      {
        src: 'https://open.spotify.com/embed/track/2BHj31ufdEqVK5CkYDp9mA?utm_source=generator',
        type: 'track',
        id: '2BHj31ufdEqVK5CkYDp9mA',
        allow: SPOTIFY_IFRAME_ALLOW,
      },
    ],
    [
      'Track Embed Code with theme',
      GRID_WIDGET_TYPE.enum.SPOTIFY,
      '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/48K735Rd3UQExzjXH004k1?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
      {
        src: 'https://open.spotify.com/embed/track/48K735Rd3UQExzjXH004k1?utm_source=generator&theme=0',
        type: 'track',
        id: '48K735Rd3UQExzjXH004k1',
        allow: SPOTIFY_IFRAME_ALLOW,
        theme: '0',
      },
    ],
    [
      'Playlist URL',
      GRID_WIDGET_TYPE.enum.SPOTIFY,
      'https://open.spotify.com/playlist/7KFoK4LJ23EncELJwYmTDG',
      {
        src: 'https://open.spotify.com/embed/playlist/7KFoK4LJ23EncELJwYmTDG?utm_source=oembed',
        type: 'playlist',
        id: '7KFoK4LJ23EncELJwYmTDG',
        allow: SPOTIFY_IFRAME_ALLOW,
      },
    ],
    [
      'Playlist Embed Code',
      GRID_WIDGET_TYPE.enum.SPOTIFY,
      '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/7KFoK4LJ23EncELJwYmTDG?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
      {
        src: 'https://open.spotify.com/embed/playlist/7KFoK4LJ23EncELJwYmTDG?utm_source=generator',
        type: 'playlist',
        id: '7KFoK4LJ23EncELJwYmTDG',
        allow: SPOTIFY_IFRAME_ALLOW,
      },
    ],
    [
      'Artist URL',
      GRID_WIDGET_TYPE.enum.SPOTIFY,
      'https://open.spotify.com/artist/4KY9rCrokaoFzvMfX98u1q',
      {
        src: 'https://open.spotify.com/embed/artist/4KY9rCrokaoFzvMfX98u1q?utm_source=oembed',
        type: 'artist',
        id: '4KY9rCrokaoFzvMfX98u1q',
        allow: SPOTIFY_IFRAME_ALLOW,
      },
    ],
    [
      'Artist Embed Code',
      GRID_WIDGET_TYPE.enum.SPOTIFY,
      '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/artist/4KY9rCrokaoFzvMfX98u1q?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
      {
        src: 'https://open.spotify.com/embed/artist/4KY9rCrokaoFzvMfX98u1q?utm_source=generator',
        type: 'artist',
        id: '4KY9rCrokaoFzvMfX98u1q',
        allow: SPOTIFY_IFRAME_ALLOW,
      },
    ],
  ])('correctly parses %s', async (_description, platform, input, expected) => {
    const result = await parsePlatformInput(platform, input)
    expect(result).toEqual(expected)
  })
})
