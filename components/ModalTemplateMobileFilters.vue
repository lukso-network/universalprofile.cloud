<script setup lang="ts">
const { formatMessage } = useIntl()
const { closeModal } = useModal()
const viewedProfileAddress = getCurrentProfileAddress()
const assetsData = useProfileAssetsGraph()({
  profileAddress: viewedProfileAddress,
})
const assets = computed(() => {
  return (
    assetsData.data.value
      // filter by owned/created
      ?.filter(asset => {
        switch (filters.assetType) {
          case 'owned':
            return asset.isOwned && hasBalance(asset) // for owned we need to check if user has balance
          case 'created':
            return asset.isIssued
          default:
            return false
        }
      })
      // filter token/collectible
      .filter(asset => {
        switch (filters.assetGroup) {
          case 'collectibles':
            return isCollectible(asset)
          case 'tokens':
            return isToken(asset)
          default:
            return false
        }
      }) || []
  )
})
const {
  filters,
  setFilters,
  creatorFilterOptions,
  creatorFilterValues,
  isCollectibles,
  collectionFilterOptions,
  collectionFilterValues,
  typeFilterValue,
  typeFilterOptions,
} = useFilters(assets)

const creators = ref<string[]>(filters.creators || [])
const collections = ref<string[]>(filters.collections || [])
const assetType = ref<FiltersAssetType>(filters.assetType)

const confirmModal = async () => {
  await setFilters({
    creators: creators.value,
    collections: collections.value,
    assetType: assetType.value,
  })
  await closeModal()
}

const handleChangeCreator = (customEvent: CustomEvent) => {
  const address = customEvent.detail?.value?.id as Address

  if (creators.value?.includes(address)) {
    creators.value = creators.value?.filter(creator => creator !== address)
  } else {
    creators.value = [...(creators.value || []), address]
  }
}

const handleChangeCollection = (customEvent: CustomEvent) => {
  const collection = customEvent.detail?.value?.id as Address

  if (collections.value?.includes(collection)) {
    collections.value = collections.value?.filter(
      collectionId => collectionId !== collection
    )
  } else {
    collections.value = [...(collections.value || []), collection]
  }
}

const handleChangeType = (customEvent: CustomEvent) => {
  assetType.value = customEvent.detail?.value?.id as FiltersAssetType
}
</script>

<template>
  <div
    class="flex flex-col gap-2 rounded-12 bg-neutral-98 px-6 py-8 text-center"
  >
    <!-- Creator filter -->
    <lukso-select
      size="medium"
      :value="JSON.stringify(creatorFilterValues(creators))"
      :options="JSON.stringify(creatorFilterOptions)"
      :placeholder="formatMessage('asset_filter_creator_placeholder')"
      :is-readonly="
        creatorFilterOptions?.[0]?.id === 'empty' ? true : undefined
      "
      show-selection-counter
      is-full-width
      @on-select="handleChangeCreator"
    ></lukso-select>

    <!-- Collection Filter -->
    <lukso-select
      v-if="isCollectibles"
      size="medium"
      :value="JSON.stringify(collectionFilterValues(collections))"
      :options="JSON.stringify(collectionFilterOptions)"
      :placeholder="formatMessage('asset_filter_collection_placeholder')"
      :is-readonly="
        collectionFilterOptions?.[0]?.id === 'empty' ? true : undefined
      "
      show-selection-counter
      is-full-width
      @on-select="handleChangeCollection"
    ></lukso-select>

    <!-- Type Filter -->
    <lukso-select
      size="medium"
      :value="JSON.stringify(typeFilterValue(assetType))"
      :options="JSON.stringify(typeFilterOptions)"
      is-full-width
      @on-select="handleChangeType"
    ></lukso-select>

    <!-- Buttons -->
    <div class="mt-4 flex gap-2">
      <lukso-button variant="text" @click="closeModal">
        {{ formatMessage('modal_mobile_filter_cancel') }}
      </lukso-button>
      <lukso-button variant="landing" is-full-width @click="confirmModal">
        {{ formatMessage('modal_mobile_filter_confirm') }}
      </lukso-button>
    </div>
  </div>
</template>
