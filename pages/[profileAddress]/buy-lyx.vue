<script setup lang="ts">
const { isConnected } = storeToRefs(useAppStore())

watchEffect(() => {
  // when not connected then navigate to home
  if (!isConnected.value) {
    navigateTo(homeRoute())
  }
})
</script>

<template>
  <div class="relative">
    <AppPageLoader>
      <div class="mx-auto max-w-content">
        <ProfileCard />
        <div>
          <div class="paragraph-inter-16-regular mt-12 text-center">
            <lukso-sanitize
              :html-content="$formatMessage('buy_lyx_title')"
            ></lukso-sanitize>
          </div>
          <div class="grid grid-cols-2 gap-6 pt-8">
            <BuyLyxCard
              logo-url="/images/transak-logo.png"
              :buy-url="transakBuyLyxUrl()"
              :description="$formatMessage('buy_lyx_card_transak_description')"
            ></BuyLyxCard>
          </div>
        </div>
      </div>
    </AppPageLoader>
  </div>
</template>
