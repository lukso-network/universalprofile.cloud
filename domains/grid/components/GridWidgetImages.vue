<script setup lang="ts">
type Props = {
  images?: string[]
  type: ImagesType
}

const props = defineProps<Props>()
const { showModal } = useModal()

// for now we support only single image
const imageSrc = computed(() => {
  return props.images?.[0]
})

const handleClick = (src?: string) => {
  if (!src) {
    return
  }

  showModal({
    template: 'AssetImage',
    data: {
      image: {
        url: src,
      },
    },
    size: 'auto',
  })
}
</script>

<template>
  <div class="m-3 flex h-full overflow-hidden rounded-8">
    <lukso-image
      :src="imageSrc"
      :class="{
        'cursor-pointer': !!imageSrc,
      }"
      class="min-h-full min-w-full"
      alt="image"
      @click="handleClick(imageSrc)"
    ></lukso-image>
  </div>
</template>
