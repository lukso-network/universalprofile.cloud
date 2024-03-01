<script setup lang="ts">
const tokenAddress = useRouter().currentRoute.value.params?.tokenAddress
const asset = useAsset()(tokenAddress)
</script>

<template>
  <div class="relative">
    <AppPageLoader :is-loading="!asset">
      <TokenView :asset="asset" />
    </AppPageLoader>
  </div>
</template>
