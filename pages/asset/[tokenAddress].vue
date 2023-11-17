<script setup lang="ts">
const tokenAddress = useRouter().currentRoute.value.params?.tokenAddress
const { connectedProfile } = useConnectedProfile()
const { isConnected, isLoadingAssets, isLoadedApp } = storeToRefs(useAppStore())
const { asset } = useAsset(tokenAddress)

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
    <div
      :class="{
        'opacity-0': isLoadingAssets || !isLoadedApp,
        'opacity-100': !isLoadingAssets && isLoadedApp,
      }"
      class="relative mx-auto grid max-w-content grid-cols-[1fr,2fr] gap-12 px-4 py-20 transition-opacity duration-300"
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
              :profile-url="asset.icon"
              class="rounded-full shadow-neutral-above-shadow-1xl"
            ></lukso-profile>
          </div>
        </lukso-card>
        <div
          v-if="
            isConnected &&
            connectedProfile &&
            asset?.address &&
            connectedProfile?.receivedAssetIds?.includes(asset?.address)
          "
        >
          <AssetOwnInfo
            :address="connectedProfile.address"
            :balance="asset?.balance"
            :symbol="asset?.symbol"
            :decimals="asset?.decimals"
          />

          <lukso-button is-full-width class="mt-4" @click="handleSendAsset">{{
            $formatMessage('token_details_send', {
              token: asset?.symbol || '',
            })
          }}</lukso-button>
        </div>
      </div>
      <div>
        <div class="heading-apax-24-medium pb-8">{{ asset?.name }}</div>
        <AssetAddress v-if="asset?.address" :address="asset.address" />
        <AssetSupply
          v-if="asset?.tokenSupply"
          :token-supply="asset?.tokenSupply"
          :symbol="asset?.symbol"
          :decimals="asset?.decimals"
        />
        <AssetLinks
          v-if="asset?.links && asset.links.length > 0"
          :links="asset.links"
        />
        <AssetDescription
          v-if="asset?.description"
          :description="asset.description"
        />
        <AssetImages v-if="asset?.images?.length" :images="asset.images" />
        <AssetStandardInfo
          v-if="asset?.standard"
          :standard="asset.standard"
          class="hidden"
        />
      </div>
    </div>
    <AppLoader v-if="isLoadingAssets || !isLoadedApp" />
  </div>
</template>
