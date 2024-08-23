<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core'

import type { SelectStringOption } from '@lukso/web-components'

type Props = {
  asset?: Asset | null
}

const props = defineProps<Props>()
const { isRpc, isGraph } = storeToRefs(useAppStore())
const asset = computed(() => props.asset)
const token = useToken()(asset)
const assetImage = useAssetImage(token, false, 880)
const { formatMessage } = useIntl()
const address = useRouter().currentRoute.value.params?.collectionAddress
const search = ref('')
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
const selectedAttributes = ref<SelectStringOption[]>([])
const orderBy = ref<SelectStringOption>()
const orders = ref<SelectStringOption[]>()

const hasData = computed(() => data.value.length > 0)
const hasFiltersSelected = computed(() => selectedAttributes.value.length > 0)

const loadMore = async (appendData?: boolean) => {
  // we cannot fetch collection using RPC
  if (isRpc.value) {
    return
  }

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
    const { collection: _data, meta } = await useCollectionGraph({
      address,
      limit: limit.value,
      offset: offset.value,
      search: `%${search.value}%`,
      orderBy: orderBy.value?.id || 'asc',
      attributes: unref(selectedAttributes.value),
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

const handleSearch = async (customEvent: CustomEvent) => {
  const searchTerm = customEvent.detail?.value
  search.value = searchTerm
  await loadMore()
}

const handleSelectAttribute = (customEvent: CustomEvent) => {
  const attribute = customEvent.detail?.value as SelectStringOption

  if (selectedAttributes.value.some(value => value.id === attribute.id)) {
    selectedAttributes.value = selectedAttributes.value.filter(
      value => value.id !== attribute.id
    )
  } else {
    selectedAttributes.value = [...selectedAttributes.value, attribute]
  }

  loadMore()
}

const handleRemoveAttribute = (attribute: SelectStringOption) => {
  selectedAttributes.value = selectedAttributes.value.filter(
    value => value.id !== attribute.id
  )
  loadMore()
}

const handleSelectOrder = (customEvent: CustomEvent) => {
  const order = customEvent.detail?.value
  orderBy.value = order
  loadMore()
}

const handleDataProviderSettings = () => {
  navigateTo(settingsDataProviderRoute())
}

useInfiniteScroll(el, () => loadMore(true), { distance: 500 })

onMounted(async () => {
  el.value = document

  orderBy.value = {
    id: 'asc',
    value: formatMessage('filters_order_by_recently_added'),
  }
  orders.value = [
    { id: 'asc', value: formatMessage('filters_order_by_recently_added') },
    { id: 'desc', value: formatMessage('filters_order_by_lastly_added') },
  ]
})
</script>

<template>
  <div class="relative mx-auto grid max-w-content pb-28">
    <!-- Asset info -->
    <lukso-card
      variant="dapp"
      :background-url="assetImage?.url"
      shadow="small"
      class="mb-12"
    >
      <div slot="content" class="break-words p-6">
        <div
          class="mb-4 flex flex-col gap-2 border-b border-b-neutral-90 pb-4 sm:gap-3"
        >
          <div class="grid grid-cols-1 sm:grid-cols-[auto,max-content]">
            <div class="flex flex-col gap-2">
              <div class="heading-inter-17-semi-bold flex gap-2">
                <AssetName :asset="asset" />
                <AssetStandardBadge :asset="asset" />
              </div>
              <AssetCollectionSupply :asset="asset" />
            </div>
            <div>
              <NftListCardCreators
                :asset="token"
                :has-verification="false"
                :is-small="false"
              />
            </div>
          </div>
          <div class="flex justify-start">
            <AssetAddress :asset="asset" without-title show-contract-link />
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <AssetDescription :asset="token" without-title />
          <AssetLinks :asset="token" without-title button-size="small" />
        </div>
      </div>
    </lukso-card>

    <!-- Filters -->
    <div
      v-if="isGraph"
      class="grid grid-cols-[auto,100px,max-content] gap-2 pb-4"
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
          :options="
            JSON.stringify(
              attribute.values.map(value => ({
                id: slug(value),
                value,
                group: attribute.group,
              }))
            )
          "
          :value="
            JSON.stringify(
              selectedAttributes.filter(
                value => value.group === attribute.group
              )
            )
          "
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
        :value="JSON.stringify(orderBy)"
        :options="JSON.stringify(orders)"
        is-right
        @on-select="handleSelectOrder"
      ></lukso-select>
    </div>

    <!-- Selected filters -->
    <div v-if="hasFiltersSelected" class="flex flex-wrap gap-2 pb-4">
      <!-- Selected attributes -->
      <lukso-tag
        v-for="attribute in selectedAttributes"
        :key="attribute.id"
        is-rounded
        class="cursor-pointer"
        @click="() => handleRemoveAttribute(attribute)"
        >{{ attribute.value }}
        <lukso-icon name="cross-outline" size="small" class="ml-1"></lukso-icon>
      </lukso-tag>
    </div>

    <!-- List -->
    <div v-if="hasData">
      <NftListGraph :nfts="data" without-title />
    </div>

    <!-- Empty state -->
    <div v-else-if="!isLoading && isGraph">
      {{ formatMessage('collection_no_results') }}
    </div>

    <!-- RPC warning -->
    <div
      v-if="isRpc"
      class="paragraph-inter-12-regular flex items-center gap-3 rounded-8 bg-sky-85 p-4"
    >
      <lukso-icon name="warning-round"></lukso-icon>
      <div>
        {{ formatMessage('collection_not_avail_front') }}
        <span
          class="paragraph-inter-12-semi-bold cursor-pointer underline"
          @click="handleDataProviderSettings"
          >{{ formatMessage('collection_not_avail_link') }}</span
        >
        {{ formatMessage('collection_not_avail_end') }}
      </div>
    </div>

    <!-- Loading state -->
    <NftListGraph
      v-if="isLoading"
      :nfts="[{ isLoading: true }, { isLoading: true }, { isLoading: true }]"
      without-title
    />
  </div>
</template>
