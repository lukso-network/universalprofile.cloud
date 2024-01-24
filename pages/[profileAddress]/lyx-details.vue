<script setup lang="ts">
import type { LinkMetadata } from '@lukso/lsp-smart-contracts'

const { connectedProfile } = useConnectedProfile()
const { currentNetwork } = storeToRefs(useAppStore())
const { viewedProfile } = useViewedProfile()
const { isConnected } = storeToRefs(useAppStore())

const links: LinkMetadata[] = [
  {
    title: 'www.lukso.network',
    url: 'https://lukso.network/',
  },
]

const handleSendLyx = () => {
  try {
    assertAddress(connectedProfile.value?.address, 'profile')
    navigateTo(sendRoute(connectedProfile.value.address))
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <AppPageLoader>
    <div
      class="relative mx-auto grid max-w-content grid-cols-[1fr,2fr] gap-12 px-4 py-20 transition-opacity duration-300"
    >
      <div>
        <lukso-card is-full-width size="small">
          <div
            slot="content"
            class="flex items-center justify-center p-6 sm:py-10 md:py-20"
          >
            <lukso-profile
              size="large"
              :profile-url="ASSET_LYX_ICON_URL"
              class="rounded-full shadow-neutral-above-shadow-1xl"
            ></lukso-profile>
          </div>
        </lukso-card>
        <div
          v-if="
            isConnected &&
            viewedProfile?.address === connectedProfile?.address &&
            connectedProfile?.balance !== '0' &&
            connectedProfile
          "
        >
          <AssetOwnInfo
            :address="connectedProfile.address"
            :balance="connectedProfile.balance"
            :symbol="currentNetwork.token.symbol"
            :decimals="ASSET_LYX_DECIMALS"
            :profile-image-url="connectedProfile.profileImage?.url"
            :message="$formatMessage('token_details_own')"
          />

          <lukso-button is-full-width class="mt-4" @click="handleSendLyx">{{
            $formatMessage('token_details_send', {
              token: currentNetwork.token.symbol,
            })
          }}</lukso-button>
        </div>
      </div>
      <div>
        <div class="heading-apax-24-medium pb-8">
          {{ $formatMessage('lyx_details_title') }}
        </div>
        <AssetSupply
          :token-supply="currentNetwork.token.supply"
          :symbol="currentNetwork.token.symbol"
          :decimals="ASSET_LYX_DECIMALS"
        />
        <AssetLinks :links="links" />
        <AssetDescription
          :description="$formatMessage('lyx_details_description')"
        />
      </div>
    </div>
  </AppPageLoader>
</template>
