/**
 * Get grid for a given user address
 *
 * @param address
 */
export const getUserGrid = async (address: Address): Promise<Grid[]> => {
  let config: GridConfig[] = []
  const userConfig = await getGridConfig(address)

  // if user config is invalid we load default one
  if (await isConfigValid(userConfig)) {
    config = userConfig as GridConfig[]
  } else {
    if (gridLog.enabled) {
      gridLog('Invalid config', userConfig)
    }
  }

  return configToGrid(config)
}
