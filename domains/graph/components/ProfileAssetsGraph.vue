<script setup lang="ts">
import { sliceAddress } from '@lukso/web-components/tools'

import type { SelectStringOption } from '@lukso/web-components'

type Props = {
  assets: Asset[]
  isLoading?: boolean
}

const props = defineProps<Props>()

const { formatMessage } = useIntl()
const assets = computed(() => props.assets)
const {
  filters,
  isOwned,
  isTokens,
  isCollectibles,
  setFilters,
  orderedAssets,
  creatorFilterValues,
  creatorFilterOptions,
  collectionFilterOptions,
  collectionFilterValues,
  typeFilterValue,
  typeFilterOptions,
} = useFilters(assets)
const { isMobile } = useDevice()
const { showModal } = useModal()
const orderByOptions = ref<SelectStringOption[]>()

const hasAssets = computed(
  () =>
    (isTokens.value && isOwned.value && matchLyxToken.value) ||
    filteredAssets.value?.length > 0
)

const selectedFiltersCount = computed(() => {
  return (filters.collections?.length || 0) + (filters.creators?.length || 0)
})

const hasFiltersSelected = computed(
  () =>
    (filters.collections &&
      filters.collections?.length > 0 &&
      isSelectedCollectionInAvailableCollections.value) ||
    (filters.creators &&
      filters.creators?.length > 0 &&
      isSelectedCreatorInAvailableCreators.value)
)

const matchLyxToken = computed(() => {
  return (
    (!filters.search || 'lukso'.includes(filters.search.toLowerCase())) &&
    (filters.creators === undefined || filters.creators?.length === 0)
  )
})

const isSelectedCollectionInAvailableCollections = computed(() => {
  return collectionFilterOptions.value.some(option =>
    filters.collections?.includes(option.id)
  )
})

const isSelectedCreatorInAvailableCreators = computed(() => {
  return creatorFilterOptions.value.some(option =>
    filters.creators?.includes(option.id as string)
  )
})

const filteredAssets = computed(() => {
  let assetsFiltered = orderedAssets.value

  // filter by search
  if (filters.search) {
    assetsFiltered = assetsFiltered.filter(asset => {
      const searchValue = filters.search?.toLowerCase()
      return asset.tokenName?.toLowerCase().includes(searchValue || '')
    })
  }

  // combined filters by creator
  assetsFiltered = assetsFiltered.filter(asset => {
    const hasCreatorFilter =
      filters.creators &&
      filters.creators?.length > 0 &&
      isSelectedCreatorInAvailableCreators.value
    const hasCollectionFilter =
      filters?.collections &&
      filters.collections?.length > 0 &&
      isCollectibles.value &&
      isSelectedCollectionInAvailableCollections.value

    if (hasCreatorFilter && !hasCollectionFilter) {
      return hasCreator(asset, filters.creators)
    }

    if (hasCollectionFilter && !hasCreatorFilter) {
      return isInCollection(asset, filters.collections)
    }

    if (hasCreatorFilter && hasCollectionFilter) {
      return (
        hasCreator(asset, filters.creators) ||
        isInCollection(asset, filters.collections)
      )
    }

    return true
  })

  return assetsFiltered
})

const orderByValue = computed(() => {
  return orderByOptions.value?.find(option => option.id === filters.orderBy)
})

const selectedFilters = computed(() => {
  return new Array(selectedFiltersCount.value).map((el, index) => ({
    id: index,
    value: index,
  }))
})

const handleChangeSearch = (customEvent: CustomEvent) => {
  const searchTerm = customEvent.detail?.value
  setFilters({ search: searchTerm })
}

const handleChangeType = (customEvent: CustomEvent) => {
  const assetType = customEvent.detail?.value?.id as FiltersAssetType
  setFilters({ assetType })
}

const handleChangeCollection = (customEvent: CustomEvent) => {
  const collectionAddress = customEvent.detail?.value?.id as string

  if (filters.collections?.includes(collectionAddress)) {
    setFilters({
      collections: filters.collections?.filter(
        collection => collection !== collectionAddress
      ),
    })
  } else {
    setFilters({
      collections: [...(filters.collections || []), collectionAddress],
    })
  }
}

const handleRemoveCollection = (collectionAddress: string) => {
  setFilters({
    collections: filters.collections?.filter(
      item => item !== collectionAddress
    ),
  })
}

const handleChangeCreator = (customEvent: CustomEvent) => {
  const creatorAddress = customEvent.detail?.value?.id as string

  if (filters.creators?.includes(creatorAddress)) {
    setFilters({
      creators: filters.creators?.filter(creator => creator !== creatorAddress),
    })
  } else {
    setFilters({ creators: [...(filters.creators || []), creatorAddress] })
  }
}

const handleRemoveCreator = (creatorAddress: string) => {
  setFilters({
    creators: filters.creators?.filter(item => item !== creatorAddress),
  })
}

const handleSelectOrder = (customEvent: CustomEvent) => {
  const order = customEvent.detail?.value
  setFilters({ orderBy: order.id })
}

const handleMobileFiltersModal = () => {
  showModal({
    template: 'MobileFilters',
    data: { assets: props.assets },
  })
}

const handleMobileSearchModal = () => {
  showModal({
    template: 'MobileSearch',
  })
}

onMounted(async () => {
  orderByOptions.value = [
    { id: 'name-asc', value: formatMessage('filters_order_by_name_asc') },
    { id: 'name-desc', value: formatMessage('filters_order_by_name_desc') },
    {
      id: 'added-asc',
      value: formatMessage('filters_order_by_recently_added'),
    },
    {
      id: 'added-desc',
      value: formatMessage('filters_order_by_lastly_added'),
    },
  ]
})
</script>

<template>
  <div>
    <!-- Mobile Filters -->
    <div v-if="isMobile">
      <div
        class="grid grid-cols-[max-content,max-content,auto,max-content] gap-2 pb-4"
      >
        <!-- Filters modal trigger -->
        <lukso-select
          size="medium"
          :value="JSON.stringify(selectedFilters)"
          :placeholder="formatMessage('asset_filter_mobile_filters')"
          show-selection-counter
          @click="handleMobileFiltersModal"
        ></lukso-select>

        <!-- Search trigger -->
        <lukso-button
          is-icon
          variant="secondary"
          @click="handleMobileSearchModal"
        >
          <lukso-icon name="search" size="medium" class="mx-1"></lukso-icon>
        </lukso-button>

        <!-- Separator -->
        <div></div>

        <!-- Order by -->
        <lukso-select
          size="medium"
          :value="JSON.stringify(orderByValue)"
          :options="JSON.stringify(orderByOptions)"
          is-right
          @on-select="handleSelectOrder"
        ></lukso-select>
      </div>
    </div>

    <!-- Desktop Filters -->
    <div v-else>
      <!-- Filters -->
      <div
        class="grid grid-cols-[auto,20px,max-content] gap-2 pb-4 sm:grid-cols-[auto,100px,max-content]"
      >
        <div class="flex flex-wrap gap-2">
          <!-- Creator filter -->
          <lukso-select
            size="small"
            :value="JSON.stringify(creatorFilterValues(filters.creators))"
            :options="JSON.stringify(creatorFilterOptions)"
            :placeholder="formatMessage('asset_filter_creator_placeholder')"
            :is-readonly="
              creatorFilterOptions?.[0]?.id === 'empty' ? true : undefined
            "
            show-selection-counter
            @on-select="handleChangeCreator"
          ></lukso-select>

          <!-- Collection Filter -->
          <lukso-select
            v-if="isCollectibles"
            size="small"
            :value="JSON.stringify(collectionFilterValues(filters.collections))"
            :options="JSON.stringify(collectionFilterOptions)"
            :placeholder="formatMessage('asset_filter_collection_placeholder')"
            :is-readonly="
              collectionFilterOptions?.[0]?.id === 'empty' ? true : undefined
            "
            show-selection-counter
            @on-select="handleChangeCollection"
          ></lukso-select>

          <!-- Type Filter -->
          <lukso-select
            size="small"
            :value="JSON.stringify(typeFilterValue(filters.assetType))"
            :options="JSON.stringify(typeFilterOptions)"
            @on-select="handleChangeType"
          ></lukso-select>

          <!-- Search Filter -->
          <lukso-search
            .value="filters.search"
            :placeholder="formatMessage('asset_filter_search_placeholder')"
            hide-loading
            has-reset
            size="small"
            @on-search="handleChangeSearch"
            @on-reset="() => setFilters({ search: undefined })"
          ></lukso-search>
        </div>

        <!-- Separator -->
        <div></div>

        <!-- Order by -->
        <lukso-select
          size="small"
          :value="JSON.stringify(orderByValue)"
          :options="JSON.stringify(orderByOptions)"
          is-right
          @on-select="handleSelectOrder"
        ></lukso-select>
      </div>

      <!-- Selected filters -->
      <div v-if="hasFiltersSelected" class="flex flex-wrap gap-y-2 pb-4">
        <!-- Selected creators -->
        <template
          v-for="creatorAddress in filters.creators"
          :key="creatorAddress"
        >
          <lukso-tag
            v-if="creatorFilterValues([creatorAddress])?.[0]?.address"
            is-rounded
            class="mr-2 cursor-pointer"
            @click="() => handleRemoveCreator(creatorAddress)"
          >
            <span v-if="creatorFilterValues([creatorAddress])?.[0]?.name"
              >@{{ creatorFilterValues([creatorAddress])?.[0]?.name }}</span
            >
            <span v-else>{{
              sliceAddress(creatorFilterValues([creatorAddress])?.[0]?.address)
            }}</span>
            <lukso-icon
              name="cross-outline"
              size="small"
              class="ml-1"
            ></lukso-icon>
          </lukso-tag>
        </template>

        <!-- Selected collections -->
        <template v-if="isCollectibles">
          <div
            v-for="collectionAddress in filters.collections"
            :key="collectionAddress"
          >
            <lukso-tag
              v-if="collectionFilterValues([collectionAddress])?.[0]?.value"
              is-rounded
              class="mr-2 cursor-pointer"
              @click="() => handleRemoveCollection(collectionAddress)"
              >{{ collectionFilterValues([collectionAddress])?.[0]?.value }}
              <lukso-icon
                name="cross-outline"
                size="small"
                class="ml-1"
              ></lukso-icon>
            </lukso-tag>
          </div>
        </template>
      </div>
    </div>

    <div>
      <!-- Loading state -->
      <NftListGraph
        v-if="isLoading"
        :nfts="[{ isLoading: true }, { isLoading: true }, { isLoading: true }]"
        without-title
      />

      <!-- List -->
      <div v-else-if="hasAssets" class="pb-10">
        <TokenListGraph
          v-if="isTokens"
          :tokens="filteredAssets"
          :show-lyx="matchLyxToken"
          without-title
        />
        <NftListGraph
          v-if="isCollectibles"
          :nfts="filteredAssets"
          without-title
        />
      </div>

      <!-- Empty state -->
      <div v-else>
        {{ formatMessage('collection_no_results') }}
      </div>
    </div>
  </div>
</template>
