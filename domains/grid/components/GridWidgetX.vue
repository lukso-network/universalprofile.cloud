<script setup lang="ts">
type Props = {
  src: string
  type?: string
}

const props = defineProps<Props>()
const embedSrc = ref('')

// each change (add, edit) of the widget require to "reinstall" the twitter script
watch(
  () => props.src,
  async () => {
    embedSrc.value = ''
    await nextTick()
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true

    const existingScript = document.querySelector(`script[src="${script.src}"]`)

    if (existingScript) {
      existingScript.remove()
    }

    document.body.appendChild(script)
    embedSrc.value = props.src
  },
  { immediate: true }
)
</script>

<template>
  <div v-if="embedSrc" class="m-3 h-full overflow-scroll">
    <!-- X post -->
    <div v-if="type === 'post'" class="my-[-10px] size-[inherit]">
      <blockquote class="twitter-tweet size-[inherit]">
        <a
          class="flex size-[inherit] items-center justify-center"
          :href="embedSrc"
          ><AppLoader
        /></a>
      </blockquote>
    </div>

    <!-- X timeline -->
    <a
      v-else
      class="twitter-timeline flex size-[inherit] items-center justify-center"
      :href="embedSrc"
    >
      <AppLoader />
    </a>
  </div>
</template>
