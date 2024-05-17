<script setup lang="ts">
const { search } = useAlgoliaSearch<IndexedAsset>('prod_mainnet_assets')

const isLoading = ref(false)
const assetsPool = ref<IndexedAsset[]>([])
const assetsAddresses = ref<Address[]>()

const getAssets = async () => {
  isLoading.value = true
  const searchQuery = {
    query: '',
    requestOptions: {
      hitsPerPage: ASSET_SHOWCASE_POOL_SIZE,
    },
  }

  const assets = await search(searchQuery)

  assetsPool.value = assets.hits.filter((asset, index, self) => {
    return (
      self.findIndex(a => a.address === asset.address) === index &&
      asset?.hasAssetImage
    )
  })

  isLoading.value = false
}

const shuffleAssets = async () => {
  await nextTick()

  const assetIndexes = getDistinctRandomIntegers(
    0,
    assetsPool.value.length - 1,
    ASSET_SHOWCASE_LIMIT
  )

  const randomAssets: IndexedAsset[] = []
  for (const index of assetIndexes) {
    randomAssets.push(assetsPool.value[index])
  }

  assetsAddresses.value = randomAssets.map(asset => asset.address)
}

onMounted(async () => {
  await getAssets()
  await shuffleAssets()
})
</script>

<template>
  <div
    class="flex w-full flex-col justify-center transition-opacity duration-300 md:mb-20"
  >
    <div class="mb-5 flex w-full items-center">
      <div class="heading-inter-21-semi-bold">
        {{ $formatMessage('shuffle_assets_title') }}
      </div>
      <div
        class="ml-4 flex size-10 cursor-pointer items-center justify-center rounded-full border border-neutral-90 bg-neutral-100 transition hover:scale-105 hover:border-neutral-80"
        @click="shuffleAssets"
      >
        <lukso-icon name="reload" />
      </div>
    </div>
    <div
      class="grid grid-cols-1 items-start justify-items-center gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3 xl:grid-cols-4 xl:gap-12"
    >
      <AssetShowcaseItem
        v-for="address in assetsAddresses"
        :key="address"
        :address="address"
      />
    </div>
  </div>
</template>
