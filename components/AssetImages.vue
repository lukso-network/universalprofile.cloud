<script setup lang="ts">
import type { Image } from '@/types/image'

type Props = {
  images: Image[][] | undefined
}

defineProps<Props>()
const { showModal } = useModal()

const handlePreviewImage = (image: Image[]) => {
  showModal({
    template: 'AssetImage',
    data: {
      asset: [image[0]],
    },
    size: 'auto',
  })
}
</script>

<template>
  <div class="mb-8">
    <div class="heading-inter-14-bold pb-3">
      {{ $formatMessage('token_details_images') }}
    </div>
    <div class="flex flex-wrap gap-4">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="rounded-8 bg-neutral-90 transition hover:scale-[1.02] hover:shadow-neutral-drop-shadow"
      >
        <AssetImage
          class="size-14 cursor-pointer rounded-8"
          :src="getOptimizedImage(image, 56)"
          @click="handlePreviewImage(image)"
        />
      </div>
    </div>
  </div>
</template>
