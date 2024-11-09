<script setup lang="ts">
const { modal, closeModal } = useModal<Partial<GridWidget>>()
const { formatMessage } = useIntl()
const { isConnecting, isConnected, connectedProfileAddress } =
  storeToRefs(useAppStore())
const { addGridWidget, initializeGrid } = useGrid()
const { tempGrid, isEditingGrid } = storeToRefs(useGridStore())
const { connect } = useBaseProvider()
const newWidget = ref<GridWidgetWithoutCords | undefined>()

const handleAddWidget = async () => {
  if (!newWidget.value) {
    console.warn('Missing widget data')
    return
  }

  if (!isConnected.value) {
    await connect()
  }

  // external source:  we need to toggle edit mode
  isEditingGrid.value = true

  // we will widget add to first grid
  let grid = tempGrid.value[0]

  // if grid is not initialized, initialize it
  if (!grid) {
    await initializeGrid(connectedProfileAddress.value, true)
    grid = tempGrid.value[0]
  }

  addGridWidget(newWidget.value, grid)
  closeModal()
  navigateTo(profileRoute(connectedProfileAddress.value))
}

onMounted(async () => {
  try {
    // check if the widget data is valid
    await gridWidgetWithoutCordsSchema
      .omit({ i: true })
      .partial({
        w: true,
        h: true,
      })
      .parseAsync(modal.data)

    if (!modal?.data?.type) {
      throw new Error('Missing widget type')
    }

    // check if properties for given widget type is valid
    const schemaMap = WIDGET_SCHEMA_MAP[modal?.data?.type]
    await schemaMap?.input?.safeParseAsync(modal?.data?.properties)

    newWidget.value = createWidgetObject({
      type: modal?.data?.type,
      properties: modal?.data?.properties,
      w: modal?.data?.w,
      h: modal?.data?.h,
    })
  } catch (error) {
    console.warn(error)
    closeModal()
  }
})
</script>

<template>
  <div class="flex flex-col rounded-12 bg-neutral-98 p-6 text-center">
    <img
      src="/images/grid.svg"
      class="mx-auto mb-6 mt-4 max-w-[150px]"
      alt=""
    />
    <div class="heading-inter-21-semi-bold pb-4">
      {{ formatMessage('modal_external_add_grid_widget_title') }}
    </div>
    <div class="paragraph-inter-16-regular">
      <lukso-sanitize
        :html-content="
          formatMessage('modal_external_add_grid_widget_description')
        "
      ></lukso-sanitize>
    </div>
    <div class="grid grid-cols-[max-content,auto]">
      <lukso-button variant="text" @click="closeModal" class="mt-6">
        {{ formatMessage('modal_external_add_grid_widget_cancel') }}
      </lukso-button>
      <lukso-button
        :is-loading="isConnecting ? true : undefined"
        :loading-text="formatMessage('modal_external_add_grid_widget_confirm')"
        variant="landing"
        is-full-width
        class="mt-6"
        @click="handleAddWidget"
      >
        {{ formatMessage('modal_external_add_grid_widget_confirm') }}
      </lukso-button>
    </div>
  </div>
</template>
