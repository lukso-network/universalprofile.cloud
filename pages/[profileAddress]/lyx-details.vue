<script setup lang="ts">
import type { LinkMetadata } from '@lukso/lsp-smart-contracts'

const { connectedProfile, profileImageUrl } = useConnectedProfile()
const { currentNetwork, isLoadedApp, isTestnet } = storeToRefs(useAppStore())
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

const handleBuyLyx = () => {
  if (isTestnet.value) {
    window.open(TESTNET_FAUCET_URL, '_blank')
  } else {
    try {
      assertAddress(connectedProfile.value?.address, 'profile')
      navigateTo(buyLyxRoute(connectedProfile.value.address))
    } catch (error) {
      console.error(error)
    }
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
      class="relative mx-auto grid max-w-content grid-cols-[1fr,2fr] gap-12 px-4 py-20 transition-opacity duration-300"
    >
      <div>
        <lukso-card is-full-width size="small" shadow="small">
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
            connectedProfile &&
            viewedProfile?.address === connectedProfile?.address
          "
        >
          <AssetOwnInfo
            :address="connectedProfile.address"
            :balance="connectedProfile.balance"
            :symbol="currentNetwork.token.symbol"
            :decimals="ASSET_LYX_DECIMALS"
            :profile-image-url="profileImageUrl"
            :message="$formatMessage('token_details_own')"
          />

          <div class="mt-12 flex flex-col gap-2">
            <lukso-button
              v-if="connectedProfile?.balance !== '0'"
              is-full-width
              variant="secondary"
              @click="handleSendLyx"
              >{{
                $formatMessage('token_details_send', {
                  token: currentNetwork.token.symbol,
                })
              }}</lukso-button
            >
            <lukso-button
              is-full-width
              variant="primary"
              @click="handleBuyLyx"
              >{{
                isTestnet
                  ? $formatMessage('token_details_get_lyx')
                  : $formatMessage('token_details_buy_lyx')
              }}</lukso-button
            >
          </div>
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
    <AppLoader v-if="!isLoadedApp" />
  </div>
</template>
