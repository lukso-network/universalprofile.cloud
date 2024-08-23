<script setup lang="ts">
import { useScriptTag } from '@vueuse/core'

type Props = {
  src: string
}

defineProps<Props>()

useScriptTag('https://platform.twitter.com/widgets.js')
</script>

<template>
  <div class="overflow-scroll rounded-[10px]">
    <blockquote class="twitter-tweet">
      <a :href="src">Loading</a>
    </blockquote>
  </div>
</template>
