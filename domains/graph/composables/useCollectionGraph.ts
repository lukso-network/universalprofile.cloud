import type { CollectionQuery } from '@/.nuxt/gql/default'
import type { SelectStringOption } from '@lukso/web-components'

type CollectionFilters = {
  address?: Address
  limit: number
  offset?: number
  search?: string
  orderBy?: string
  attributes?: SelectStringOption[]
}

type QueryResult = CollectionQuery

export async function useCollectionGraph(filters: CollectionFilters) {
  try {
    const where = {
      _and: [
        whereAssetAddress(filters),
        whereSearch(filters),
        ...whereAttributes(filters),
      ],
    }

    const { collection: collectionData, meta: metaData }: QueryResult =
      await GqlCollection({
        where,
        limit: filters.limit,
        offset: filters.offset,
        orderBy: filters.orderBy,
      })

    if (graphLog.enabled) {
      graphLog('collection', collectionData, metaData)
    }

    const collection =
      collectionData?.map(assetData =>
        createAssetObject(assetData.baseAsset, assetData)
      ) || []

    const meta = {
      total: metaData.aggregate?.count || 0,
    }

    if (assetLog.enabled) {
      assetLog('collection', collection, meta)
    }

    return {
      collection,
      meta,
    }
  } catch (error) {
    console.error(error)
    return {
      collection: [],
      meta: {
        total: 0,
      },
    }
  }
}

const whereAssetAddress = (filters: CollectionFilters) => {
  return { baseAsset_id: { _ilike: filters.address } }
}

const whereSearch = (filters: CollectionFilters) => {
  if (!filters?.search) {
    return {}
  }

  return {
    _or: [
      { formattedTokenId: { _ilike: `%${filters?.search}%` } },
      { tokenId: { _ilike: `%${filters?.search}%` } },
    ],
  }
}

const whereAttributes = (filters: CollectionFilters) => {
  const attributesGrouped: CollectionAttribute[] = groupAttributes(
    filters?.attributes
  )
  const attributes =
    attributesGrouped?.map(({ group, values }) => ({
      attributes: {
        _or: values.map(value => ({
          key: { _eq: group },
          value: { _eq: value },
        })),
      },
    })) || []

  return attributes
}
