<script setup lang="ts">
type Props = {
  nfts?: Asset[]
  withoutTitle?: boolean
}

defineProps<Props>()
</script>

<template>
  <div>
    <h3 v-if="!withoutTitle" class="heading-inter-17-semi-bold pb-4">
      {{ $formatMessage('collectibles_title') }}
    </h3>
    <div
      class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3"
    >
      <NftListCard v-for="(asset, index) in nfts" :key="index" :asset="asset" />
    </div>
  </div>
</template>
