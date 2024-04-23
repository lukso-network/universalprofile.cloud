<script setup lang="ts">
type Props = {
  asset: Asset
  isAdded?: boolean
}

const asset = computed(() => props.asset)
const props = defineProps<Props>()
const token = useToken()(asset)
</script>

<template>
  <MissingAssetPreviewItem
    v-if="isLsp7(token)"
    :address="token?.address"
    :is-added="isAdded"
  />
  <div v-else class="flex flex-col gap-2">
    <MissingAssetPreviewItem
      v-for="tokenId in token?.tokenIdsOf"
      :address="token?.address"
      :token-id="tokenId"
      :key="tokenId"
      :is-added="isAdded"
    />
  </div>
</template>
