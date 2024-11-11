<script setup lang="ts">
type Props = {
  id: string
}

const props = defineProps<Props>()
const embedId = ref('')

watch(
  () => props.id,
  async () => {
    embedId.value = ''
    await nextTick()
    const script = document.createElement('script')
    script.src = 'https://static.elfsight.com/platform/platform.js'
    script.async = true
    script.defer = true

    const existingScript = document.querySelector(`script[src="${script.src}"]`)

    if (existingScript) {
      existingScript.remove()
    }

    embedId.value = props.id
    document.body.appendChild(script)
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <div v-if="embedId" class="relative m-3 overflow-auto">
    <div :class="`elfsight-app-${embedId}`" data-elfsight-app-lazy></div>
  </div>
</template>
