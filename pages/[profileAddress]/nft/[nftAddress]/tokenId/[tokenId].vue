<script setup lang="ts">
import { Asset } from '@/types/assets'

const nftAddress = useRouter().currentRoute.value.params?.nftAddress
const tokenId = useRouter().currentRoute.value.params?.tokenId

const {
  getNft,
  status: profileStatus,
  profile: viewedProfile,
} = useViewedProfileStore()
const { status: connectionStatus, profile: connectedProfile } =
  useConnectedProfileStore()
const nft = ref<Asset>()

watchEffect(() => {
  nft.value = getNft(nftAddress, tokenId)
})

const handleSendAsset = (event: Event) => {
  try {
    event.stopPropagation()
    assertAddress(connectedProfile.address, 'profile')
    assertAddress(nft.value?.address, 'nft')
    navigateTo({
      path: sendRoute(connectedProfile.address),
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
        'opacity-0': profileStatus.isAssetLoading,
        'opacity-100': !profileStatus.isAssetLoading,
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
            <div class="p-4 pt-8 relative">
              <div
                v-if="nft?.creatorAddress"
                class="shadow-neutral-drop-shadow p-2 pr-6 rounded-4 inline-flex -top-6 absolute bg-neutral-100"
              >
                <lukso-profile
                  size="x-small"
                  :profile-url="nft.creatorProfileImage"
                ></lukso-profile>
                <div class="pl-1">
                  <div class="text-neutral-60 paragraph-inter-10-semi-bold">
                    {{ $formatMessage('asset_created_by') }}
                  </div>
                  <lukso-username
                    :name="nft.creatorName"
                    :address="nft.creatorAddress"
                    size="x-small"
                    class="flex"
                    name-color="neutral-20"
                  ></lukso-username>
                </div>
              </div>
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
            connectionStatus.isConnected &&
            viewedProfile.address === connectedProfile.address
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
    <lukso-icon
      name="progress-indicator-alt"
      size="x-large"
      v-if="profileStatus.isAssetLoading"
      class="absolute top-1/2 left-1/2 transform"
    ></lukso-icon>
  </div>
</template>
