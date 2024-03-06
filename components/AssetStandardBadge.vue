<script setup lang="ts">
type Props = {
  standard?: string
}

defineProps<Props>()
</script>

<template>
  <lukso-tag v-if="standard" size="x-small" background-color="lukso-90">{{
    STANDARDS_ABBREVIATIONS[standard as Standard]
  }}</lukso-tag>
</template>
