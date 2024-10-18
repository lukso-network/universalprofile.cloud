/**
 * Default grid config
 *
 * @param address
 * @returns
 */
export const defaultGridConfig = (
  address: string
): PartialBy<Grid<GridConfigItem>, 'id'>[] => {
  return [
    {
      title: DEFAULT_GRID_TITLE,
      grid: [
        {
          type: GRID_WIDGET_TYPE.TITLE_LINK,
          width: 1,
          height: 1,
          properties: { title: address, backgroundColor: '#7a83ae' },
        },
        {
          type: GRID_WIDGET_TYPE.TEXT,
          width: 1,
          height: 1,
          properties: {
            title: 'Hey',
            text: 'Customize your grid layout!',
            backgroundColor: '#9db9b9',
          },
        },
        {
          type: GRID_WIDGET_TYPE.IMAGE,
          width: 1,
          height: 1,
          properties: { src: 'https://via.placeholder.com/150' },
        },
      ],
    },
  ]
}
