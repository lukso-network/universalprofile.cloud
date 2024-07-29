<script setup lang="ts">
import { sliceAddress } from '@lukso/web-components/tools'

import type {
  SelectProfileOption,
  SelectStringOption,
} from '@lukso/web-components'

type Props = {
  assets: Asset[]
  isLoading?: boolean
}

type Emits = (event: 'on-change-asset-type', id: FiltersAssetType) => void

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const { formatMessage } = useIntl()
const { filters, isOwned, isCreated, isTokens, isCollectibles, setFilters } =
  useFilters()
const orderByOptions = ref<SelectStringOption[]>()
const typeFilterValue = ref<SelectStringOption>()
const typeFilterOptions = ref<SelectStringOption[]>([])
const creatorFilterValue = ref<SelectProfileOption[]>([])

const hasAssets = computed(() =>
  isTokens.value && isOwned.value && matchLyxToken.value
    ? true
    : filteredAssets.value?.length > 0
)
const hasFiltersSelected = computed(
  () =>
    (filters.collections &&
      filters.collections.length > 0 &&
      isSelectedCollectionInAvailableCollections.value) ||
    creatorFilterValue.value.length > 0
)
const matchLyxToken = computed(() => {
  return !filters.search || 'lukso'.includes(filters.search.toLowerCase())
})

const orderedAssets = computed(() => {
  const [orderBy, order] = filters.orderBy.split('-')

  if (orderBy === 'name') {
    return props.assets
      .slice()
      .sort((a, b) => stringSort(a.tokenName, b.tokenName, order))
  }

  // since assets are ordered by default by added date, we need to reverse the array
  if (orderBy === 'added' && order === 'asc') {
    return [...props.assets].reverse()
  }

  return props.assets
})

const isSelectedCollectionInAvailableCollections = computed(() => {
  return collectionFilterOptions.value.some(option =>
    filters.collections?.includes(option.id)
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
    const hasCreatorFilter = creatorFilterValue.value.length > 0
    const hasCollectionFilter =
      filters?.collections &&
      filters.collections?.length > 0 &&
      isCollectibles.value &&
      isSelectedCollectionInAvailableCollections.value

    if (hasCreatorFilter && !hasCollectionFilter) {
      return hasCreator(asset, creatorFilterValue.value)
    }

    if (hasCollectionFilter && !hasCreatorFilter) {
      return isInCollection(asset, filters.collections)
    }

    if (hasCreatorFilter && hasCollectionFilter) {
      return (
        hasCreator(asset, creatorFilterValue.value) ||
        isInCollection(asset, filters.collections)
      )
    }

    return true
  })

  return assetsFiltered
})

const creatorFilterOptions = computed(() => {
  let creators = [] as Creator[]

  // get all creators from assets
  for (const asset of orderedAssets.value) {
    if (asset?.tokenCreatorsData && asset?.tokenCreatorsData?.length > 0) {
      for (const creator of asset.tokenCreatorsData) {
        if (
          creator.address &&
          !creators.some(c => c.address === creator.address)
        ) {
          creators.push(creator)
        }
      }
    } else if (asset.ownerData) {
      if (!creators.some(c => c.address === asset.ownerData?.address)) {
        creators.push(asset.ownerData)
      }
    }
  }

  // sort creators by name
  creators = creators.sort((a, b) => stringSort(a.name, b.name))

  // map to structure of lukso-select component
  const options = creators.map(creator => ({
    id: creator.address?.toLowerCase() || '',
    address: (creator.address?.toLowerCase() as Address) || '',
    name: creator.name || '',
    image: creator?.profileImage?.[0]?.url || '',
  }))

  // add empty option
  if (options.length === 0) {
    options.push({
      id: 'empty',
      address: '0x0',
      image: '',
      name: formatMessage('filters_no_options'),
    })
  }

  return options
})

const collectionFilterOptions = computed(() => {
  const options = orderedAssets.value
    // match only assets that has collections
    .filter(asset => {
      // we mark owned assets as collection when there are 1+ tokenIds
      if (
        isOwned.value &&
        asset?.tokenIdsData &&
        asset.tokenIdsData?.length > 0
      ) {
        return asset
      }

      // we mark created assets as collection when they are LSP8
      if (isCreated.value && isLsp8(asset)) {
        return asset
      }
    })
    // map to structure of lukso-select component
    .map(asset => {
      return {
        id: asset.address?.toLowerCase() || '',
        value: asset.tokenName || '',
      }
    })
    // order by name
    .sort((a, b) => stringSort(a.value, b.value))

  // add empty option
  if (options.length === 0) {
    options.push({ id: 'empty', value: formatMessage('filters_no_options') })
  }

  return options
})

const orderByValue = computed(() => {
  return orderByOptions.value?.find(option => option.id === filters.orderBy)
})

const handleChangeSearch = async (customEvent: CustomEvent) => {
  const searchTerm = customEvent.detail?.value
  setFilters({ search: searchTerm })
}

const handleChangeType = async (customEvent: CustomEvent) => {
  const type = customEvent.detail?.value?.id as FiltersAssetType
  typeFilterValue.value = {
    id: type,
    value: formatMessage(`filters_type_${type}`),
  }
  emits('on-change-asset-type', type)
}

const handleChangeCollection = async (customEvent: CustomEvent) => {
  const value = customEvent.detail?.value

  if (filters.collections?.includes(value)) {
    setFilters({
      collections: filters.collections?.filter(
        collection => collection !== value
      ),
    })
  } else {
    setFilters({ collections: [...(filters.collections || []), value.id] })
  }
}

const handleRemoveCollection = async (collection: string) => {
  setFilters({
    collections: filters.collections?.filter(item => item !== collection),
  })
}

const handleChangeCreator = async (customEvent: CustomEvent) => {
  const value = customEvent.detail?.value

  if (creatorFilterValue.value.includes(value)) {
    creatorFilterValue.value = creatorFilterValue.value.filter(
      creator => creator.id !== value.id
    )
  } else {
    creatorFilterValue.value = [...(creatorFilterValue.value || []), value]
  }
}

const handleRemoveCreator = async (creator: SelectProfileOption) => {
  creatorFilterValue.value = creatorFilterValue.value.filter(
    item => item.id !== creator.id
  )
}

const handleSelectOrder = async (customEvent: CustomEvent) => {
  const order = customEvent.detail?.value
  setFilters({ orderBy: order.id })
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

  typeFilterValue.value = {
    id: filters.assetType,
    value: formatMessage(`filters_type_${filters.assetType}`),
  }
  typeFilterOptions.value = [
    { id: 'owned', value: formatMessage('filters_type_owned') },
    { id: 'created', value: formatMessage('filters_type_created') },
  ]
})

const collectionFilterValues = (collection?: string[]) => {
  return collectionFilterOptions.value.filter(option =>
    collection?.includes(option.id)
  )
}
</script>

<template>
  <div>
    <!-- Filters -->
    <div class="grid grid-cols-[auto,100px,max-content] gap-2 pb-4">
      <div class="flex flex-wrap gap-2">
        <!-- Creator filter -->
        <lukso-select
          size="small"
          :value="JSON.stringify(creatorFilterValue)"
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
          :value="JSON.stringify(typeFilterValue)"
          :options="JSON.stringify(typeFilterOptions)"
          @on-select="handleChangeType"
        ></lukso-select>

        <!-- Search Filter -->
        <lukso-search
          :value="filters.search"
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
    <div v-if="hasFiltersSelected" class="flex flex-wrap gap-2 pb-4">
      <!-- Selected creators -->
      <lukso-tag
        v-for="creator in creatorFilterValue"
        :key="creator.id"
        is-rounded
        class="cursor-pointer"
        @click="() => handleRemoveCreator(creator)"
      >
        <span v-if="creator.name">@{{ creator.name }}</span>
        <span v-else>{{ sliceAddress(creator.address) }}</span>
        <lukso-icon name="cross-outline" size="small" class="ml-1"></lukso-icon>
      </lukso-tag>

      <!-- Selected collections -->
      <div v-if="isCollectibles" class="flex">
        <div v-for="collection in filters.collections" :key="collection">
          <lukso-tag
            v-if="collectionFilterValues([collection])?.[0]?.value"
            is-rounded
            class="mr-2 cursor-pointer"
            @click="() => handleRemoveCollection(collection)"
            >{{ collectionFilterValues([collection])?.[0]?.value }}
            <lukso-icon
              name="cross-outline"
              size="small"
              class="ml-1"
            ></lukso-icon>
          </lukso-tag>
        </div>
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
