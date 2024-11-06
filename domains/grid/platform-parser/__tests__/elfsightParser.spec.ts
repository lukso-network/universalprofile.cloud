import { describe, expect, it } from 'vitest'

describe('Elfsight Input Parser', () => {
  it.each([
    [
      'Embed code',
      GRID_WIDGET_TYPE.enum.ELFSIGHT,
      '<script src="https://static.elfsight.com/platform/platform.js" async></script><div class="elfsight-app-8473218e-6c60-4958-a6a7-b8c6065e1528" data-elfsight-app-lazy></div>',
      {
        widgetType: 'ELFSIGHT',
        id: '8473218e-6c60-4958-a6a7-b8c6065e1528',
      },
    ],
    [
      'Class name',
      GRID_WIDGET_TYPE.enum.ELFSIGHT,
      'elfsight-app-8473218e-6c60-4958-a6a7-b8c6065e1528',
      {
        widgetType: 'ELFSIGHT',
        id: '8473218e-6c60-4958-a6a7-b8c6065e1528',
      },
    ],
    [
      'UUID',
      GRID_WIDGET_TYPE.enum.ELFSIGHT,
      '8473218e-6c60-4958-a6a7-b8c6065e1528',
      {
        widgetType: 'ELFSIGHT',
        id: '8473218e-6c60-4958-a6a7-b8c6065e1528',
      },
    ],
  ])('correctly parses %s', async (_description, platform, input, expected) => {
    const result = await parsePlatformInput(platform, input)
    expect(result).toEqual(expected)
  })
})
