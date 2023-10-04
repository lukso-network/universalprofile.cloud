<script setup lang="ts">
import { LinkMetadata } from '@lukso/lsp-factory.js'

const { status: profileStatus, profile: viewedProfile } =
  useViewedProfileStore()
const { status: connectionStatus, profile: connectedProfile } =
  useConnectedProfileStore()
const { currentNetwork } = useAppStore()

const links: LinkMetadata[] = [
  {
    title: 'www.lukso.network',
    url: 'https://lukso.network/',
  },
]

const handleSendLyx = () => {
  try {
    assertAddress(connectedProfile.address, 'profile')
    navigateTo(sendRoute(connectedProfile.address))
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
      class="max-w-[835px] py-20 px-4 mx-auto relative grid grid-cols-[1fr,2fr] gap-12 transition-opacity duration-300"
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
            connectionStatus.isConnected &&
            viewedProfile.address === connectedProfile.address
          "
        >
          <AssetOwnInfo
            :profile="connectedProfile"
            :amount="viewedProfile.balance"
            :symbol="currentNetwork.token.symbol"
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
        <AssetAddress :address="currentNetwork.token.address" />
        <AssetSupply
          :supply="currentNetwork.token.supply.toString()"
          :symbol="currentNetwork.token.symbol"
        />
        <AssetLinks :links="links" />
        <AssetDescription
          :description="$formatMessage('lyx_details_description')"
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
