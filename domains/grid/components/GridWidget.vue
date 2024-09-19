<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'

type Props = {
  widget: GridLayoutItem
}

const props = defineProps<Props>()
const widgetComponent = shallowRef<Component | undefined>()
const { isEditingGrid } = storeToRefs(useAppStore())
const { formatMessage } = useIntl()
const { showModal } = useModal()

const dropdownId = `dropdown-${uuidv4()}`

// Dynamically import components based on item type
const WIDGET_COMPONENTS: Record<string, string> = {
  [GRID_WIDGET_TYPE.TITLE_LINK]: 'TitleLink',
  [GRID_WIDGET_TYPE.TEXT]: 'Text',
  [GRID_WIDGET_TYPE.IMAGE]: 'Image',
  [GRID_WIDGET_TYPE.IFRAME]: 'Iframe',
  [GRID_WIDGET_TYPE.X_POST]: 'XPost',
  [GRID_WIDGET_TYPE.X_TIMELINE]: 'XTimeline',
  [GRID_WIDGET_TYPE.INSTAGRAM_POST]: 'InstagramPost',
}

const loadWidgetComponent = (type: string): Component | undefined => {
  if (WIDGET_COMPONENTS[type] === undefined) {
    console.error(`Widget type ${type} is not supported`)
    return undefined
  }

  return defineAsyncComponent(
    () => import(`./GridWidget${WIDGET_COMPONENTS[type]}.vue`)
  )
}

const handleDelete = () => {
  showModal({
    template: 'DeleteGridWidget',
    data: {
      id: props.widget.i,
    },
  })
}

onMounted(() => {
  widgetComponent.value = loadWidgetComponent(props.widget.type)
})
</script>

<template>
  <div
    class="relative flex h-full flex-col rounded-[10px] border border-[#e4e2e2a3] bg-[rgba(var(--tw-prose-rgb),0.5)] p-[10px] shadow-[0_0_10px_#0003] backdrop-blur-[4px]"
  >
    <!-- Handle for moving widget -->
    <div
      v-if="isEditingGrid"
      class="absolute left-0 top-0 z-20 cursor-move rounded-8 bg-white"
    >
      <lukso-icon
        name="hand-right-outline"
        size="small"
        class="p-2"
      ></lukso-icon>
    </div>

    <!-- Widget Options -->
    <div
      v-if="isEditingGrid"
      class="absolute right-0 top-0 z-20 cursor-pointer rounded-8 bg-white"
    >
      <lukso-icon
        :id="dropdownId"
        name="dots"
        size="small"
        class="p-2"
      ></lukso-icon>
      <lukso-dropdown :trigger-id="dropdownId" is-right size="small">
        <lukso-dropdown-option size="small" @click="handleDelete">{{
          formatMessage('grid_widget_menu_delete')
        }}</lukso-dropdown-option>
      </lukso-dropdown>
    </div>

    <!-- Loaded component based on widget type -->
    <component
      v-if="widgetComponent"
      :is="widgetComponent"
      v-bind="props.widget.properties"
    ></component>
  </div>
</template>
