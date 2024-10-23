<script setup lang="ts">
import type { GridWidgetType } from '@/types/grid'

type Props = {
  id?: string
  properties?: GridWidgetProperties
  width?: number
  height?: number
  type?: GridWidgetType
}

const props = defineProps<Props>()
const component = shallowRef<Component | undefined>()

const WIDGET_COMPONENTS: Record<string, string> = {
  [GRID_WIDGET_TYPE.TEXT]: 'Text',
  [GRID_WIDGET_TYPE.IMAGE]: 'Basic',
  [GRID_WIDGET_TYPE.IFRAME]: 'Basic',
  [GRID_WIDGET_TYPE.X]: 'Basic',
  [GRID_WIDGET_TYPE.INSTAGRAM]: 'Basic',
  [GRID_WIDGET_TYPE.SPOTIFY]: 'Basic',
  [GRID_WIDGET_TYPE.SOUNDCLOUD]: 'Basic',
  [GRID_WIDGET_TYPE.WARPCAST]: 'Basic',
  [GRID_WIDGET_TYPE.YOUTUBE]: 'Basic',
}

const loadComponent = (type?: string): Component | undefined => {
  if (type && WIDGET_COMPONENTS[type]) {
    return defineAsyncComponent(
      () => import(`./AddWidget${WIDGET_COMPONENTS[type]}.vue`)
    )
  }

  return defineAsyncComponent(() => import('./AddWidgetSelection.vue'))
}

watch(
  () => props.type,
  () => {
    component.value = loadComponent(props.type)
  },
  { immediate: true }
)
</script>

<template>
  <component
    v-if="component"
    :is="component"
    :type="type"
    :properties="properties"
    :id="id"
    :width="width"
    :height="height"
  ></component>
</template>
