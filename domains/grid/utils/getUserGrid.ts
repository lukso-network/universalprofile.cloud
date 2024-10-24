/**
 * Get grid for a given user address
 *
 * @param address
 */
export const getUserGrid = async (address: Address): Promise<Grid[]> => {
  const userConfig = await getGridConfig(address)
  const purifiedConfig = await purifyGridConfig(userConfig)

  return configToGrid(purifiedConfig)
}
