<script setup lang="ts">
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
  [GRID_WIDGET_TYPE.enum.TEXT]: 'Text',
  [GRID_WIDGET_TYPE.enum.IMAGES]: 'Images',
  [GRID_WIDGET_TYPE.enum.IFRAME]: 'Basic',
  [GRID_WIDGET_TYPE.enum.X]: 'Basic',
  [GRID_WIDGET_TYPE.enum.INSTAGRAM]: 'Basic',
  [GRID_WIDGET_TYPE.enum.SPOTIFY]: 'Basic',
  [GRID_WIDGET_TYPE.enum.SOUNDCLOUD]: 'Basic',
  [GRID_WIDGET_TYPE.enum.WARPCAST]: 'Basic',
  [GRID_WIDGET_TYPE.enum.YOUTUBE]: 'Basic',
  [GRID_WIDGET_TYPE.enum.ELFSIGHT]: 'Basic',
}

const loadComponent = (type?: string): Component | undefined => {
  if (type && WIDGET_COMPONENTS[type]) {
    return defineAsyncComponent(
      () => import(`./AddWidget${WIDGET_COMPONENTS[type]}.vue`)
    )
  }

  // when no type we display selection screen
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
