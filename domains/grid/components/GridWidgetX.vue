<script setup lang="ts">
type Props = {
  type: XType
  username: string
  id?: string
  theme?: string
}

const props = defineProps<Props>()
const src = ref('')

// each change (add, edit) of the widget require to "reinstall" the twitter script
watch(
  [props],
  async () => {
    src.value = ''
    await nextTick()
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true

    const existingScript = document.querySelector(`script[src="${script.src}"]`)

    if (existingScript) {
      existingScript.remove()
    }

    document.body.appendChild(script)

    const schema = WIDGET_SCHEMA_MAP[GRID_WIDGET_TYPE.enum.X]
    const inputParse = await schema?.input?.safeParseAsync({
      ...props,
      src: '',
    })
    src.value = inputParse?.data?.src
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <div v-if="src" class="m-3 h-full overflow-scroll">
    <!-- X post -->
    <div v-if="type === 'status'" class="my-[-10px] size-[inherit]">
      <blockquote class="twitter-tweet size-[inherit]">
        <a class="flex size-[inherit] items-center justify-center" :href="src"
          ><AppLoader
        /></a>
      </blockquote>
    </div>

    <!-- X timeline -->
    <a
      v-else
      class="twitter-timeline flex size-[inherit] items-center justify-center"
      :href="src"
    >
      <AppLoader />
    </a>
  </div>
</template>
