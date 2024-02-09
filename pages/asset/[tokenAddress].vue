<script setup lang="ts">
const tokenAddress = useRouter().currentRoute.value.params?.tokenAddress
const { connectedProfile } = useConnectedProfile()
const { asset, isLoading, isOwned } = useAsset(tokenAddress)

const handleSendAsset = (event: Event) => {
  try {
    event.stopPropagation()
    assertAddress(connectedProfile.value?.address, 'profile')
    assertAddress(asset.value?.address, 'token')
    navigateTo({
      path: sendRoute(connectedProfile.value.address),
      query: {
        asset: asset.value.address,
      },
    })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="relative">
    <AppPageLoader :is-loading="isLoading">
      <div
        class="relative mx-auto grid max-w-content grid-cols-[1fr,2fr] gap-12 px-4 py-6 transition-opacity duration-300"
      >
        <div>
          <lukso-card is-full-width size="small">
            <div
              slot="content"
              class="flex items-center justify-center p-6 sm:py-10 md:py-20"
            >
              <lukso-profile
                v-if="asset"
                size="large"
                :profile-url="
                  getAssetThumb(asset, isLsp7(asset)) ||
                  ASSET_ICON_PLACEHOLDER_URL
                "
                class="rounded-full shadow-neutral-above-shadow-1xl"
              ></lukso-profile>
            </div>
          </lukso-card>
          <div v-if="isOwned">
            <AssetOwnInfo
              :address="connectedProfile?.address"
              :balance="asset?.balance"
              :symbol="asset?.symbol"
              :decimals="asset?.decimals"
              :profile-image-url="connectedProfile?.profileImage?.url"
              :message="$formatMessage('token_details_own')"
            />

            <lukso-button
              is-full-width
              class="mt-12"
              @click="handleSendAsset"
              >{{
                $formatMessage('token_details_send', {
                  token: asset?.symbol || '',
                })
              }}</lukso-button
            >
          </div>
        </div>
        <div>
          <div class="heading-apax-24-medium flex items-center gap-2 pb-2">
            {{ asset?.name }}
            <AssetStandardBadge :standard="asset?.standard" />
          </div>
          <AssetTokenSupply
            :token-supply="asset?.tokenSupply"
            :decimals="asset?.decimals"
            class="pb-8"
          />
          <AssetDescription
            v-if="asset?.description"
            :description="asset.description"
          />
          <AssetImages v-if="asset?.images?.length" :images="asset.images" />
          <AssetLinks
            v-if="asset?.links && !!asset.links.length"
            :links="asset.links"
          />
          <AssetAddress v-if="asset?.address" :address="asset.address" />
        </div>
      </div>
    </AppPageLoader>
  </div>
</template>
