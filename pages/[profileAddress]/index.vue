<script setup lang="ts">
import { useQueries } from '@tanstack/vue-query'
import { hexToNumber, keccak256 } from 'web3-utils'
import ABICoder from 'web3-eth-abi'
import ERC725 from '@erc725/erc725.js'

import { defaultSchema } from '../../utils/queryFunctions'
const viewedProfileAddress = getCurrentProfileAddress()
const rootQueries = computed(() => [
  {
    queryKey: ['data', viewedProfileAddress, 'LSP4Metadata'],
  },
  {
    queryKey: ['data', viewedProfileAddress, 'LSP3Profile'],
  },
  {
    queryKey: ['data', viewedProfileAddress, 'LSP12IssuedAssets[]'],
  },
  {
    queryKey: ['data', viewedProfileAddress, 'LSP5ReceivedAssets[]'],
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
            queryKey: ['data', item, 'LSP4Metadata'],
          },
          {
            queryKey: [
              'call',
              item,
              'tokenIdsOf(address)',
              viewedProfileAddress,
            ],
            select(ids: any) {
              return ABICoder.decodeParameter('bytes32[]', ids)
            },
          },
          ...interfacesToCheck.map((interfacesToCheck: string) => {
            return {
              queryKey: [
                'call',
                item,
                'supportsInterface(bytes4)',
                interfacesToCheck,
              ],
              select(state: any) {
                return hexToNumber(state) !== 0
              },
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
    return items.value
      .filter(
        (_, index: number) =>
          queries.value[index].queryKey[2] === 'tokenIdsOf(address)'
      )
      .flatMap((item: any, index: number) => {
        const query = queries.value[index]
        return item.isFetched
          ? item.data?.map((tokenId: string) => {
              return {
                queryKey: [
                  'call',
                  query.queryKey[1],
                  'getDataForTokenId',
                  tokenId,
                  keccak256('LSP4Metadata'),
                ],
                select(data: any) {
                  if (data === '0x') {
                    return null
                  }
                  return ERC725.decodeData(
                    [{ keyName: 'LSP4Metadata', value: data }],
                    defaultSchema
                  )[0].value
                },
              }
            }) || []
          : []
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
        <pre v-for="(result, index) in results" :key="index">
Root {{ rootQueries[index].queryKey.join(':') }}:
        {{
            result?.isError
              ? (result?.error as any)?.message || 'error'
              : result?.isFetched
                ? JSON.stringify(result?.data, null, '  ')
                : 'loading'
          }}</pre
        >
        <pre v-for="(result, index) in items" :key="index">
Dependent {{ queries[index].queryKey.join(':') }}:
        {{
            result?.isError
              ? (result?.error as any)?.message || 'error'
              : result?.isFetched
                ? JSON.stringify(result?.data, null, '  ')
                : 'loading'
          }}</pre
        >
        <pre v-for="(result, index) in resultsTokenIds" :key="index">
TokenIds {{ tokenIdsQueries[index].queryKey.join(':') }}:
        {{
            result?.isError
              ? (result?.error as any)?.message || 'error'
              : result?.isFetched
                ? JSON.stringify(result?.data, null, '  ')
                : 'loading'
          }}</pre
        >
      </div>
    </AppPageLoader>
  </div>
</template>
