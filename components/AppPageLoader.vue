<script setup lang="ts">
const { isLoadedApp, isLoadingProfile, isLoadingAssets } =
  storeToRefs(useAppStore())
</script>

<template>
  <div class="relative">
    <div
      class="relative px-4 py-20"
      :class="{
        'opacity-0': isLoadingAssets || isLoadingProfile || !isLoadedApp,
        'opacity-100  transition-opacity delay-200 duration-300':
          !isLoadingAssets && !isLoadingProfile && isLoadedApp,
      }"
    >
      <slot />
    </div>
    <AppLoader v-if="isLoadingAssets || isLoadingProfile || !isLoadedApp" />
  </div>
</template>
