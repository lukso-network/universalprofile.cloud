import type { CollectionQuery } from '@/.nuxt/gql/default'

type CollectionFilters = {
  address?: MaybeRef<Address | undefined>
  limit: number
  offset?: number
}

type QueryResult = CollectionQuery

export async function useCollectionGraph(filters: CollectionFilters) {
  const address = unref(filters.address)

  const { collection: collectionData, meta: metaData }: QueryResult =
    await GqlCollection({
      address,
      limit: filters.limit,
      offset: filters.offset,
    })

  const collection =
    collectionData?.map(assetData =>
      createAssetObject(assetData.baseAsset, assetData)
    ) || []

  const meta = {
    total: metaData.aggregate?.count || 0,
  }

  if (graphLog.enabled) {
    graphLog('collection', collection, meta)
  }

  return {
    collection,
    meta,
  }
}
