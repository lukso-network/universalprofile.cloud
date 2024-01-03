<script setup lang="ts">
import { Image } from '@/models/image'

type Props = {
  images: Image[]
}
type ImagesWithCached = Image & { backgroundImageUrl: string }

const props = defineProps<Props>()
const imagesWithCached = ref<ImagesWithCached[]>([])

onMounted(async () => {
  // for each image we look for cached one
  for await (const image of props.images) {
    const imageWithCached = {
      ...image,
      backgroundImageUrl: await getCachedImageUrl(image),
    }
    imagesWithCached.value.push(imageWithCached)
  }
})
</script>

<template>
  <div class="mb-8">
    <div class="heading-inter-14-bold pb-3">
      {{ $formatMessage('token_details_images') }}
    </div>
    <div class="flex flex-wrap gap-4">
      <div
        v-for="(image, index) in imagesWithCached"
        :key="index"
        class="h-14 w-14 rounded-8 bg-neutral-90 bg-cover"
        :style="{
          backgroundImage: `url(${image?.backgroundImageUrl})`,
        }"
      ></div>
    </div>
  </div>
</template>
