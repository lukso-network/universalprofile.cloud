<script setup lang="ts">
type Props = {
  widget: GridWidget
}

const props = defineProps<Props>()

const widgetComponent = shallowRef<Component | undefined>()

// Dynamically import components based on item type
const WIDGET_COMPONENTS: Record<string, string> = {
  [GridWidgetType.TITLE_LINK]: 'TitleLink',
  [GridWidgetType.TEXT]: 'Text',
  [GridWidgetType.IMAGE]: 'Image',
  [GridWidgetType.IFRAME]: 'Iframe',
  [GridWidgetType.X_POST]: 'XPost',
  [GridWidgetType.X_TIMELINE]: 'XTimeline',
  [GridWidgetType.INSTAGRAM_POST]: 'InstagramPost',
}

function loadWidgetComponent(type: string): Component | undefined {
  if (WIDGET_COMPONENTS[type] === undefined) {
    console.error(`Widget type ${type} is not supported`)
    return undefined
  }

  return defineAsyncComponent(
    () => import(`./GridWidget${WIDGET_COMPONENTS[type]}.vue`)
  )
}

onMounted(() => {
  widgetComponent.value = loadWidgetComponent(props.widget.type)
})
</script>

<template>
  <div
    class="flex h-full flex-col rounded-[10px] border border-[#e4e2e2a3] bg-[rgba(var(--tw-prose-rgb),0.5)] p-[10px] shadow-[0_0_10px_#0003] backdrop-blur-[4px]"
  >
    <component
      v-if="widgetComponent"
      :is="widgetComponent"
      v-bind="props.widget.properties"
    ></component>
  </div>
</template>
