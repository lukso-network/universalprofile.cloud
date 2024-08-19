<script setup lang="ts">
const { isRpc, isGraph } = storeToRefs(useAppStore())

type Props = {
  asset?: Asset
  isSmall?: boolean
  hasVerification?: boolean
}

defineProps<Props>()
</script>

<template>
  <NftListCardCreatorsGraph
    v-if="isGraph"
    :asset="asset"
    :has-verification="hasVerification"
    :is-small="isSmall"
  />
  <NftListCardCreatorsRpc
    v-if="isRpc"
    :asset="asset"
    :has-verification="hasVerification"
    :is-small="isSmall"
  />
</template>
