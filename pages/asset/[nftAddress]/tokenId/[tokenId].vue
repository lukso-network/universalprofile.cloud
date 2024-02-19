<script setup lang="ts">
const nftAddress = useRouter().currentRoute.value.params?.nftAddress
const tokenId = useRouter().currentRoute.value.params?.tokenId
const { asset, isLoading, isOwned } = useAsset(nftAddress, tokenId)

const { connectedProfile } = useConnectedProfile()

const handleSendAsset = (event: Event) => {
  try {
    event.stopPropagation()
    assertAddress(connectedProfile.value?.address, 'profile')
    assertAddress(asset.value?.address, 'nft')
    navigateTo({
      path: sendRoute(connectedProfile.value.address),
      query: {
        asset: asset.value.address,
        tokenId: asset.value.tokenId,
      },
    })
  } catch (error) {
    console.error(error)
  }
}

const assetTokenId = computed(() => {
  return prefixedTokenId(asset.value?.tokenId, asset.value?.tokenIdFormat, 36)
})
</script>

<template>
  <AppPageLoader :is-loading="isLoading">
    <div
      class="relative mx-auto grid max-w-content grid-cols-[1fr,2fr] gap-12 px-4 transition-opacity duration-300"
    >
      <div>
        <lukso-card size="small" shadow="small" is-full-width
          ><div slot="content">
            <div
              class="min-h-[260px] rounded-t-12 bg-neutral-90 bg-cover bg-center"
              :style="`background-image: url(${getAssetThumb(asset)});`"
            ></div>
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
        <div v-if="isOwned">
          <AssetOwnInfo
            :address="connectedProfile?.address"
            :balance="asset?.balance"
            :symbol="asset?.symbol"
            :decimals="0"
            :profile-image-url="connectedProfile?.profileImage?.url"
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
        <AssetTokenId v-if="hasTokenId(asset)" :asset="asset" />
        <AssetDescription
          v-if="asset?.description"
          :description="asset.description"
        />
        <AssetImages v-if="asset?.images?.length" :images="asset.images" />
        <AssetAssets v-if="asset?.assets?.length" :images="asset.assets" />
        <AssetAttributes :attributes="asset?.attributes" />
        <AssetCreators v-if="asset" :asset="asset" />
        <AssetLinks
          v-if="asset?.links && !!asset.links.length"
          :links="asset.links"
        />
        <AssetAddress v-if="asset?.address" :address="asset.address" />
      </div>
    </div>
  </AppPageLoader>
</template>
