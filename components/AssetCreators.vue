<script setup lang="ts">
type Props = {
  asset?: Asset
}

const props = defineProps<Props>()
const isLoaded = computed(() => props.asset && !props.asset?.isMetadataLoading)
const creators = computed(() => {
  return props.asset?.tokenCreators?.length
    ? props.asset?.tokenCreators
    : props.asset?.owner
      ? [props.asset?.owner]
      : []
})
</script>

<template>
  <div v-if="isLoaded">
    <div class="animate-fade-in">
      <div class="heading-inter-14-bold pb-2">
        {{ $formatMessage('asset_creators_title') }}
      </div>
      <div class="mb-8 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
        <AssetCreator
          v-for="(creator, index) in creators"
          :key="index"
          :creator="creator"
          :asset="asset?.address"
        />
      </div>
    </div>
  </div>
  <AppPlaceholderSection v-else slot-class="flex gap-4">
    <AppPlaceholderLine class="h-[48px] w-[170px]" />
    <AppPlaceholderLine class="h-[48px] w-[140px]" />
  </AppPlaceholderSection>
</template>
