<script setup lang="ts">
import type { Asset } from '@/types/asset'

type Props = {
  asset?: Asset | null
}
const props = defineProps<Props>()

// const { asset, isLoading, isOwned } = useAsset(nftAddress, tokenId)
const connectedProfile = useProfile().connectedProfile()
const token = useToken()(props.asset)
const { showModal } = useModal()
const isLoading = false // TODO: get loading state from useQuery

const handleSendAsset = (event: Event) => {
  try {
    event.stopPropagation()
    assertAddress(connectedProfile?.value?.address, 'profile')
    assertAddress(token.value?.address, 'nft')
    navigateTo({
      path: sendRoute(connectedProfile.value.address),
      query: {
        asset: token.value.address,
        tokenId: token.value.tokenId,
      },
    })
  } catch (error) {
    console.error(error)
  }
}

const assetTokenId = computed(() => {
  return prefixedTokenId(token.value?.tokenId, token.value?.tokenIdFormat, 36)
})

const handlePreviewImage = () => {
  const image = token.value?.resolvedMetadata?.images?.[0]

  if (!image) {
    return
  }

  showModal({
    template: 'AssetImage',
    data: {
      asset: image,
    },
    size: 'auto',
  })
}
</script>

<template>
  <AppPageLoader :is-loading="isLoading">
    <div
      class="relative mx-auto grid max-w-content gap-12 transition-opacity duration-300 md:grid-cols-[1fr,2fr]"
    >
      <div>
        <lukso-card size="small" shadow="small" is-full-width
          ><div slot="content">
            <div class="rounded-t-12 bg-neutral-90">
              <img
                class="min-h-[260px] w-full cursor-pointer rounded-t-12"
                :src="getAssetThumb(asset, true, 260)"
                @click="handlePreviewImage"
                loading="lazy"
              />
            </div>
            <div class="relative p-4">
              <div class="paragraph-inter-14-semi-bold">
                {{ asset?.name }}
                <span
                  class="paragraph-inter-10-semi-bold relative bottom-[1px] text-neutral-60"
                  >{{ asset?.symbol }}</span
                >
              </div>
              <div class="paragraph-ptmono-10-bold mt-1">
                <span v-if="isLsp8(asset)">
                  {{ assetTokenId }}
                </span>
                <span v-else>
                  {{ $formatMessage('token_owned') }}
                  {{ asset?.balance }}
                </span>
              </div>
            </div>
          </div>
        </lukso-card>
        <div v-if="asset?.isOwned">
          <AssetOwnInfo
            :address="connectedProfile?.address"
            :balance="asset?.balance"
            :symbol="asset?.symbol"
            :decimals="0"
            :profile-image-url="
              getOptimizedImage(connectedProfile?.profileImage, 40)
            "
            :message="$formatMessage('nft_details_own')"
          />

          <lukso-button is-full-width class="mt-12" @click="handleSendAsset">{{
            $formatMessage('token_details_send_collectible')
          }}</lukso-button>
        </div>
      </div>
      <div>
        <div class="heading-apax-24-medium flex items-center gap-2 pb-2">
          {{ asset?.name }}
          <AssetStandardBadge :standard="asset?.standard" />
        </div>
        <AssetCollectionSupply
          :token-supply="asset?.tokenSupply"
          :class="{
            'mb-4': hasTokenId(asset),
            'mb-8': !hasTokenId(asset),
          }"
        />
        <AssetTokenId v-if="asset && hasTokenId(asset)" :asset="asset" />
        <AssetDescription
          v-if="token?.resolvedMetadata?.description"
          :description="token?.resolvedMetadata?.description"
        />
        <AssetImages
          v-if="token?.resolvedMetadata?.images?.length"
          :images="token?.resolvedMetadata?.images"
        />
        <AssetAssets
          v-if="token?.resolvedMetadata?.assets?.length"
          :assets="token?.resolvedMetadata?.assets"
        />
        <AssetAttributes :attributes="token?.resolvedMetadata?.attributes" />
        <AssetCreators v-if="token" :asset="token" />
        <AssetLinks
          v-if="token?.resolvedMetadata?.links?.length"
          :links="token?.resolvedMetadata?.links"
        />
        <AssetAddress v-if="token?.address" :address="token.address" />
      </div>
    </div>
  </AppPageLoader>
</template>
