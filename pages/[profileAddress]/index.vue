<script setup lang="ts">
import { useQueries } from '@tanstack/vue-query'
const viewedProfileAddress = getCurrentProfileAddress()
const results = useQueries({
  queries: [
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
  ],
})
const queries = ref<{ queryKey: string[] }[]>([])
watchEffect(() => {
  if (results.value[3]?.isFetched) {
    queries.value =
      (results.value[3].data as string[] | undefined)?.map((item: string) => {
        return {
          queryKey: ['data', item, 'LSP4Metadata'],
        }
      }) || []
  }
})
const items = useQueries({
  queries,
})
</script>

<template>
  <div class="relative">
    <AppPageLoader>
      <div class="mx-auto max-w-content">
        {{ viewedProfileAddress }}
        <pre v-for="(result, index) in results" v-bind:key="index">
Root {{ index }}:
        {{
            result?.isFetched
              ? JSON.stringify(result?.data, null, '  ')
              : result?.isError
                ? (result?.error as any)?.message || 'error'
                : 'loading'
          }}</pre
        >
        <pre v-for="(result, index) in items" v-bind:key="index">
Dependent {{ index }}:
        {{
            result?.isFetched
              ? JSON.stringify(result?.data, null, '  ')
              : result?.isError
                ? (result?.error as any)?.message || 'error'
                : 'loading'
          }}</pre
        >
      </div>
    </AppPageLoader>
  </div>
</template>
