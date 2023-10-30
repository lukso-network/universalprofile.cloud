<script setup lang="ts">
const tokenAddress = useRouter().currentRoute.value.params?.tokenAddress
const { viewedProfile } = useViewedProfile()
const { connectedProfile } = useConnectedProfile()
const { isConnected, isLoadingAssets } = storeToRefs(useAppStore())
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
        'opacity-0': isLoadingAssets,
        'opacity-100': !isLoadingAssets,
      }"
      class="max-w-content py-20 px-4 mx-auto relative grid grid-cols-[1fr,2fr] gap-12 transition-opacity duration-300"
    >
      <div>
        <lukso-card is-full-width size="small">
          <div
            slot="content"
            class="p-6 flex items-center justify-center sm:py-10 md:py-20"
          >
            <lukso-profile
              v-if="asset"
              size="large"
              :profile-url="asset.icon"
              class="shadow-neutral-above-shadow-1xl rounded-full"
            ></lukso-profile>
          </div>
        </lukso-card>
        <div
          v-if="
            isConnected &&
            viewedProfile?.address === connectedProfile?.address &&
            connectedProfile
          "
        >
          <AssetOwnInfo
            :address="connectedProfile.address"
            :amount="asset?.amount"
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
        <AssetBalance
          v-if="asset?.amount"
          :balance="asset.amount"
          :symbol="asset?.symbol"
          :decimals="asset?.decimals"
        />
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
    <AppLoader v-if="isLoadingAssets" />
  </div>
</template>
