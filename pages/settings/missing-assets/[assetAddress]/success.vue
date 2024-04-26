<script setup lang="ts">
const connectedProfile = useProfile().connectedProfile()
const { isConnected } = storeToRefs(useAppStore())
const assetAddress = useRouter().currentRoute.value.params?.assetAddress

const asset = useAsset()(assetAddress)

const handleBackToSettings = () => {
  navigateTo(settingsRoute())
}

const handleAddAnotherAsset = () => {
  navigateTo(settingsMissingAssetsRoute())
}

watchEffect(() => {
  // when not connected then navigate to home
  if (!isConnected.value) {
    navigateTo(homeRoute())
  }
})
</script>

<template>
  <AppPageLoader :is-loading="connectedProfile?.isLoading">
    <div class="mx-auto w-full sm:w-[440px]">
      <h1
        class="heading-inter-17-semi-bold group mb-8 flex cursor-pointer items-center gap-1 border-b border-b-neutral-90 pb-6"
        @click="handleBackToSettings"
      >
        <lukso-icon
          name="arrow-left-lg"
          class="transition group-hover:-translate-x-1"
        ></lukso-icon>
        {{ $formatMessage('missing_assets_page_title') }}
      </h1>
      <h3 class="paragraph-inter-16-semi-bold pb-2">
        {{ $formatMessage('success_missing_assets_title') }}
      </h3>
      <p class="paragraph-inter-14-regular pb-2 text-neutral-40">
        {{ $formatMessage('success_missing_assets_description') }}
      </p>
      <MissingAssetPreview :asset="asset" is-added />
      <lukso-button is-full-width class="mt-6" @click="handleAddAnotherAsset">
        {{ $formatMessage('add_missing_assets_add_another_button') }}
      </lukso-button>
    </div>
  </AppPageLoader>
</template>
