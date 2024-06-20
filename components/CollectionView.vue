<script setup lang="ts">
type Props = {
  asset?: Asset | null
}

const props = defineProps<Props>()
const { isMobile } = useDevice()
const asset = computed(() => props.asset)
const assetImage = useAssetImage(asset, false, 880)

const loadMore = async (): Promise<LoadMoreParams> => {
  const { collection: data, meta } = await useCollectionGraph({
    address: asset.value?.address,
    limit: limit.value,
    offset: offset.value,
  })

  return { data, meta }
}

const { offset, limit, isLoading, hasData, data } = useLoadMoreData(loadMore)

const hasLinks = computed(
  () =>
    asset?.value?.resolvedMetadata?.links &&
    asset?.value?.resolvedMetadata?.links?.length > 0
)
</script>

<template>
  <div class="relative mx-auto grid max-w-content pb-28">
    <lukso-card
      variant="dapp"
      :background-url="assetImage?.url"
      shadow="small"
      class="mb-4"
    >
      <div slot="content" class="break-words p-6">
        <div class="grid grid-cols-1 sm:grid-cols-[auto,max-content]">
          <div
            class="heading-inter-17-semi-bold mb-4 flex flex-col gap-2 border-b border-b-neutral-90 pb-4 sm:flex-row sm:items-center sm:gap-3"
          >
            <AssetName :asset="asset" />
            <AssetStandardBadge :asset="asset" />
          </div>
          <div><!-- TBA --></div>
        </div>
        <div class="paragraph-inter-12-regular whitespace-pre-line break-word">
          {{ asset?.resolvedMetadata?.description }}
        </div>
        <ul
          v-if="hasLinks"
          class="mt-4 flex flex-col flex-wrap gap-x-4 gap-y-2 sm:flex-row"
        >
          <li
            v-for="(link, index) in asset?.resolvedMetadata?.links"
            :key="index"
            class="inline-flex"
          >
            <lukso-button
              :size="isMobile ? 'medium' : 'small'"
              :href="link.url"
              is-link
              variant="secondary"
              class="transition hover:opacity-70"
              is-full-width
            >
              <lukso-icon
                name="link"
                :size="isMobile ? 'medium' : 'small'"
                class="mr-2"
              ></lukso-icon>
              {{ link.title }}
            </lukso-button>
          </li>
        </ul>
      </div>
    </lukso-card>
    <div v-if="hasData">
      <NftListGraph :nfts="data" without-title />
    </div>
    <AppLoader
      v-if="isLoading"
      class="absolute bottom-0 left-[calc(50%-20px)]"
    />
  </div>
</template>
