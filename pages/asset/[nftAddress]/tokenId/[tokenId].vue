<script setup lang="ts">
import { CreatorRepository } from '@/repositories/creator'

const nftAddress = useRouter().currentRoute.value.params?.nftAddress
const tokenId = useRouter().currentRoute.value.params?.tokenId

const { connectedProfile } = useConnectedProfile()
const { isConnected, isLoadingAssets, isLoadedApp } = storeToRefs(useAppStore())
const { asset } = useAsset(nftAddress, tokenId)
const creatorsRepository = useRepo(CreatorRepository)

const verifiedCreator = computed(() => {
  return creatorsRepository
    .getAssetCreators(nftAddress, tokenId)
    .find(creator => creator?.isVerified)
})

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
</script>

<template>
  <div class="relative">
    <div
      :class="{
        'opacity-0': isLoadingAssets || !isLoadedApp,
        'opacity-100': !isLoadingAssets && isLoadedApp,
      }"
      class="max-w-content py-20 px-4 mx-auto relative grid grid-cols-[1fr,2fr] gap-12 transition-opacity duration-300"
    >
      <div>
        <lukso-card size="small" is-full-width
          ><div slot="content">
            <div
              class="min-h-[260px] bg-neutral-90 w-100 rounded-t-12 bg-center bg-cover"
              :style="`background-image: url(${getAssetThumb(asset)});`"
            ></div>
            <div class="p-4 relative">
              <AssetCreator
                :creator="verifiedCreator"
                class="relative -mt-4 -top-4"
              />
              <div>
                <div class="paragraph-inter-14-semi-bold">
                  {{ asset?.name }}
                </div>
              </div>
            </div>
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
            :decimals="0"
          />

          <lukso-button is-full-width class="mt-4" @click="handleSendAsset">{{
            $formatMessage('token_details_send', {
              token: asset?.symbol || '',
            })
          }}</lukso-button>
        </div>
      </div>
      <div>
        <div class="heading-apax-24-medium pb-8">
          {{ asset?.name }}
        </div>
        <AssetAddress v-if="asset?.address" :address="asset.address" />
        <AssetTokenId v-if="asset?.tokenId" :token-id="asset.tokenId" />
        <AssetSupply
          v-if="asset?.tokenSupply"
          :token-supply="asset?.tokenSupply"
          :symbol="asset?.symbol"
          :decimals="asset.decimals"
        />
        <AssetLinks v-if="asset?.links" :links="asset.links" />
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
