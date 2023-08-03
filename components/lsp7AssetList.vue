<script setup lang="ts">
const { lsp7Assets } = useAssetsStore()
</script>

<template>
  <div class="pt-8">
    <h3 class="heading-inter-17-semi-bold pb-4">
      {{ $formatMessage('tokens_title') }}
    </h3>
    <div class="grid gap-6 grid-col grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <Lsp7AssetCard
        v-for="(asset, index) in lsp7Assets"
        :key="index"
        :asset="asset"
        :has-address="true"
      />
    </div>
  </div>
</template>
