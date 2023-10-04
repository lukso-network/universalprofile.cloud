<script setup lang="ts">
import { fromWei } from 'web3-utils'

const { profile: connectedProfile, status } = useConnectedProfileStore()
const { profile: viewedProfile } = useViewedProfileStore()
const appStore = useAppStore()

const handleSendAsset = () => {
  try {
    assertAddress(connectedProfile.address, 'profile')
    navigateTo(sendRoute(connectedProfile.address))
  } catch (error) {
    console.error(error)
  }
}

const handleShowLyxDetails = () => {
  navigateTo(lyxDetailsRoute())
}
</script>

<template>
  <lukso-card
    size="small"
    is-hoverable
    is-full-width
    @click="handleShowLyxDetails"
    ><div slot="content" class="p-4 pt-11 flex flex-col justify-center">
      <div class="flex gap-6">
        <div class="flex flex-col items-center">
          <div class="border border-neutral-90 rounded-full p-0.5">
            <lukso-profile
              size="medium"
              profile-url="/images/lyx-token.svg"
            ></lukso-profile>
          </div>
        </div>
        <div class="flex flex-col w-full">
          <div class="heading-inter-14-bold pb-1">LUKSO</div>
          <div class="heading-inter-21-semi-bold flex items-center pb-1">
            <span v-if="viewedProfile.balance">{{
              $formatNumber(fromWei(viewedProfile.balance, 'ether'))
            }}</span>
            <span v-else>0</span>
            <span class="paragraph-inter-14-semi-bold text-neutral-60 ml-2">{{
              appStore.currentNetwork.token
            }}</span>
          </div>
          <div class="paragraph-inter-12-regular pb-4 hidden">$ 123.24</div>
        </div>
      </div>
      <div class="flex justify-end w-full pt-4">
        <lukso-button
          v-if="
            status.isConnected &&
            viewedProfile.address === connectedProfile.address
          "
          size="small"
          variant="secondary"
          @click="handleSendAsset"
          >{{ $formatMessage('button_send') }}</lukso-button
        >
      </div>
    </div>
  </lukso-card>
</template>
