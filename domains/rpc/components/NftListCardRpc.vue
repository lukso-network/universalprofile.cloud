<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import makeBlockie from 'ethereum-blockies-base64'

type Props = {
  asset: Asset
}

const props = defineProps<Props>()

const connectedProfile = useProfile().connectedProfile()
const targetIsVisible = ref(false)
const target = ref<HTMLElement | null>(null)
const asset = computed(() => (targetIsVisible.value ? props.asset : null))
const token = useToken()(asset)
const assetImage = useAssetImage(token, false, 260)
const { showModal } = useModal()
const { isCreated } = useFilters()
const { isMobile, isViewedProfileConnected } = storeToRefs(useAppStore())

const handleShowAsset = () => {
  // created LSP8 assets should navigate to collection
  if (isCreated.value && isLsp8(props.asset)) {
    return navigateTo(collectionRoute(props.asset.address))
  }

  if (isCollection(props.asset)) {
    return showModal({
      template: 'TokenCollection',
      data: {
        address: props.asset.address,
      },
      size: 'medium',
    })
  }

  navigateTo(assetRoute(props.asset.address, props.asset.tokenId))
}

const handleSendAsset = (event: Event) => {
  event.stopPropagation()

  let query: SendQueryParams = {
    asset: props.asset?.address,
    tokenId: props.asset?.tokenId,
  }

  if (isCollectible(props.asset)) {
    query = {
      ...query,
      amount: '1',
    }
  }

  navigateTo({
    path: sendRoute(connectedProfile.value?.address),
    query,
  })
}

const handleBuySellAsset = (event: Event) => {
  event.stopPropagation()
  navigateTo(universalPageAssetUrl(props.asset.address, props.asset.tokenId), {
    external: true,
    open: {
      target: '_blank',
    },
  })
}

const assetTokenId = computed(() => {
  return prefixedTokenId(props.asset?.tokenId, props.asset?.tokenIdFormat, 24)
})

const isLoadedAsset = computed(() => asset.value && !asset.value.isLoading)

onMounted(() => {
  setTimeout(() => {
    useIntersectionObserver(
      target,
      ([{ isIntersecting }], _observerElement) => {
        targetIsVisible.value = targetIsVisible.value || isIntersecting
      },
      {
        rootMargin: '600px', // load images before they appear in viewport
      }
    )
  }, 1)
})
</script>

<template>
  <div ref="target" class="relative flex">
    <lukso-card
      border-radius="small"
      shadow="small"
      is-hoverable
      is-full-width
      class="relative z-10"
      @click="handleShowAsset"
      ><div
        slot="content"
        class="grid h-full grid-rows-[max-content,auto,max-content] rounded-12 bg-neutral-100"
      >
        <AssetImage
          :image="isLoadedAsset ? assetImage : undefined"
          class="max-h-[360px] min-h-[360px] rounded-t-12 md:max-h-[260px] md:min-h-[260px]"
        />
        <div
          class="relative grid grid-rows-[max-content,max-content,auto] p-4 pt-2"
        >
          <div
            class="paragraph-inter-14-semi-bold flex flex-wrap items-center gap-x-1 gap-y-0.5 break-word"
          >
            <span v-if="isLoadedAsset">{{ token?.tokenName }}</span>
            <AppPlaceholderLine v-else class="my-[2px] h-[18px] w-1/2" />
            <span
              v-if="isLoadedAsset"
              class="paragraph-inter-10-semi-bold text-neutral-60"
              >{{ truncate(token?.tokenSymbol, 8) }}</span
            >
            <AppPlaceholderLine v-else class="h-[12px] w-1/4" />
          </div>
          <div v-if="isLoadedAsset" class="paragraph-ptmono-10-bold">
            <span v-if="isCreated">
              {{
                $formatMessage('collection_total_supply', {
                  count: asset?.totalSupply || '0',
                })
              }}
            </span>
            <span v-else-if="isCollection(token)">
              {{
                $formatMessage('token_collection_of', {
                  count: asset?.tokenIdsData?.length.toString() || '0',
                })
              }}
            </span>
            <span v-else-if="isLsp8(token) && asset?.tokenId">
              {{ $formatMessage('token_owned') }}
              {{ assetTokenId }}
            </span>
            <span v-else-if="hasBalance(token)">
              {{ $formatMessage('token_owned') }}
              {{ $formatNumber(getBalance(token)) }}
            </span>
          </div>
          <AppPlaceholderLine v-else class="my-px h-[12px] w-1/4" />
          <NftListCardCreatorsRpc :asset="token" class="mt-4" />

          <!-- Buttons -->
          <div
            class="mt-4 flex w-full items-end justify-end gap-2"
            v-if="!isCollection(asset)"
          >
            <template v-if="isLoadedAsset">
              <lukso-button
                :size="isMobile ? 'medium' : 'small'"
                variant="secondary"
                @click="handleBuySellAsset"
              >
                <span v-if="isViewedProfileConnected">{{
                  $formatMessage('button_sell')
                }}</span>
                <span v-else>{{ $formatMessage('button_buy') }}</span>
              </lukso-button>
              <lukso-button
                v-if="isViewedProfileConnected"
                :size="isMobile ? 'medium' : 'small'"
                variant="secondary"
                @click="handleSendAsset"
                >{{ $formatMessage('button_send') }}</lukso-button
              >
            </template>
            <template v-else>
              <AppPlaceholderLine
                class="h-12 w-[80px] !rounded-12 sm:h-[28px] sm:w-[60px] sm:!rounded-4"
              />
              <AppPlaceholderLine
                class="h-12 w-[80px] !rounded-12 sm:h-[28px] sm:w-[60px] sm:!rounded-4"
              />
            </template>
          </div>
        </div>

        <!-- Bottom -->
        <div
          class="mx-4 flex justify-between border-t border-t-neutral-90 py-3"
        >
          <AssetStandardBadge :asset="asset" />
          <div
            v-if="isLoadedAsset && token?.address"
            class="paragraph-ptmono-10-bold flex items-center gap-1 text-neutral-60"
          >
            <img
              :src="makeBlockie(token.address)"
              alt=""
              class="size-3 rounded-full shadow-neutral-above-shadow-1xl outline outline-neutral-100"
            />
            {{ toChecksumAddress(token?.address).slice(0, 6) }}
          </div>
          <AppPlaceholderLine v-else class="h-[20px] w-1/5" />
        </div>
      </div>
    </lukso-card>
    <div class="absolute bottom-0 w-full px-3">
      <lukso-card
        border-radius="small"
        shadow="small"
        v-if="isCollection(asset)"
        class="relative bottom-[-44px] mx-3 w-[calc(100%-24px)]"
        ><div slot="content" class="h-6 w-full rounded-12 bg-neutral-97"></div
      ></lukso-card>
      <lukso-card
        border-radius="small"
        shadow="small"
        v-if="isCollection(asset)"
        class="relative bottom-[-10px]"
        ><div slot="content" class="h-6 w-full rounded-12 bg-neutral-97"></div
      ></lukso-card>
    </div>
  </div>
</template>
