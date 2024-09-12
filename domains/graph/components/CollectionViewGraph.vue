<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core'

import type { FiltersAttribute } from '@/types/filters'
import type { SelectStringOption } from '@lukso/web-components'

type Props = {
  asset?: Asset | null
}

defineProps<Props>()
const { isMobile } = storeToRefs(useAppStore())
const { formatMessage } = useIntl()
const address = useRouter().currentRoute.value.params?.collectionAddress
const { showModal } = useModal()
const { filters, setFilters, attributeFilterOptions, attributeFilterValues } =
  useFilters(toRef([]), {
    orderBy: 'added-asc',
  } as Filters)
const isLoading = ref(false)
const limit = ref(60)
const offset = ref(0)
const total = ref<number | null>(null)
const data = ref<Asset[]>([])
const el = ref<Document | null>(null)
const { data: attributesData, isLoading: isLoadingAttributes } =
  useCollectionAttributesGraph({
    address,
  })
const orderByOptions = ref<SelectStringOption[]>()

const orderByValue = computed(() => {
  return orderByOptions.value?.find(option => option.id === filters.orderBy)
})

const hasData = computed(() => data.value.length > 0)
const hasFiltersSelected = computed(
  () => filters?.attributes && filters.attributes?.length > 0
)

const loadMore = async (appendData?: boolean) => {
  if (isLoading.value) {
    return
  }

  // in new query mode we reset the offset and total
  if (!appendData) {
    offset.value = 0
    total.value = null
    data.value = []
  }

  // if we reached the end of the collection
  if (total.value !== null && offset.value >= total.value) {
    return
  }

  isLoading.value = true
  await sleep(250)

  try {
    const [, order] = filters.orderBy.split('-')
    const { collection: _data, meta } = await useCollectionGraph({
      address,
      limit: limit.value,
      offset: offset.value,
      search: filters.search,
      orderBy: order,
      attributes: filters.attributes
        ? JSON.parse(filters.attributes)
        : undefined,
    })

    offset.value = offset.value + limit.value
    total.value = meta.total

    if (appendData) {
      data.value = data.value.concat(_data)
    } else {
      data.value = _data
    }
  } catch (error) {
    console.error(error)
    return
  } finally {
    isLoading.value = false
  }
}

const handleSearch = (customEvent: CustomEvent) => {
  const searchTerm = customEvent.detail?.value
  setFilters({ search: searchTerm })
}

const handleSelectAttribute = (customEvent: CustomEvent) => {
  const option = customEvent.detail?.value as SelectStringOption
  const attribute = {
    group: option.group as string,
    value: option.value,
  }

  const attributes = JSON.parse(
    filters.attributes || '[]'
  ) as FiltersAttribute[]
  let attributesUpdated = []

  if (
    attributes?.some(
      value =>
        value.group === attribute.group && value.value === attribute.value
    )
  ) {
    attributesUpdated = attributes?.filter(
      value =>
        value.group !== attribute.group || value.value !== attribute.value
    )
  } else {
    attributesUpdated = [...attributes, attribute]
  }

  setFilters({
    attributes:
      attributesUpdated.length > 0
        ? JSON.stringify(attributesUpdated)
        : undefined,
  })
}

const handleRemoveAttribute = (attribute: SelectStringOption) => {
  const selectedAttributes = filters.attributes
    ? (JSON.parse(filters.attributes) as FiltersAttribute[])
    : []
  const attributesUpdated = selectedAttributes?.filter(
    value => value.group !== attribute.group || value.value !== attribute.value
  )

  setFilters({
    attributes:
      attributesUpdated.length > 0
        ? JSON.stringify(attributesUpdated)
        : undefined,
  })
}

const handleSelectOrder = (customEvent: CustomEvent) => {
  const order = customEvent.detail?.value
  setFilters({ orderBy: order.id })
}

const handleMobileFiltersModal = () => {
  showModal({
    template: 'MobileCollectionFilters',
  })
}

const handleMobileSearchModal = () => {
  showModal({
    template: 'MobileSearch',
  })
}

useInfiniteScroll(el, () => loadMore(true), { distance: 500 })

onMounted(async () => {
  el.value = document

  orderByOptions.value = [
    {
      id: 'added-asc',
      value: formatMessage('filters_order_by_recently_added'),
    },
    { id: 'added-desc', value: formatMessage('filters_order_by_lastly_added') },
  ]
})

watch(
  () => filters,
  async () => await loadMore(),
  { deep: true }
)
</script>

<template>
  <div class="relative mx-auto grid max-w-content pb-28">
    <!-- Asset info -->
    <CollectionAssetCard :asset="asset" />

    <!-- Mobile Filters -->
    <div v-if="isMobile">
      <div
        class="grid grid-cols-[max-content,max-content,auto,max-content] gap-2 pb-4"
      >
        <!-- Filters modal trigger -->
        <lukso-select
          size="medium"
          :value="
            JSON.stringify(filters?.attributes ? filters?.attributes : [])
          "
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
          <!-- Attributes loading state -->
          <div v-if="isLoadingAttributes" class="flex gap-2">
            <AppPlaceholderLine class="h-[28px] w-[100px] rounded-8" />
            <AppPlaceholderLine class="h-[28px] w-[100px] rounded-8" />
            <AppPlaceholderLine class="h-[28px] w-[100px] rounded-8" />
          </div>

          <!-- Attributes filter -->
          <lukso-select
            v-for="attribute in attributesData?.attributes"
            :key="attribute.id"
            size="small"
            :placeholder="attribute.group"
            show-selection-counter
            :options="JSON.stringify(attributeFilterOptions(attribute))"
            :value="JSON.stringify(attributeFilterValues(attribute))"
            @on-select="handleSelectAttribute"
          ></lukso-select>

          <!-- Search filter -->
          <lukso-search
            size="small"
            hide-loading
            :placeholder="formatMessage('collection_filter_search_placeholder')"
            @on-search="handleSearch"
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
        <!-- Selected attributes -->
        <lukso-tag
          v-for="attribute in JSON.parse(filters.attributes || '[]')"
          :key="`${attribute.group}-${attribute.value}`"
          is-rounded
          class="cursor-pointer"
          @click="() => handleRemoveAttribute(attribute)"
          >{{ attribute.value }}
          <lukso-icon
            name="cross-outline"
            size="small"
            class="ml-1"
          ></lukso-icon>
        </lukso-tag>
      </div>
    </div>

    <!-- List -->
    <div v-if="hasData">
      <NftListGraph :nfts="data" without-title />
    </div>

    <!-- Empty state -->
    <div v-else-if="!isLoading">
      {{ formatMessage('collection_no_results') }}
    </div>

    <!-- Loading state -->
    <NftListGraph
      v-if="isLoading"
      :nfts="[{ isLoading: true }, { isLoading: true }, { isLoading: true }]"
      without-title
    />
  </div>
</template>
