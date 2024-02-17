<script setup lang="ts">
type Props = {
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
})

const { isLoading } = toRefs(props)
const { isLoadedApp } = storeToRefs(useAppStore())
</script>

<template>
  <div class="relative">
    <div
      class="relative px-4 py-6 sm:py-20"
      :class="{
        'opacity-0': !isLoadedApp || isLoading,
        'animate-fade-in opacity-100 transition-opacity delay-200  duration-300':
          isLoadedApp && !isLoading,
      }"
    >
      <slot />
    </div>
    <AppLoader
      v-if="!isLoadedApp || isLoading"
      class="absolute left-[calc(50%-20px)] top-[200px] sm:top-[300px]"
    />
  </div>
</template>
