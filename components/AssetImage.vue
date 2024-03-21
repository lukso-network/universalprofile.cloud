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
const imageSrc = ref()

const handleError = () => {
  if (props.src) {
    isImageLoading.value = false
    imageSrc.value = IMAGE_ERROR_URL
  }
}

watchEffect(() => {
  imageSrc.value = props.src
})

onMounted(() => {
  isImageLoading.value = true

  if (props.src) {
    imageSrc.value = props.src
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
