<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'

type Props = {
  widget: GridWidget
}

const props = defineProps<Props>()
const widgetComponent = shallowRef<Component | undefined>()
const { isEditingGrid } = storeToRefs(useAppStore())
const { formatMessage } = useIntl()
const { showModal } = useModal()
const dropdownId = `dropdown-${uuidv4()}`

const canEditWidget = computed(
  () => isEditingGrid.value && props.widget.type !== GRID_WIDGET_TYPE.ADD_WIDGET
)

// Dynamically import components based on widget type
const WIDGET_COMPONENTS: Record<string, string> = {
  [GRID_WIDGET_TYPE.TITLE_LINK]: 'TitleLink',
  [GRID_WIDGET_TYPE.TEXT]: 'Text',
  [GRID_WIDGET_TYPE.IMAGE]: 'Image',
  [GRID_WIDGET_TYPE.IFRAME]: 'Iframe',
  [GRID_WIDGET_TYPE.X_POST]: 'XPost',
  [GRID_WIDGET_TYPE.X_TIMELINE]: 'XTimeline',
  [GRID_WIDGET_TYPE.INSTAGRAM_POST]: 'InstagramPost',
  [GRID_WIDGET_TYPE.ADD_WIDGET]: 'AddWidget',
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
    class="relative flex h-full flex-col rounded-12 border border-neutral-90 bg-neutral-100"
  >
    <!-- Handle for moving widget -->
    <div
      v-if="canEditWidget"
      class="absolute left-0 top-0 z-20 cursor-move rounded-8 bg-neutral-100"
    >
      <lukso-icon
        name="hand-right-outline"
        size="small"
        class="p-2"
      ></lukso-icon>
    </div>

    <!-- Widget Options -->
    <div
      v-if="canEditWidget"
      class="absolute right-0 top-0 z-20 cursor-pointer rounded-8 bg-neutral-100"
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
