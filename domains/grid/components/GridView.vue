<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { GridItem, GridLayout } from 'grid-layout-plus'

const GRID_ROW_HEIGHT_PX = 280 // TODO we should calculate this based on grid column width
const GRID_RESIZE_DEBOUNCE_TIMEOUT_MS = 250

const {
  isEditingGrid,
  connectedGridLayout,
  viewedGridLayout,
  connectedProfileAddress,
  hasUnsavedGrid,
  gridColumns,
  isConnected,
} = storeToRefs(useAppStore())
const { initializeGridLayout, saveGridLayout, canEditGrid } = useGrid()
const gridContainer = ref<HTMLElement | null>(null)
const viewedProfileAddress = getCurrentProfileAddress()
let resizeTimeout: ReturnType<typeof setTimeout> | null = null

const address = computed(() => getCurrentProfileAddress())
const layout = ref<GridWidget[]>([])

const currentLayout = computed(() => {
  if (
    connectedProfileAddress.value?.toLowerCase() ===
      viewedProfileAddress.toLowerCase() &&
    isConnected.value
  ) {
    return connectedGridLayout.value
  }

  return viewedGridLayout.value
})

const handleUpdateLayout = (newLayout: GridWidget[]) => {
  if (gridLog.enabled) {
    gridLog('Layout updated', newLayout)
  }

  // reflect any changes like move or resize in the connected user layout
  connectedGridLayout.value = newLayout
}

const handleSaveLayout = async () => {
  if (!canEditGrid.value) {
    return
  }

  // rebuild layout to ensure that all widgets are in the correct position
  layout.value = buildLayout(
    connectedGridLayout.value,
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
      layout.value = buildLayout(
        currentLayout.value,
        newCols,
        canEditGrid.value
      )
    }
  }, GRID_RESIZE_DEBOUNCE_TIMEOUT_MS)
}

const handleResetLayout = async () => {
  hasUnsavedGrid.value = false
  const userLayout = await getUserLayout(address.value)
  connectedGridLayout.value = buildLayout(
    userLayout,
    gridColumns.value,
    canEditGrid.value
  )

  layout.value = connectedGridLayout.value
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
      currentLayout.value,
      gridColumns.value,
      canEditGrid.value
    )
  },
  { immediate: true }
)

watch(
  () => connectedGridLayout.value.length,
  () => {
    layout.value = buildLayout(
      currentLayout.value,
      gridColumns.value,
      canEditGrid.value
    )
  }
)

watch(
  () => isConnected.value,
  async () => {
    if (!isConnected.value) {
      hasUnsavedGrid.value = false
    }

    await initializeGridLayout(address.value, canEditGrid.value)
    layout.value = currentLayout.value
  },
  { immediate: true }
)

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
        :margin="[16, 16]"
        class="-m-4"
        @layout-updated="handleUpdateLayout"
      >
        <GridItem
          v-for="item in layout"
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
          drag-allow-from=".grid-move-overlay"
          :resize-option="{
            edges: {
              top: false,
              left: false,
              bottom: '.grid-widget-resize',
              right: '.grid-widget-resize',
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
/* stylelint-disable selector-class-pattern */

:deep(.vgl-item__resizer) {
  display: none; /* hide library resizer handle to use custom one */
}

:deep(.vgl-item--dragging) {
  & > div {
    transform: rotate(-4deg);
    transition: transform 0.2s;
    border-radius: 12px;
    border: 1px solid var(--neutrals-neutral-90, #dee7ed);
    background: rgb(255 255 255 / 15%);
    box-shadow:
      0 185px 52px 0 rgba(63 93 116 / 0%),
      0 118px 47px 0 rgba(63 93 116 / 2%),
      0 67px 40px 0 rgba(63 93 116 / 8%),
      0 30px 30px 0 rgba(63 93 116 / 13%),
      0 7px 16px 0 rgba(63 93 116 / 15%),
      0 0 0 0 rgba(63 93 116 / 16%);
    backdrop-filter: blur(2px);
  }

  .grid-widget-options,
  .grid-widget-resize {
    opacity: 0;
    transition: opacity 0.2s;
  }
}

:deep(.vgl-item--placeholder) {
  border-radius: 12px;
  border: 1px solid #dee7ed;
  background: #f5f8fa;
  box-shadow:
    0 30px 8px 0 rgba(63 93 116 / 0%) inset,
    0 19px 8px 0 rgba(63 93 116 / 2%) inset,
    0 11px 6px 0 rgba(63 93 116 / 8%) inset,
    0 5px 5px 0 rgba(63 93 116 / 13%) inset,
    0 1px 3px 0 rgba(63 93 116 / 15%) inset,
    0 0 0 0 rgba(63 93 116 / 16%) inset;
}

.vgl-layout {
  --vgl-placeholder-bg: transparent;
  --vgl-placeholder-opacity: 100%;
}
</style>
