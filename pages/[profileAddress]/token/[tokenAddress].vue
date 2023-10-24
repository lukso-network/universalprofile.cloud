<script setup lang="ts">
import { Asset } from '@/types/assets'

const tokenAddress = useRouter().currentRoute.value.params?.tokenAddress
const {
  getToken,
  status: profileStatus,
  profile: viewedProfile,
} = useViewedProfileStore()
const { status: connectionStatus, profile: connectedProfile } =
  useConnectedProfileStore()
const token = ref<Asset>()

watchEffect(() => {
  token.value = getToken(tokenAddress)
})

const handleSendAsset = (event: Event) => {
  try {
    event.stopPropagation()
    assertAddress(connectedProfile.address, 'profile')
    assertAddress(token.value?.address, 'token')
    navigateTo({
      path: sendRoute(connectedProfile.address),
      query: {
        asset: token.value.address,
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
        <lukso-card is-full-width size="small">
          <div
            slot="content"
            class="p-6 flex items-center justify-center sm:py-10 md:py-20"
          >
            <lukso-profile
              v-if="token"
              size="large"
              :profile-url="token.icon"
              class="shadow-neutral-above-shadow-1xl rounded-full"
            ></lukso-profile>
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
            :amount="token?.amount"
            :symbol="token?.symbol"
            :decimals="token?.decimals"
          />

          <lukso-button is-full-width class="mt-4" @click="handleSendAsset">{{
            $formatMessage('token_details_send', {
              token: token?.symbol || '',
            })
          }}</lukso-button>
        </div>
      </div>
      <div>
        <div class="heading-apax-24-medium pb-8">{{ token?.name }}</div>
        <AssetAddress v-if="token?.address" :address="token.address" />
        <AssetBalance
          v-if="token?.amount"
          :balance="token.amount"
          :symbol="token?.symbol"
          :decimals="token?.decimals"
        />
        <AssetSupply
          v-if="token?.tokenSupply"
          :token-supply="token?.tokenSupply"
          :symbol="token?.symbol"
          :decimals="token?.decimals"
        />
        <AssetLinks
          v-if="token?.links && token.links.length > 0"
          :links="token.links"
        />
        <AssetDescription
          v-if="token?.description"
          :description="token.description"
        />
        <AssetImages v-if="token?.images" :images="token.images" />
        <AssetStandardInfo
          v-if="token?.standard"
          :standard="token.standard"
          class="hidden"
        />
      </div>
    </div>
    <AppLoader v-if="profileStatus.isAssetLoading" />
  </div>
</template>
