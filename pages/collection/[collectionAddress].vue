<script setup lang="ts">
const { isGraph, isRpc } = storeToRefs(useAppStore())
const address = useRouter().currentRoute.value.params?.collectionAddress
const asset = useAsset()(address)
</script>

<template>
  <AppPageLoader :is-loading="!asset">
    <CollectionViewGraph :asset="asset" v-if="isGraph" />
    <CollectionViewRpc :asset="asset" v-if="isRpc" />
  </AppPageLoader>
</template>
