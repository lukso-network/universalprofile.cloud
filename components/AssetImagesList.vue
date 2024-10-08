<script setup lang="ts">
import type { Image } from '@/types/image'

type Props = {
  asset?: Asset
}

const props = defineProps<Props>()
const { showModal } = useModal()
const isLoaded = computed(() => props.asset && !props.asset?.isMetadataLoading)
const images = computed(() => props.asset?.resolvedMetadata?.images || null)

const optimizedImages = useOptimizedImages(images, 56)

const handlePreviewImage = (image: Image[]) => {
  const optimizedImage = useOptimizedImage([image[0]], 1000)
  showModal({
    template: 'AssetImage',
    data: {
      image: unref(optimizedImage),
    },
    size: 'auto',
  })
}
</script>

<template>
  <template v-if="isLoaded">
    <div v-if="images?.length">
      <div class="heading-inter-14-bold pb-3">
        {{ $formatMessage('token_details_images') }}
      </div>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="(image, index) in optimizedImages"
          :key="index"
          class="rounded-8 bg-neutral-90 transition hover:scale-[1.02] hover:shadow-neutral-drop-shadow"
        >
          <AssetImage
            class="max-h-14 min-h-14 w-14 cursor-pointer rounded-8"
            :image="image.optimized.value"
            @click="handlePreviewImage(image.original || [])"
          />
        </div>
        <!-- we show 3d file assets in images list -->
        <AssetAssetsWrapper
          :assets="asset?.resolvedMetadata?.assets"
          :file-types="['image', '3d']"
        >
          <template #default="{ filteredAssets }">
            <AssetAssetsItem
              v-for="(fileAsset, index) in filteredAssets"
              :key="index"
              :file-asset="fileAsset"
            />
          </template>
        </AssetAssetsWrapper>
      </div>
    </div>
  </template>
  <AppPlaceholderSection v-else slot-class="flex gap-4">
    <AppPlaceholderLine class="size-14" />
    <AppPlaceholderLine class="size-14" />
    <AppPlaceholderLine class="size-14" />
  </AppPlaceholderSection>
</template>
