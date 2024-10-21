/**
 * Get grid for a given user address
 *
 * @param address
 */
export const getUserGrid = async (
  address: Address
): Promise<Grid<GridWidgetWithoutCords>[]> => {
  let config: PartialBy<Grid<GridConfigItem>, 'id'>[] = []
  const userConfig = await getGridConfig(address)

  // if user config is invalid we load default one
  if (isConfigValid(userConfig)) {
    config = userConfig as Grid<GridConfigItem>[]
  } else {
    if (gridLog.enabled) {
      gridLog('Invalid config', userConfig)
    }
  }

  return configToGrid(config)
}
