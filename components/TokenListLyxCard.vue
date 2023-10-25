<script setup lang="ts">
const { profile: connectedProfile, status } = useConnectedProfileStore()
const appStore = useAppStore()
const { viewedProfile } = useViewedProfile()
const contentRef = ref()
const logoRef = ref()
const symbolRef = ref()
const balanceWidthPx = ref(0)

const handleSendAsset = (event: Event) => {
  try {
    event.stopPropagation()
    assertAddress(connectedProfile.address, 'profile')
    navigateTo(sendRoute(connectedProfile.address))
  } catch (error) {
    console.error(error)
  }
}

const handleShowLyxDetails = () => {
  try {
    assertAddress(viewedProfile.value?.address, 'profile')
    navigateTo(lyxDetailsRoute(viewedProfile.value.address))
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  const resizeObserver = new ResizeObserver(() => {
    const GAP = 24

    balanceWidthPx.value =
      contentRef.value?.clientWidth -
      logoRef.value?.clientWidth -
      symbolRef.value?.clientWidth -
      GAP
  })
  resizeObserver.observe(contentRef.value)
})
</script>

<template>
  <lukso-card
    size="small"
    is-hoverable
    is-full-width
    @click="handleShowLyxDetails"
    ><div slot="content" class="p-4 pt-11 flex flex-col justify-center">
      <div ref="contentRef" class="flex gap-6">
        <div ref="logoRef" class="pl-2 flex flex-col items-center">
          <div class="border border-neutral-90 rounded-full p-0.5">
            <lukso-profile
              size="medium"
              :profile-url="ASSET_LYX_ICON_URL"
            ></lukso-profile>
          </div>
        </div>
        <div class="flex flex-col w-full">
          <div class="heading-inter-14-bold pb-1">LUKSO</div>
          <div class="heading-inter-21-semi-bold flex items-center pb-1">
            <span
              v-if="viewedProfile?.balance"
              class="truncate"
              :style="{
                'max-width': `${balanceWidthPx}px`,
              }"
              :title="
                $formatNumber(
                  fromWeiWithDecimals(viewedProfile.balance, ASSET_LYX_DECIMALS)
                )
              "
              >{{
                $formatNumber(
                  fromWeiWithDecimals(viewedProfile.balance, ASSET_LYX_DECIMALS)
                )
              }}</span
            >
            <span v-else>0</span>
            <span
              ref="symbolRef"
              class="paragraph-inter-14-semi-bold text-neutral-60 pl-2"
              >{{ appStore.currentNetwork.token.symbol }}</span
            >
          </div>
          <div class="paragraph-inter-12-regular pb-4">
            {{
              $formatCurrency(
                viewedProfile?.balance || '',
                CURRENCY_API_LYX_TOKEN_NAME
              )
            }}
          </div>
        </div>
      </div>
      <div class="flex justify-end w-full">
        <lukso-button
          v-if="
            status.isConnected &&
            viewedProfile?.address === connectedProfile.address
          "
          size="small"
          variant="secondary"
          @click="handleSendAsset"
          class="transition-opacity hover:opacity-70"
          >{{ $formatMessage('button_send') }}</lukso-button
        >
      </div>
    </div>
  </lukso-card>
</template>
