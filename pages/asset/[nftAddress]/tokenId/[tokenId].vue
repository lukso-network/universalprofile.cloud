<script setup lang="ts">
import { CreatorRepository } from '@/repositories/creator'

import type { Creator } from '@/models/creator'

const nftAddress = useRouter().currentRoute.value.params?.nftAddress
const tokenId = useRouter().currentRoute.value.params?.tokenId

const { connectedProfile, profileImageUrl } = useConnectedProfile()
const { isConnected, isLoadingAssets, isLoadedApp } = storeToRefs(useAppStore())
const { asset } = useAsset(nftAddress, tokenId)
const creatorsRepo = useRepo(CreatorRepository)
const creators = ref<Creator[]>([])
const iconUrl = ref<string>()

const verifiedCreator = computed(() => {
  return creatorsRepo
    .getAssetCreators(nftAddress, tokenId)
    .find(creator => creator?.isVerified)
})

const isOwned = computed(() => {
  return (
    isConnected &&
    connectedProfile &&
    asset.value?.address &&
    asset.value?.balance &&
    connectedProfile.value?.receivedAssetAddresses?.includes(
      asset.value?.address
    )
  )
})

watchEffect(async () => {
  creators.value =
    asset.value?.creatorIds?.map<Creator>(creatorAddress => {
      return creatorsRepo.getCreator(
        creatorAddress,
        asset.value?.address,
        asset.value?.tokenId
      )
    }) || []

  iconUrl.value = await getAssetThumb(asset.value)
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
      class="relative mx-auto grid max-w-content grid-cols-[1fr,2fr] gap-12 px-4 py-20 transition-opacity duration-300"
    >
      <div>
        <lukso-card size="small" is-full-width
          ><div slot="content">
            <div
              class="min-h-[260px] rounded-t-12 bg-neutral-90 bg-cover bg-center"
              :style="`background-image: url(${iconUrl});`"
            ></div>
            <div class="relative p-4">
              <AssetCreator
                :creator="verifiedCreator"
                class="relative -top-4 -mt-4"
              />
              <div>
                <div class="paragraph-inter-14-semi-bold">
                  {{ asset?.name }}
                </div>
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
            :profile-image-url="profileImageUrl"
            :message="$formatMessage('nft_details_own')"
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
        <AssetCreators
          v-if="asset?.creators && !!asset?.creators.length"
          :creators="creators"
        />
        <AssetLinks
          v-if="asset?.links && !!asset.links.length"
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
