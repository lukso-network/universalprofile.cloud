<script setup lang="ts">
import { LinkMetadata } from '@lukso/lsp-smart-contracts'

const { connectedProfile } = useConnectedProfile()
const { currentNetwork, isLoadedApp } = storeToRefs(useAppStore())
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
  <div class="relative">
    <div
      :class="{
        'opacity-0': !isLoadedApp,
        'opacity-100': isLoadedApp,
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
              size="large"
              :profile-url="ASSET_LYX_ICON_URL"
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
            :amount="viewedProfile?.balance"
            :symbol="currentNetwork.token.symbol"
            :decimals="ASSET_LYX_DECIMALS"
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
        <AssetBalance
          :balance="viewedProfile?.balance"
          :symbol="currentNetwork.token.symbol"
          :decimals="ASSET_LYX_DECIMALS"
        />
        <AssetSupply
          :token-supply="currentNetwork.token.supply.toString()"
          :symbol="currentNetwork.token.symbol"
          :decimals="ASSET_LYX_DECIMALS"
        />
        <AssetLinks :links="links" />
        <AssetDescription
          :description="$formatMessage('lyx_details_description')"
        />
      </div>
    </div>
    <AppLoader v-if="!isLoadedApp" />
  </div>
</template>
