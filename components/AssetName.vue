<script setup lang="ts">
type Props = {
  asset?: Asset
}

const props = defineProps<Props>()
const isLoaded = computed(() => props.asset && !props.asset?.isLoading)
const name = computed(() => props.asset?.tokenName)
</script>

<template>
  <div v-if="isLoaded">
    {{ name }}
  </div>
  <AppPlaceholderLine v-else class="h-[28px] w-1/3" />
</template>
