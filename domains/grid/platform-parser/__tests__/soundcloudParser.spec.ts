import { describe, expect, it } from 'vitest'

describe('SOUNDCLOUD Input Parser', () => {
  it.each([
    [
      'Track Share URL',
      GRID_WIDGET_TYPE.enum.SOUNDCLOUD,
      'https://soundcloud.com/occams-laser/with-you',
      {
        widgetType: 'IFRAME',
        allow:
          'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
        height: '166',
        src: 'https://w.soundcloud.com/player/?url=https://soundcloud.com/occams-laser/with-you',
        width: '100%',
      },
    ],
    [
      'Set Share URL',
      GRID_WIDGET_TYPE.enum.SOUNDCLOUD,
      'https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F505007376&show_artwork=true',
      {
        widgetType: 'IFRAME',
        allow:
          'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
        height: '166',
        src: 'https://w.soundcloud.com/player/?url=https://api.soundcloud.com/playlists/505007376&show_artwork=true',
        width: '100%',
      },
    ],
    [
      'Users Embed Code',
      GRID_WIDGET_TYPE.enum.SOUNDCLOUD,
      'https://soundcloud.com/fabian-vogelsteller',
      {
        widgetType: 'IFRAME',
        allow:
          'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
        height: '166',
        src: 'https://w.soundcloud.com/player/?url=https://soundcloud.com/fabian-vogelsteller',
        width: '100%',
      },
    ],
    [
      'Track Embed Code',
      GRID_WIDGET_TYPE.enum.SOUNDCLOUD,
      '<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/1856391039&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/occams-laser" title="Occams Laser" target="_blank" style="color: #cccccc; text-decoration: none;">Occams Laser</a> · <a href="https://soundcloud.com/occams-laser/with-you" title="With You" target="_blank" style="color: #cccccc; text-decoration: none;">With You</a></div>',
      {
        widgetType: 'IFRAME',
        allow: 'autoplay',
        height: '300',
        src: 'https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/1856391039&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true',
        style: 'color: #cccccc; text-decoration: none;',
        width: '100%',
      },
    ],
    [
      'Track Embed Code with URL encoded characters',
      GRID_WIDGET_TYPE.enum.SOUNDCLOUD,
      '<iframe width="100%" height="400" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F1856391039&show_artwork=true"></iframe>',
      {
        widgetType: 'IFRAME',
        allow:
          'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture',
        height: '400',
        src: 'https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/1856391039&show_artwork=true',
        width: '100%',
      },
    ],
    [
      'Playlist Embed Code',
      GRID_WIDGET_TYPE.enum.SOUNDCLOUD,
      '<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https://api.soundcloud.com/playlists/1850298147&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/vaporwavearchive" title="vaporwave archive" target="_blank" style="color: #cccccc; text-decoration: none;">vaporwave archive</a> · <a href="https://soundcloud.com/vaporwavearchive/sets/middle-mgmt-its-easy-to-talk" title="Middle Mgmt - 夏を語るは易し // it&#x27;s easy to talk about summer" target="_blank" style="color: #cccccc; text-decoration: none;">Middle Mgmt - 夏を語るは易し // it&#x27;s easy to talk about summer</a></div>',
      {
        widgetType: 'IFRAME',
        allow: 'autoplay',
        height: '300',
        src: 'https://w.soundcloud.com/player/?url=https://api.soundcloud.com/playlists/1850298147&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true',
        style: 'color: #cccccc; text-decoration: none;',
        width: '100%',
      },
    ],
  ])('correctly parses %s', async (_description, platform, input, expected) => {
    const result = await parsePlatformInput(platform, input)
    expect(result).toEqual(expected)
  })
})
