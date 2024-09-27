import { describe, expect, it } from 'vitest'
import { parsePlatformInput } from '../gridParser'

const YOUTUBE_IFRAME_ALLOW =
  'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
const SPOTIFY_IFRAME_ALLOW =
  'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
const SOUNDCLOUD_IFRAME_ALLOW =
  'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'

describe('Widget Input Parsing', () => {
  it.each([
    [
      'X (Twitter) Post URL',
      GRID_WIDGET_TYPE.X,
      'https://x.com/feindura/status/1804519711377436675',
      {
        type: GRID_WIDGET_TYPE.X,
        properties: {
          src: 'https://twitter.com/feindura/status/1804519711377436675?ref_src=twsrc%5Etfw',
          embedType: 'post',
        },
      },
    ],
    [
      'X (Twitter) Post Embed Code',
      GRID_WIDGET_TYPE.X,
      '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Get to know the <a href="https://twitter.com/lukso_io?ref_src=twsrc%5Etfw">@lukso_io</a> ecosystem in 3min 🎧 <a href="https://t.co/UUh23NgdfQ">pic.twitter.com/UUh23NgdfQ</a></p>&mdash; Fabian Vogelsteller (@feindura) <a href="https://twitter.com/feindura/status/1804519711377436675?ref_src=twsrc%5Etfw">June 22, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
      {
        type: GRID_WIDGET_TYPE.X,
        properties: {
          src: 'https://twitter.com/feindura/status/1804519711377436675?ref_src=twsrc%5Etfw',
          embedType: 'post',
        },
      },
    ],
    [
      'X (Twitter) Timeline URL',
      GRID_WIDGET_TYPE.X,
      'https://twitter.com/lukso_io',
      {
        type: GRID_WIDGET_TYPE.X,
        properties: {
          src: 'https://twitter.com/lukso_io?ref_src=twsrc%5Etfw',
          embedType: 'timeline',
        },
      },
    ],
    [
      'X (Twitter) Timeline Embed Code',
      GRID_WIDGET_TYPE.X,
      '<a class="twitter-timeline" href="https://twitter.com/lukso_io?ref_src=twsrc%5Etfw">Tweets by lukso_io</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
      {
        type: GRID_WIDGET_TYPE.X,
        properties: {
          src: 'https://twitter.com/lukso_io?ref_src=twsrc%5Etfw',
          embedType: 'timeline',
        },
      },
    ],
    [
      'Instagram Post Embed Code',
      GRID_WIDGET_TYPE.INSTAGRAM,
      '<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/C98OXs6yhAq/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background: #fff; border: 0; border-radius: 3px; box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.5), 0 1px 10px 0 rgba(0, 0, 0, 0.15); margin: 1px; max-width: 540px; min-width: 326px; padding: 0; width: 99.375%; width: -webkit-calc(100% - 2px); width: calc(100% - 2px); "> <div style="padding: 16px"> <a href="https://www.instagram.com/p/C98OXs6yhAq/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background: #ffffff; line-height: 0; padding: 0 0; text-align: center; text-decoration: none; width: 100%; " target="_blank" > <div style=" display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px; " > <div style=" background-color: #f4f4f4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px; " ></div></div ></a> <p style=" color: #c9c8cd; font-family: Arial, sans-serif; font-size: 14px; line-height: 17px; margin-bottom: 0; margin-top: 8px; overflow: hidden; padding: 8px 0 7px; text-align: center; text-overflow: ellipsis; white-space: nowrap; " > <a href="https://www.instagram.com/p/C98OXs6yhAq/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color: #c9c8cd; font-family: Arial, sans-serif; font-size: 14px; font-style: normal; font-weight: normal; line-height: 17px; text-decoration: none; " target="_blank" >A post shared by Red Hot Chili Peppers (@chilipeppers)</a > </p> </div></blockquote><script async src="//www.instagram.com/embed.js"></script>',
      {
        type: GRID_WIDGET_TYPE.INSTAGRAM,
        properties: {
          src: 'https://www.instagram.com/p/C98OXs6yhAq/?utm_source=ig_embed&amp;utm_campaign=loading',
        },
      },
    ],
    [
      'YouTube URL',
      GRID_WIDGET_TYPE.YOUTUBE,
      'https://www.youtube.com/watch?v=Vw4JE64hsO8',
      {
        type: GRID_WIDGET_TYPE.IFRAME,
        properties: {
          src: 'https://www.youtube.com/embed/Vw4JE64hsO8',
          allow: YOUTUBE_IFRAME_ALLOW,
        },
      },
    ],
    [
      'YouTube Embed Code',
      GRID_WIDGET_TYPE.YOUTUBE,
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/Vw4JE64hsO8?si=OwVdFZCStaL90G2W" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
      {
        type: GRID_WIDGET_TYPE.IFRAME,
        properties: {
          src: 'https://www.youtube.com/embed/Vw4JE64hsO8',
          allow: YOUTUBE_IFRAME_ALLOW,
        },
      },
    ],
    [
      'Spotify Track URL',
      GRID_WIDGET_TYPE.SPOTIFY,
      'https://open.spotify.com/track/7xGfFoTpQ2E7fRF5lN10tr',
      {
        type: GRID_WIDGET_TYPE.SPOTIFY,
        properties: {
          src: 'https://open.spotify.com/embed/track/7xGfFoTpQ2E7fRF5lN10tr?utm_source=generator',
          allow: SPOTIFY_IFRAME_ALLOW,
          embedType: 'track',
        },
      },
    ],
    [
      'Spotify Track Embed Code',
      GRID_WIDGET_TYPE.SPOTIFY,
      '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/2BHj31ufdEqVK5CkYDp9mA?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
      {
        type: GRID_WIDGET_TYPE.SPOTIFY,
        properties: {
          src: 'https://open.spotify.com/embed/track/2BHj31ufdEqVK5CkYDp9mA?utm_source=generator',
          allow: SPOTIFY_IFRAME_ALLOW,
          embedType: 'track',
        },
      },
    ],
    [
      'Spotify Playlist URL',
      GRID_WIDGET_TYPE.SPOTIFY,
      'https://open.spotify.com/playlist/7KFoK4LJ23EncELJwYmTDG',
      {
        type: GRID_WIDGET_TYPE.SPOTIFY,
        properties: {
          src: 'https://open.spotify.com/embed/playlist/7KFoK4LJ23EncELJwYmTDG?utm_source=generator',
          allow: SPOTIFY_IFRAME_ALLOW,
          embedType: 'playlist',
        },
      },
    ],
    [
      'Spotify Playlist Embed Code',
      GRID_WIDGET_TYPE.SPOTIFY,
      '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/7KFoK4LJ23EncELJwYmTDG?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
      {
        type: GRID_WIDGET_TYPE.SPOTIFY,
        properties: {
          src: 'https://open.spotify.com/embed/playlist/7KFoK4LJ23EncELJwYmTDG?utm_source=generator',
          allow: SPOTIFY_IFRAME_ALLOW,
          embedType: 'playlist',
        },
      },
    ],
    [
      'Spotify Artist URL',
      GRID_WIDGET_TYPE.SPOTIFY,
      'https://open.spotify.com/artist/4KY9rCrokaoFzvMfX98u1q',
      {
        type: GRID_WIDGET_TYPE.SPOTIFY,
        properties: {
          src: 'https://open.spotify.com/embed/artist/4KY9rCrokaoFzvMfX98u1q?utm_source=generator',
          allow: SPOTIFY_IFRAME_ALLOW,
          embedType: 'artist',
        },
      },
    ],
    [
      'Spotify Artist Embed Code',
      GRID_WIDGET_TYPE.SPOTIFY,
      '<iframe style="border-radius:12px" src="https://open.spotify.com/embed/artist/4KY9rCrokaoFzvMfX98u1q?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>',
      {
        type: GRID_WIDGET_TYPE.SPOTIFY,
        properties: {
          src: 'https://open.spotify.com/embed/artist/4KY9rCrokaoFzvMfX98u1q?utm_source=generator',
          allow: SPOTIFY_IFRAME_ALLOW,
          embedType: 'artist',
        },
      },
    ],
    [
      'SoundCloud Track Embed Code',
      GRID_WIDGET_TYPE.SOUNDCLOUD,
      '<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1856391039&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/occams-laser" title="Occams Laser" target="_blank" style="color: #cccccc; text-decoration: none;">Occams Laser</a> · <a href="https://soundcloud.com/occams-laser/with-you" title="With You" target="_blank" style="color: #cccccc; text-decoration: none;">With You</a></div>',
      {
        type: GRID_WIDGET_TYPE.IFRAME,
        properties: {
          src: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1856391039&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true',
          allow: SOUNDCLOUD_IFRAME_ALLOW,
          embedType: 'tracks',
        },
      },
    ],
    [
      'SoundCloud Playlist Embed Code',
      GRID_WIDGET_TYPE.SOUNDCLOUD,
      '<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1850298147&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/vaporwavearchive" title="vaporwave archive" target="_blank" style="color: #cccccc; text-decoration: none;">vaporwave archive</a> · <a href="https://soundcloud.com/vaporwavearchive/sets/middle-mgmt-its-easy-to-talk" title="Middle Mgmt - 夏を語るは易し // it&#x27;s easy to talk about summer" target="_blank" style="color: #cccccc; text-decoration: none;">Middle Mgmt - 夏を語るは易し // it&#x27;s easy to talk about summer</a></div>',
      {
        type: GRID_WIDGET_TYPE.IFRAME,
        properties: {
          src: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1850298147&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true',
          allow: SOUNDCLOUD_IFRAME_ALLOW,
          embedType: 'playlists',
        },
      },
    ],
  ])('correctly parses %s', (_description, platform, input, expected) => {
    const result = parsePlatformInput(platform, input)
    expect(result).toEqual(expected)
  })
})
