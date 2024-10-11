<script setup lang="ts">
type Props = {
  widget: GridWidget
}

const props = defineProps<Props>()
const widgetComponent = shallowRef<Component | undefined>()
const { canEditGrid, addGridLayoutItem } = useGrid()
const { formatMessage } = useIntl()
const { showModal } = useModal()
const { selectWidget, setWidgetData } = useWidgetStore()
const {
  isEditingGrid,
  isConnected,
  isMobile,
  isConnectedUserViewingOwnProfile,
} = storeToRefs(useAppStore())
const { connect } = useBaseProvider()
const { browserSupportExtension } = useBrowser()
const dropdownId = `dropdown-${generateItemId()}`

const isAllowToEdit = computed(
  () => canEditGrid.value && !isAddContentWidget.value
)

const isAddContentWidget = computed(
  () => props.widget.type === GRID_WIDGET_TYPE.ADD_CONTENT
)

const isAllowToClone = computed(
  () => isEditingGrid.value || !isConnectedUserViewingOwnProfile.value
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
  [GRID_WIDGET_TYPE.WARPCAST]: 'Iframe',
  [GRID_WIDGET_TYPE.YOUTUBE]: 'Youtube',
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

const handleOpenInTab = () => {
  window.open(props.widget.properties.src, '_blank')
}

const handleClone = async () => {
  if (!browserSupportExtension.value && !isMobile.value) {
    return
  }

  if (!isConnected.value) {
    await connect()
  }

  const clonedWidget = createWidgetObject({
    type: props.widget.type,
    properties: props.widget.properties,
  })
  addGridLayoutItem(clonedWidget)
  isEditingGrid.value = true // we enable edit mode so user is aware about unsaved state

  if (!isConnectedUserViewingOwnProfile.value) {
    showModal({
      template: 'GridWidgetCloned',
    })
  }
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
    <!-- Move handle -->
    <div
      v-if="isAllowToEdit"
      class="grid-move-overlay absolute inset-0 cursor-move rounded-[inherit] bg-neutral-100 opacity-0 transition-opacity group-hover:opacity-60"
    ></div>

    <!-- Widget options -->
    <div
      v-if="!isAddContentWidget"
      class="grid-widget-options absolute right-2 top-2 z-20 mb-2 cursor-pointer"
      :class="{
        'invisible group-hover:visible': !isAllowToEdit,
      }"
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
        <!-- Edit option -->
        <lukso-dropdown-option
          v-if="isAllowToEdit"
          size="medium"
          @click="handleEdit"
        >
          <lukso-icon name="edit" size="small"></lukso-icon>
          {{ formatMessage('grid_widget_menu_edit') }}</lukso-dropdown-option
        >

        <!-- Clone option -->
        <lukso-dropdown-option
          v-if="isAllowToClone"
          size="medium"
          @click="handleClone"
          :is-disabled="
            !browserSupportExtension && !isMobile ? true : undefined
          "
        >
          <lukso-icon name="copy" size="small"></lukso-icon>
          <span v-if="isConnectedUserViewingOwnProfile">
            {{ formatMessage('grid_widget_menu_clone') }}
          </span>
          <span v-else>
            {{ formatMessage('grid_widget_menu_clone_to_my_grid') }}
          </span>
        </lukso-dropdown-option>

        <!-- Open in new tab option -->
        <lukso-dropdown-option
          v-if="widget.properties?.src"
          size="medium"
          @click="handleOpenInTab"
        >
          <lukso-icon name="link-3" size="small"></lukso-icon>
          {{
            formatMessage('grid_widget_menu_open_in_new_tab')
          }}</lukso-dropdown-option
        >

        <!-- Delete option -->
        <lukso-dropdown-option
          v-if="isAllowToEdit"
          size="medium"
          @click="handleDelete"
          ><lukso-icon name="trash" size="small" color="red-65"></lukso-icon
          ><span class="text-red-65">{{
            formatMessage('grid_widget_menu_delete')
          }}</span></lukso-dropdown-option
        >
      </lukso-dropdown>
    </div>

    <!-- Resize handle -->
    <div
      v-if="isAllowToEdit"
      class="grid-widget-resize absolute bottom-2 right-2 z-10 mb-1 flex size-[35px] cursor-pointer items-center justify-center rounded-full border border-neutral-90 bg-neutral-100 opacity-0 shadow-neutral-drop-shadow-1xl transition-opacity group-hover:opacity-100"
    >
      <lukso-icon name="expand" size="medium" class="p-2"></lukso-icon>
    </div>

    <!-- Loaded component based on widget type -->
    <component
      v-if="widgetComponent"
      :is="widgetComponent"
      v-bind="widget.properties"
      :widget="widget"
    ></component>
  </div>
</template>
