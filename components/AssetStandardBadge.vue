<script setup lang="ts">
type Props = {
  asset?: Asset
}

const props = defineProps<Props>()
const isLoaded = computed(() => props.asset && !props.asset?.isLoading)
const standard = computed(() => props.asset?.standard)
</script>

<template>
  <div v-if="isLoaded">
    <lukso-tag v-if="standard" size="x-small" background-color="lukso-90">{{
      STANDARDS_ABBREVIATIONS[standard as Standard]
    }}</lukso-tag>
  </div>
  <AppPlaceholderLine v-else class="h-[20px] w-10" />
</template>
