<script setup lang="ts">
type Props = {
  asset?: Asset
}

const props = defineProps<Props>()
const isLoaded = computed(() => props.asset && !props.asset?.isMetadataLoading)
const assets = computed(() => props.asset?.resolvedMetadata?.assets)
</script>

<template>
  <template v-if="isLoaded">
    <AssetAssetsWrapper
      :assets="assets"
      :file-types="['document', 'video', 'audio', 'contract', 'other']"
    >
      <template #default="{ filteredAssets }">
        <div v-if="filteredAssets?.length" class="mb-8">
          <div class="heading-inter-14-bold pb-3">
            {{ $formatMessage('token_details_assets') }}
          </div>
          <div class="flex flex-wrap gap-4">
            <AssetAssetsItem
              v-for="(fileAsset, index) in filteredAssets"
              :key="index"
              :file-asset="fileAsset"
            />
          </div>
        </div>
      </template>
    </AssetAssetsWrapper>
  </template>
  <AppPlaceholderSection v-else slot-class="flex gap-4">
    <AppPlaceholderLine class="size-14" />
  </AppPlaceholderSection>
</template>
