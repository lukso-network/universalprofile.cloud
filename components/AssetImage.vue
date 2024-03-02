<script setup lang="ts">
type Props = {
  src?: string
  alt?: string
}

const props = defineProps<Props>()

const isImageLoading = ref(true)
const hasImageError = ref(false)
const imageSrc = ref()

onMounted(() => {
  imageSrc.value = props.src
})
</script>

<template>
  <img
    class="w-full bg-neutral-90 object-cover"
    :class="{
      'animate-fade-in': !isImageLoading,
    }"
    :src="imageSrc || ASSET_ERROR_ICON_URL"
    @load="isImageLoading = false"
    @error="
      () => {
        hasImageError = true
        imageSrc = ASSET_ERROR_ICON_URL
      }
    "
    loading="lazy"
    :alt="alt"
  />
</template>
