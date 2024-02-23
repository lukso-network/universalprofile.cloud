<script setup lang="ts">
import { useQueries } from '@tanstack/vue-query'

const viewedProfileAddress = getCurrentProfileAddress()
const { currentNetwork } = storeToRefs(useAppStore())
const rootQueries = computed(() => [
  {
    queryKey: [
      'data',
      currentNetwork.value.chainId,
      viewedProfileAddress,
      'LSP4Metadata',
    ],
  },
  {
    queryKey: [
      'data',
      currentNetwork.value.chainId,
      viewedProfileAddress,
      'LSP3Profile',
    ],
  },
  {
    queryKey: [
      'data',
      currentNetwork.value.chainId,
      viewedProfileAddress,
      'LSP12IssuedAssets[]',
    ],
  },
  {
    queryKey: [
      'data',
      currentNetwork.value.chainId,
      viewedProfileAddress,
      'LSP5ReceivedAssets[]',
    ],
  },
])
const results = useQueries({
  queries: rootQueries,
})
const queries = computed<{ queryKey: string[] }[]>(() => {
  if (results.value[3]?.isFetched) {
    return ((results.value[3].data as string[] | undefined)?.flatMap(
      (item: string) => {
        return [
          {
            queryKey: [
              'data',
              currentNetwork.value.chainId,
              item,
              'LSP4Metadata',
            ],
          },
          {
            queryKey: [
              'call',
              currentNetwork.value.chainId,
              item,
              'tokenIdsOf(address)',
              viewedProfileAddress,
            ],
          },
          ...interfacesToCheck.map((interfacesToCheck: string) => {
            return {
              queryKey: [
                'call',
                currentNetwork.value.chainId,
                item,
                'supportsInterface(bytes4)',
                interfacesToCheck,
              ],
            }
          }),
        ] as { queryKey: string[] }[]
      }
    ) || []) as { queryKey: string[] }[]
  }
  return [] as { queryKey: string[] }[]
})
const items = useQueries({
  queries,
})
const tokenIdsQueries = computed(() => {
  if (items.value[0]?.isFetched) {
    return items.value.flatMap((item: any, index: number) => {
      if (
        queries.value[index].queryKey[3] === 'tokenIdsOf(address)' &&
        item.isFetched
      ) {
        const query = queries.value[index]
        return item.isFetched && item.data?.map
          ? item.data?.map((tokenId: string) => {
              return {
                queryKey: [
                  'tokenData',
                  currentNetwork.value.chainId,
                  query.queryKey[2],
                  tokenId,
                  'LSP4Metadata',
                ],
              }
            }) || []
          : []
      }
      return []
    }) as { queryKey: string[] }[]
  }
  return [] as { queryKey: string[] }[]
})
const resultsTokenIds = useQueries({
  queries: tokenIdsQueries,
})
</script>

<template>
  <div class="relative">
    <AppPageLoader>
      <div class="mx-auto max-w-content">
        {{ viewedProfileAddress }}
        <div
          class="block rounded-lg border border-gray-200 bg-white p-6"
          v-for="(result, index) in results"
          :key="index"
        >
          <p
            class="mb-2 font-bold tracking-tight"
          >
            Root {{ rootQueries[index].queryKey.join(' ') }}
          </p>
          <p><pre class="overflow-auto">{{
            result?.isError
              ? (result?.error as any)?.message || 'error'
              : result?.isFetched
                ? JSON.stringify(result?.data, null, '  ')
                : 'loading'
          }}</pre></p>
        </div>
        <div
          class="block rounded-lg border border-gray-200 bg-white p-6"
          v-for="(result, index) in items"
          :key="index"
        >
          <p
            class="mb-2 font-bold tracking-tight"
          >
            Dependent {{ queries[index].queryKey.join(' ') }}:
          </p>
          <p><pre class="overflow-auto">{{
            result?.isError
              ? (result?.error as any)?.message || 'error'
              : result?.isFetched
                ? JSON.stringify(result?.data, null, '  ')
                : 'loading'
          }}</pre></p>
        </div>
        <div
          class="block rounded-lg border border-gray-200 bg-white p-6"
          v-for="(result, index) in resultsTokenIds"
          :key="index"
        >
          <p
            class="mb-2 font-bold tracking-tight"
          >
            TokenIds {{ tokenIdsQueries[index].queryKey.join(' ') }}:
          </p>
          <p><pre class="overflow-auto">{{
            result?.isError
              ? (result?.error as any)?.message || 'error'
              : result?.isFetched
                ? JSON.stringify(result?.data, null, '  ')
                : 'loading'
          }}</pre></p>
        </div>
      </div>
    </AppPageLoader>
  </div>
</template>
