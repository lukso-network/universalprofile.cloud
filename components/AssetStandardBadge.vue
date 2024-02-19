<script setup lang="ts">
import type { Standard } from '@/types/contract'

type Props = {
  standard?: Standard
}

defineProps<Props>()
</script>

<template>
  <lukso-tag v-if="standard" size="x-small" background-color="lukso-90">{{
    STANDARDS_ABBREVIATIONS[standard]
  }}</lukso-tag>
</template>
