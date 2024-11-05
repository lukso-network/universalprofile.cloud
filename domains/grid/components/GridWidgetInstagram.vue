<script setup lang="ts">
import { useScriptTag } from '@vueuse/core'

type Props = {
  src: string
}

const props = defineProps<Props>()
const embedSrc = ref('')

useScriptTag('https://www.instagram.com/embed.js', () => {}, {
  async: true,
  defer: true,
})

const processInstagramEmbeds = () => {
  window.instgrm?.Embeds.process()
}

watch(
  () => props,
  async () => {
    embedSrc.value = ''
    await nextTick()
    embedSrc.value = props.src
    await nextTick()
    processInstagramEmbeds()
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <div v-if="embedSrc" class="relative m-3 overflow-auto">
    <blockquote
      class="instagram-media w-full !bg-transparent"
      data-instgrm-captioned
      :data-instgrm-permalink="embedSrc"
      data-instgrm-version="14"
    ></blockquote>
  </div>
</template>
