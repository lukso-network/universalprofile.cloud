import { useQuery } from '@tanstack/vue-query'

import type { CollectionAttributesQuery } from '@/.nuxt/gql/default'

type Filters = {
  address?: Address
}

type QueryResult = CollectionAttributesQuery
export type CollectionAttribute = {
  id: string
  group: string
  values: string[]
}

export function useCollectionAttributesGraph(filters: Filters) {
  const { selectedChainId: chainId } = useAppStore()

  return useQuery({
    queryKey: ['collection-attributes', filters.address, chainId],
    queryFn: async () => {
      const { attributes: attributesData }: QueryResult =
        await GqlCollectionAttributes({
          address: filters.address,
        })

      if (graphLog.enabled) {
        graphLog('collection-attributes-raw', attributesData)
      }

      const attributes: CollectionAttribute[] = groupAttributes(attributesData)

      if (graphLog.enabled) {
        graphLog('collection-attributes', attributes)
      }

      return {
        attributes,
      }
    },
  })
}
