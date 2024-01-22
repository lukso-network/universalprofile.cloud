<script setup lang="ts">
const { isLoadingProfile, isLoadedApp } = storeToRefs(useAppStore())
</script>

<template>
  <div class="relative">
    <div
      class="relative mx-auto max-w-content px-4 py-20 transition-opacity duration-300"
      :class="{
        'opacity-0': isLoadingProfile || !isLoadedApp,
        'opacity-100': !isLoadingProfile && isLoadedApp,
      }"
    >
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
            :buy-url="'TODO'"
            :description="$formatMessage('buy_lyx_card_transak_description')"
          ></BuyLyxCard>
        </div>
      </div>
    </div>
    <AppLoader v-if="isLoadingProfile || !isLoadedApp" />
  </div>
</template>
