import { hexToNumber } from 'web3-utils'

import { INDEXER_API_URL, INDEXER_API_VERSION } from '@/shared/config'

export default defineNuxtPlugin(() => {
  /**
   * Generic fetching function for indexed data
   *
   * @param address - profile or asset address
   * @returns
   */
  const fetchIndexedData = async <T>(address: Address) => {
    const { currentNetwork } = useAppStore()
    const chainId = hexToNumber(currentNetwork.chainId)
    const url = `${INDEXER_API_URL}/${INDEXER_API_VERSION}/${chainId}/address/${address}`
    const response = await fetcher<T, Record<string, never>>({
      url,
      method: 'GET',
    })

    // @ts-ignore
    console.debug(`Algolia API response (${response.type}):`, {
      url,
      response,
    })

    return response
  }

  return {
    provide: {
      fetchIndexedProfile: (address: Address) =>
        fetchIndexedData<IndexedProfile>(address),
      fetchIndexedAsset: (address: Address) =>
        fetchIndexedData<IndexedAsset>(address),
    },
  }
})
