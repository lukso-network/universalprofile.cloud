<script setup lang="ts">
const { selectedWidget } = storeToRefs(useWidgetStore())

const component = shallowRef<Component | undefined>()

const WIDGET_COMPONENTS: Record<string, string> = {
  [GRID_WIDGET_TYPE.TITLE_LINK]: 'TitleLink',
  [GRID_WIDGET_TYPE.TEXT]: 'Text',
  [GRID_WIDGET_TYPE.IMAGE]: 'Image',
  [GRID_WIDGET_TYPE.IFRAME]: 'Iframe',
  [GRID_WIDGET_TYPE.X_POST]: 'XPost',
  [GRID_WIDGET_TYPE.X_TIMELINE]: 'XTimeline',
  [GRID_WIDGET_TYPE.INSTAGRAM_POST]: 'InstagramPost',
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
  selectedWidget,
  () => {
    component.value = loadComponent(selectedWidget.value)
  },
  { immediate: true }
)
</script>

<template>
  <component v-if="component" :is="component"></component>
</template>
