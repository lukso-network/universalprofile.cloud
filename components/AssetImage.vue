<script setup lang="ts">
type Props = {
  src?: string
  alt?: string
}

const props = defineProps<Props>()

const isImageLoading = ref(true)
const hasImageError = ref(false)
const imageSrc = ref()

const handleError = () => {
  if (props.src) {
    isImageLoading.value = false
    hasImageError.value = true
  }
}

watch(
  () => props.src,
  (newImg, oldImg) => {
    if (newImg !== oldImg) {
      imageSrc.value = newImg
      isImageLoading.value = true
      if (newImg) {
        hasImageError.value = false
      }
    }
  }
)

onMounted(() => {
  isImageLoading.value = true
  if (props.src) {
    imageSrc.value = props.src
    hasImageError.value = false
  }
})
</script>

<template>
  <img
    class="w-full bg-neutral-90 object-cover"
    :class="{
      'animate-fade-in': !isImageLoading,
    }"
    :src="imageSrc || ASSET_ERROR_ICON_URL"
    @load="isImageLoading = props.src ? false : true"
    @error="handleError"
    loading="lazy"
    :alt="alt"
  />
</template>
