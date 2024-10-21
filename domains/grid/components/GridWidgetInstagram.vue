<script setup lang="ts">
import { useScriptTag } from '@vueuse/core'

type Props = {
  src: string
}

defineProps<Props>()

useScriptTag(
  'https://www.instagram.com/embed.js',
  () => {
    processInstagramEmbeds()
  },
  {
    async: true,
    defer: true,
  }
)

onMounted(() => {
  processInstagramEmbeds()
})

onUpdated(() => {
  processInstagramEmbeds()
})

const processInstagramEmbeds = () => {
  window.instgrm?.Embeds.process()
}
</script>

<template>
  <div class="m-3 overflow-auto">
    <blockquote
      class="instagram-media w-full"
      data-instgrm-captioned
      :data-instgrm-permalink="src"
      data-instgrm-version="14"
    ></blockquote>
  </div>
</template>
