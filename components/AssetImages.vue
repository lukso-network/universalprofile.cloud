<script setup lang="ts">
import { ImageMetadataEncoded } from '@/types/assets'

type Props = {
  images: ImageMetadataEncoded[]
}

defineProps<Props>()
</script>

<template>
  <div class="mb-8">
    <div class="heading-inter-14-bold pb-3">
      {{ $formatMessage('token_details_images') }}
    </div>
    <div class="flex gap-4 flex-wrap">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="w-14 h-14 rounded-8 bg-cover bg-position-center bg-neutral-90"
        :style="{
          backgroundImage: `url(${image.base64})`,
        }"
      ></div>
    </div>
  </div>
</template>
