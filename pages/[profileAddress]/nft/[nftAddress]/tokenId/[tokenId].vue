<script setup lang="ts">
import { Asset } from '@/types/assets'

const nftAddress = useRouter().currentRoute.value.params?.nftAddress
const tokenId = useRouter().currentRoute.value.params?.tokenId

const { getNft } = useViewedProfileStore()
const { viewedProfile } = useViewedProfile()
const { connectedProfile } = useConnectedProfile()
const { isConnected, isLoadingAssets } = storeToRefs(useAppStore())
const nft = ref<Asset>()

watchEffect(() => {
  nft.value = getNft(nftAddress, tokenId)
})

const verifiedCreator = computed(() => {
  return nft.value?.creators?.find(creator => creator.isVerified)
})

const handleSendAsset = (event: Event) => {
  try {
    event.stopPropagation()
    assertAddress(connectedProfile.value?.address, 'profile')
    assertAddress(nft.value?.address, 'nft')
    navigateTo({
      path: sendRoute(connectedProfile.value.address),
      query: {
        asset: nft.value.address,
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
        <lukso-card size="small" is-full-width
          ><div slot="content">
            <div
              class="min-h-[260px] bg-neutral-90 w-100 rounded-t-12 bg-center bg-cover"
              :style="`background-image: url(${getAssetThumb(nft)});`"
            ></div>
            <div class="p-4 relative">
              <AssetCreator
                :creator="verifiedCreator"
                class="relative -mt-4 -top-4"
              />
              <div>
                <div class="paragraph-inter-14-semi-bold">
                  {{ nft?.name }}
                </div>
              </div>
            </div>
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
            :profile="connectedProfile"
            :amount="nft?.amount"
            :symbol="nft?.symbol"
            :decimals="0"
          />

          <lukso-button is-full-width class="mt-4" @click="handleSendAsset">{{
            $formatMessage('token_details_send', {
              token: nft?.symbol || '',
            })
          }}</lukso-button>
        </div>
      </div>
      <div>
        <div class="heading-apax-24-medium pb-8">
          {{ nft?.name }}
        </div>
        <AssetAddress v-if="nft?.address" :address="nft.address" />
        <AssetTokenId v-if="nft?.tokenId" :token-id="nft.tokenId" />
        <AssetSupply
          v-if="nft?.tokenSupply"
          :token-supply="nft?.tokenSupply"
          :symbol="nft?.symbol"
          :decimals="nft.decimals"
        />
        <AssetLinks v-if="nft?.links" :links="nft.links" />
        <AssetDescription
          v-if="nft?.description"
          :description="nft.description"
        />
        <AssetImages v-if="nft?.images" :images="nft.images" />
        <AssetStandardInfo
          v-if="nft?.standard"
          :standard="nft.standard"
          class="hidden"
        />
      </div>
    </div>
    <AppLoader v-if="isLoadingAssets" />
  </div>
</template>
