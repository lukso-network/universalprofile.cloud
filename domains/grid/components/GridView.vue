<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { GridItem, GridLayout } from 'grid-layout-plus'

const ROW_HEIGHT_PX = 280 // TODO we should calculate this based on grid column width

const gridContainer = ref<HTMLElement | null>(null)

const DEBOUNCE_TIMEOUT = 250
let resizeTimeout: ReturnType<typeof setTimeout> | null = null

const { isEditingGrid, isConnected, gridLayout, hasUnsavedGrid, gridColumns } =
  storeToRefs(useAppStore())
const address = getCurrentProfileAddress()
const { initializeGridLayout, saveGridLayout, canEditGrid } = useGrid()

const layout = ref<GridWidget[]>([])

const handleUpdateLayout = (newLayout: GridWidget[]) => {
  if (gridLog.enabled) {
    gridLog('Layout updated', newLayout)
  }

  gridLayout.value = newLayout
}

const handleSaveLayout = async () => {
  if (!canEditGrid.value) {
    return
  }

  // rebuild layout to ensure that all widgets are in the correct position
  layout.value = buildLayout(
    gridLayout.value,
    gridColumns.value,
    isEditingGrid.value
  )

  await saveGridLayout(layout.value)
}

const handleResize = (width: number) => {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    const prevCols = gridColumns.value
    const newCols = getGridColumns(width)

    if (prevCols !== newCols) {
      gridColumns.value = newCols
      gridLayout.value = buildLayout(
        gridLayout.value,
        newCols,
        isEditingGrid.value
      )
    }
  }, DEBOUNCE_TIMEOUT)
}

const handleResetLayout = async () => {
  isEditingGrid.value = false
  hasUnsavedGrid.value = false
  const userLayout = await getUserLayout(address)
  gridLayout.value = buildLayout(
    userLayout,
    gridColumns.value,
    isEditingGrid.value
  )
}

const clearSelection = () => {
  window.getSelection()?.removeAllRanges()
}

const handleItemMove = (_itemNumber: number) => {
  clearSelection()
}

const handleItemMoved = (_itemNumber: number) => {
  clearSelection()
  hasUnsavedGrid.value = true
}

const handleItemResize = (_itemNumber: number) => {
  clearSelection()
}

const handleItemResized = (_itemNumber: number) => {
  clearSelection()
  hasUnsavedGrid.value = true
}

// rebuild layout when user connects or disconnects
watch(
  () => isConnected.value,
  () => {
    layout.value = buildLayout(
      gridLayout.value,
      gridColumns.value,
      isEditingGrid.value
    )
  },
  { immediate: true }
)

watch(
  () => gridLayout.value.length,
  () => {
    layout.value = buildLayout(
      gridLayout.value,
      gridColumns.value,
      isEditingGrid.value
    )
  }
)

watch(
  () => isEditingGrid.value,
  () => {
    layout.value = buildLayout(
      gridLayout.value,
      gridColumns.value,
      isEditingGrid.value
    )
  }
)

onMounted(async () => {
  await initializeGridLayout(address, isEditingGrid.value)
  layout.value = gridLayout.value
})

useResizeObserver(gridContainer, entries => {
  const { contentRect } = entries[0]
  handleResize(contentRect.width)
})
</script>

<template>
  <div class="w-full">
    <div class="mx-auto max-w-content" ref="gridContainer">
      <GridLayout
        v-model:layout="layout"
        :col-num="gridColumns"
        :row-height="ROW_HEIGHT_PX"
        :is-draggable="isEditingGrid"
        :is-resizable="isEditingGrid"
        :responsive="false"
        :is-bounded="true"
        @layout-updated="handleUpdateLayout"
      >
        <GridItem
          v-for="item in gridLayout"
          :key="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :is-draggable="item.isDraggable"
          :is-resizable="item.isResizable"
          :static="item.static"
          @move="handleItemMove"
          @moved="handleItemMoved"
          @resize="handleItemResize"
          @resized="handleItemResized"
          drag-allow-from=".cursor-move"
          drag-ignore-from=".z-10"
          :resize-option="{
            edges: {
              top: false,
              left: false,
              bottom: '#resize',
              right: '#resize',
            },
          }"
        >
          <GridWidget :widget="item" />
        </GridItem>
      </GridLayout>
    </div>

    <!-- Confirmation dialog for unsaved changes -->
    <GridConfirmationDialog
      v-if="isEditingGrid"
      @save="handleSaveLayout"
      @cancel="handleResetLayout"
    />
  </div>
</template>

<style scoped>
/* stylelint-disable-next-line selector-class-pattern */
:deep(.vgl-item__resizer) {
  display: none; /* hide library resizer handle to use custom one */
}
</style>
