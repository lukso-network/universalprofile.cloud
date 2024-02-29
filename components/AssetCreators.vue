<script setup lang="ts">
type Props = {
  asset: Asset
}

const props = defineProps<Props>()

const creators = computed(() => {
  return props.asset?.creators || []
})
</script>

<template>
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
</template>
