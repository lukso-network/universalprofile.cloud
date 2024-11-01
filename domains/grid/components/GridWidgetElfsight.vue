<script setup lang="ts">
import { useScriptTag } from '@vueuse/core'

type Props = {
  id: string
}

defineProps<Props>()
useScriptTag('https://static.elfsight.com/platform/platform.js')
</script>

<template>
  <div class="relative m-3 overflow-auto">
    <div :class="`elfsight-app-${id}`" data-elfsight-app-lazy></div>
  </div>
</template>
