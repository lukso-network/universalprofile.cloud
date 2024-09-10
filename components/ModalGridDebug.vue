<script setup lang="ts">
type Props = {
  layout: GridLayoutItem[]
  onSave: (layoutStringified: string) => void
  onReset: () => void
}

const props = defineProps<Props>()
const layoutStringified = ref(
  JSON.stringify(toLSP27TheGrid(props.layout), null, 2)
)

watch(
  () => props.layout,
  newLayout => {
    layoutStringified.value = JSON.stringify(toLSP27TheGrid(newLayout), null, 2)
  },
  { immediate: true }
)
</script>

<template>
  <div class="m-4 flex flex-col space-y-2 text-sm">
    <div>
      Current items info as i: [x, y, w, h]:
      <div class="columns-4">
        <div v-for="item in layout" :key="item.i">
          <strong>{{ item.i }}</strong
          >: [{{ item.x }}, {{ item.y }}, {{ item.w }}, {{ item.h }}]
        </div>
      </div>
    </div>
    <textarea
      v-model="layoutStringified"
      class="h-96 w-full border-2 border-solid border-black"
      wrap="off"
    ></textarea>
    <span class="flex justify-end space-x-2">
      <lukso-button @click="onSave(layoutStringified)" size="small">
        Save
      </lukso-button>
      <lukso-button @click="onReset()" size="small"> Reset </lukso-button>
    </span>
  </div>
</template>
