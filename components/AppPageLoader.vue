<script setup lang="ts">
const { isLoadedApp } = storeToRefs(useAppStore())
</script>

<template>
  <div class="relative">
    <div
      class="relative px-4 py-20"
      :class="{
        'opacity-0': !isLoadedApp,
        'opacity-100  transition-opacity delay-200 duration-300': isLoadedApp,
      }"
    >
      <slot />
    </div>
    <AppLoader
      v-if="!isLoadedApp"
      class="absolute left-[calc(50%-20px)] top-[300px]"
    />
  </div>
</template>
