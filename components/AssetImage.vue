<script setup lang="ts">
type Props = {
  src?: string
  alt?: string
}

type Emits = {
  (event: 'on-load'): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const isImageLoading = ref(true)
const hasImageError = ref(false)
const imageSrc = ref()

const handleError = (event: ErrorEvent) => {
  console.log(event)
  if (props.src) {
    isImageLoading.value = false
    hasImageError.value = true
    imageSrc.value = ASSET_ERROR_ICON_URL
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

const handleLoad = () => {
  isImageLoading.value = false
  emits('on-load')
}
</script>

<template>
  <div
    class="overflow-hidden bg-neutral-90"
    :class="{
      'animate-pulse': isImageLoading,
    }"
  >
    <img
      class="max-h-[inherit] min-h-[inherit] w-full bg-neutral-90 object-cover opacity-0 animation-fill-forwards"
      :class="{
        'animate-fade-in': !isImageLoading,
      }"
      :src="imageSrc"
      @load="handleLoad"
      @error="handleError"
      loading="lazy"
      :alt="alt"
    />
  </div>
</template>
