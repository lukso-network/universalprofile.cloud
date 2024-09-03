import { useQueries } from '@tanstack/vue-query'
import { keccak256 } from 'web3-utils'

import { browserProcessMetadata } from '@/utils/processMetadata'

import type { QFQueryOptions } from '@/utils/queryFunctions'
import type { LSP3ProfileMetadataJSON } from '@lukso/lsp-smart-contracts'

export function useProfiles() {
  return (_profileAddresses: MaybeRef<Address[] | undefined>) => {
    const queries = computed(() => {
      const { selectedChainId: chainId } = useAppStore()
      const profileAddresses = unref(_profileAddresses) || []

      const queries = profileAddresses.map((address: Address) => {
        return queryGetData({
          chainId,
          address,
          keyName: 'LSP3Profile',
          process: data => browserProcessMetadata(data, keccak256),
        })
      }) as QFQueryOptions[] & { profileAddresses: Address[] }
      queries.profileAddresses = profileAddresses
      return queries
    })
    return useQueries({
      queries,
      combine: results => {
        const profileAddress = queries.value.profileAddresses
        if (profileAddress.length === 0) {
          return null
        }

        const isLoading = results.some(result => result.isLoading)

        const profiles = results.map(result => {
          const profileData = result.data as LSP3ProfileMetadataJSON
          const { name } = profileData?.LSP3Profile || {}
          const address = profileAddress[results.indexOf(result)]

          return {
            address,
            name,
          } as Profile
        })

        return {
          profiles,
          isLoading,
        }
      },
    })
  }
}
