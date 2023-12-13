<script setup lang="ts">
const { isLoadingProfile, isLoadingAssets, isLoadedApp } =
  storeToRefs(useAppStore())

const showProfileDetails = computed(
  () => useRouter().currentRoute.value.query.referrer === REFERRERS.INDEXER
)
</script>

<template>
  <div class="relative">
    <div
      class="relative mx-auto max-w-content px-4 py-20 transition-opacity duration-300"
      :class="{
        'opacity-0': isLoadingAssets || isLoadingProfile || !isLoadedApp,
        'opacity-100': !isLoadingAssets && !isLoadingProfile && isLoadedApp,
      }"
    >
      <ProfileCard />
      <ProfileDetails v-if="showProfileDetails" />
      <Assets />
    </div>
    <AppLoader v-if="isLoadingAssets || isLoadingProfile || !isLoadedApp" />
  </div>
</template>
