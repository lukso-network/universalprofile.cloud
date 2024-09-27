<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'

type Props = {
  widget: GridWidget
}

const props = defineProps<Props>()
const widgetComponent = shallowRef<Component | undefined>()
const { canEditGrid } = useGrid()
const { formatMessage } = useIntl()
const { showModal } = useModal()
const { selectWidget, setWidgetData } = useWidgetStore()
const dropdownId = `dropdown-${uuidv4()}`

const isAllowToEdit = computed(
  () => canEditGrid.value && props.widget.type !== GRID_WIDGET_TYPE.ADD_CONTENT
)

const isAddContentWidget = computed(
  () => props.widget.type === GRID_WIDGET_TYPE.ADD_CONTENT
)

const WIDGET_COMPONENTS: Record<string, string> = {
  [GRID_WIDGET_TYPE.TITLE_LINK]: 'TitleLink',
  [GRID_WIDGET_TYPE.TEXT]: 'Text',
  [GRID_WIDGET_TYPE.IMAGE]: 'Image',
  [GRID_WIDGET_TYPE.IFRAME]: 'Iframe',
  [GRID_WIDGET_TYPE.X]: 'X',
  [GRID_WIDGET_TYPE.INSTAGRAM]: 'Instagram',
  [GRID_WIDGET_TYPE.ADD_CONTENT]: 'AddContent',
  [GRID_WIDGET_TYPE.SPOTIFY]: 'Spotify',
  [GRID_WIDGET_TYPE.SOUNDCLOUD]: 'Iframe',
}

const loadWidgetComponent = (type: string): Component | undefined => {
  if (!WIDGET_COMPONENTS[type]) {
    console.warn(`Widget type ${type} is not supported`)
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

const handleEdit = () => {
  selectWidget(props.widget.type)
  setWidgetData(props.widget)
  showModal({
    template: 'AddGridWidget',
  })
}

onMounted(() => {
  widgetComponent.value = loadWidgetComponent(props.widget.type)
})
</script>

<template>
  <div
    class="group relative flex h-full select-none flex-col rounded-12 border border-neutral-90 bg-neutral-100"
    :class="{ 'shadow-neutral-drop-shadow-1xl': !isAddContentWidget }"
  >
    <!-- Overlay for moving widget -->
    <div
      v-if="isAllowToEdit"
      class="grid-move-overlay absolute inset-0 cursor-move rounded-[inherit] bg-neutral-100 opacity-0 transition-opacity group-hover:opacity-60"
    ></div>

    <!-- Widget options -->
    <div
      v-if="isAllowToEdit"
      class="grid-widget-options absolute right-2 top-2 z-20 mb-2 cursor-pointer"
    >
      <div
        class="mb-1 flex size-[35px] items-center justify-center rounded-full border border-neutral-90 bg-neutral-100 shadow-neutral-drop-shadow-1xl"
      >
        <lukso-icon
          :id="dropdownId"
          name="dots"
          size="medium"
          class="p-2"
        ></lukso-icon>
      </div>
      <lukso-dropdown :trigger-id="dropdownId" is-right size="medium">
        <lukso-dropdown-option size="medium" @click="handleEdit">
          <lukso-icon name="edit" size="small"></lukso-icon>
          {{ formatMessage('grid_widget_menu_edit') }}</lukso-dropdown-option
        >
        <lukso-dropdown-option size="medium" @click="handleDelete"
          ><lukso-icon name="trash" size="small" color="red-65"></lukso-icon
          ><span class="text-red-65">{{
            formatMessage('grid_widget_menu_delete')
          }}</span></lukso-dropdown-option
        >
      </lukso-dropdown>
    </div>

    <!-- Widget move handles -->
    <img
      v-if="isAllowToEdit"
      class="grid-widget-resize invisible absolute bottom-[3px] right-[3px] z-10 scale-x-[-1] cursor-pointer group-hover:visible"
      src="/images/resize.svg"
    />

    <!-- Loaded component based on widget type -->
    <component
      v-if="widgetComponent"
      :is="widgetComponent"
      v-bind="widget.properties"
      :widget="widget"
    ></component>
  </div>
</template>
