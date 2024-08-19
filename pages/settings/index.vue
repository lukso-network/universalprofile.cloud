<script setup lang="ts">
const connectedProfile = useProfile().connectedProfile()
const { formatMessage } = useIntl()
const { isConnected } = storeToRefs(useAppStore())

const handleOpenAddMissingAssets = () => {
  navigateTo(settingsMissingAssetsRoute())
}

const handleOpenApplicationDataProvider = () => {
  navigateTo(settingsDataProviderRoute())
}
</script>

<template>
  <AppPageLoader :is-loading="connectedProfile?.isLoading">
    <div class="mx-auto w-full sm:w-[440px]">
      <h1 class="heading-inter-21-semi-bold pb-4">
        {{ formatMessage('settings_page_title') }}
      </h1>

      <!-- Add Missing Assets -->
      <section
        v-if="isConnected"
        class="group w-full cursor-pointer select-none border border-b-0 border-neutral-90 bg-neutral-100 p-4 transition first-of-type:rounded-t-12 last-of-type:rounded-b-12 last-of-type:border-b"
        @click="handleOpenAddMissingAssets"
      >
        <div class="grid grid-cols-[max-content,auto,max-content] gap-2">
          <lukso-icon name="search"></lukso-icon>
          <div class="paragraph-inter-16-semi-bold">
            <h3 class="pb-1">
              {{ formatMessage('settings_add_missing_assets_title') }}
            </h3>
            <p class="paragraph-inter-14-regular text-neutral-40">
              {{ formatMessage('settings_add_missing_assets_description') }}
            </p>
          </div>
          <lukso-icon
            name="arrow-right-lg"
            class="transition group-hover:translate-x-1"
          ></lukso-icon>
        </div>
      </section>

      <!-- Application data provider (graph/rpc) -->
      <section
        v-if="false"
        class="group w-full cursor-pointer select-none border border-b-0 border-neutral-90 bg-neutral-100 p-4 transition first-of-type:rounded-t-12 last-of-type:rounded-b-12 last-of-type:border-b"
        @click="handleOpenApplicationDataProvider"
      >
        <div class="grid grid-cols-[max-content,auto,max-content] gap-2">
          <lukso-icon name="database"></lukso-icon>
          <div class="paragraph-inter-16-semi-bold">
            <h3 class="pb-1">
              {{ formatMessage('settings_data_provider_title') }}
            </h3>
            <p class="paragraph-inter-14-regular text-neutral-40">
              {{ formatMessage('settings_data_provider_description') }}
            </p>
          </div>
          <lukso-icon
            name="arrow-right-lg"
            class="transition group-hover:translate-x-1"
          ></lukso-icon>
        </div>
      </section>
    </div>
  </AppPageLoader>
</template>
