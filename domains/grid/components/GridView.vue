<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { GridItem, GridLayout } from 'grid-layout-plus'

const GRID_ROW_HEIGHT_PX = 280 // TODO we should calculate this based on grid column width
const GRID_RESIZE_DEBOUNCE_TIMEOUT_MS = 250

const { isEditingGrid, gridLayout, hasUnsavedGrid, gridColumns } =
  storeToRefs(useAppStore())
const address = getCurrentProfileAddress()
const { initializeGridLayout, saveGridLayout, canEditGrid } = useGrid()

const layout = ref<GridWidget[]>([])
const gridContainer = ref<HTMLElement | null>(null)
let resizeTimeout: ReturnType<typeof setTimeout> | null = null

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
    canEditGrid.value
  )

  await saveGridLayout(layout.value)
  isEditingGrid.value = false
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
        canEditGrid.value
      )
    }
  }, GRID_RESIZE_DEBOUNCE_TIMEOUT_MS)
}

const handleResetLayout = async () => {
  hasUnsavedGrid.value = false
  const userLayout = await getUserLayout(address)
  gridLayout.value = buildLayout(
    userLayout,
    gridColumns.value,
    canEditGrid.value
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

// rebuild layout when user connects/disconnects,
// or when user enters/exit edit mode
watch(
  () => canEditGrid.value,
  () => {
    layout.value = buildLayout(
      gridLayout.value,
      gridColumns.value,
      canEditGrid.value
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
      canEditGrid.value
    )
  }
)

onMounted(async () => {
  await initializeGridLayout(address, canEditGrid.value)
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
        :row-height="GRID_ROW_HEIGHT_PX"
        :is-draggable="canEditGrid"
        :is-resizable="canEditGrid"
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
      v-if="canEditGrid"
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
