import type { CollectionAttributesQuery } from '@/.nuxt/gql/default'

type Filters = {
  address?: MaybeRef<Address | undefined>
}

type QueryResult = CollectionAttributesQuery
export type CollectionAttribute = {
  id: string
  group: string
  values: string[]
}

export async function useCollectionAttributesGraph(filters: Filters) {
  const address = unref(filters.address)

  const { attributes: attributesData }: QueryResult =
    await GqlCollectionAttributes({
      address,
    })

  if (graphLog.enabled) {
    graphLog('collection-attributes-raw', attributesData)
  }

  const temp: { [key: string]: string[] } = {}

  for (const { key, value } of attributesData) {
    if (key !== null && key !== undefined) {
      if (!temp[key]) {
        temp[key] = [value as string]
      } else {
        temp[key].push(value as string)
      }
    }
  }

  const attributes: CollectionAttribute[] = Object.keys(temp)
    .map(group => ({
      id: group.toLowerCase().replace(/\s/g, '-'),
      group,
      values: temp[group],
    }))
    .sort((a, b) => a.group.localeCompare(b.group))

  if (graphLog.enabled) {
    graphLog('collection-attributes', attributes)
  }

  return {
    attributes,
  }
}
