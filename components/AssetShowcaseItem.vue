<script setup lang="ts">
type Props = {
  address: Address
}

const props = defineProps<Props>()
const asset = useAsset()(props.address)
</script>

<template>
  <NftListCard :asset="asset" no-owns-info />
</template>
