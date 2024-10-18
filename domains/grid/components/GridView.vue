<script setup lang="ts">
import { useElementSize, useResizeObserver } from '@vueuse/core'
import { GridItem, GridLayout } from 'grid-layout-plus'

const { isConnected } = storeToRefs(useAppStore())
const {
  isEditingGrid,
  tempGridLayout,
  viewedGridLayout,
  hasUnsavedGrid,
  gridColumns,
  gridRowHeightRatio,
  selectedLayoutId,
} = storeToRefs(useGridStore())
const {
  initializeGridLayout,
  saveGridLayout,
  canEditGrid,
  getSelectedLayout,
  updateSelectedLayout,
  getGridColumns,
  initSelectedLayoutId,
} = useGrid()
const gridContainer = ref<HTMLElement | null>(null)
let resizeTimeout: ReturnType<typeof setTimeout> | null = null
const { width } = useElementSize(gridContainer)
const layout = ref<GridWidget[]>([])
const movementX = ref(0)
const address = computed(() => getCurrentProfileAddress())

const currentLayout = computed(() => {
  // when user is editing and has unsaved changes, use temp layout
  if (canEditGrid.value && hasUnsavedGrid.value) {
    return tempGridLayout.value
  }

  return viewedGridLayout.value
})

const gridRowHeight = computed(() => {
  const columnSpacing = GRID_SPACING_PX * (gridColumns.value - 1)
  const columnWidth = width.value - columnSpacing
  const rowHeight = (columnWidth / gridColumns.value) * gridRowHeightRatio.value

  return rowHeight
})

const itemStyle = computed(() => (item: GridWidget) => {
  const element = document.getElementById(`gridItem-${item.i}`)

  // we only want to rotate item while dragging
  if (element?.classList.contains('vgl-item--dragging')) {
    // calculate rotation based on mouse movement speed
    const rotate = Math.min(
      Math.max(movementX.value, -MAX_WIDGET_ROTATE_WHILE_MOVE_DEG),
      MAX_WIDGET_ROTATE_WHILE_MOVE_DEG
    )

    return {
      transform: `rotate(${rotate}deg)`,
      transition: 'transform 0.2s',
    }
  }
})

const handleMouseMove = (event: MouseEvent) => {
  movementX.value = event.movementX
}

const handleUpdateLayout = (newLayout: GridWidget[]) => {
  if (gridLog.enabled) {
    gridLog('Layout updated', toRaw(newLayout))
  }

  layout.value = newLayout
}

const handleSaveLayout = async () => {
  if (!canEditGrid.value) {
    return
  }

  await saveGridLayout(tempGridLayout.value)
}

const handleResize = (width: number) => {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    const prevCols = gridColumns.value
    const newCols = getGridColumns.value(width)

    if (prevCols !== newCols) {
      gridColumns.value = newCols
      layout.value = getSelectedLayout(
        buildLayout(currentLayout.value, newCols, canEditGrid.value)
      )
    }
  }, GRID_RESIZE_DEBOUNCE_TIMEOUT_MS)
}

const handleResetLayout = async () => {
  const userLayout = await getUserLayout(address.value)
  const _layout = buildLayout(userLayout, gridColumns.value, canEditGrid.value)

  tempGridLayout.value = cloneObject(_layout)
  viewedGridLayout.value = cloneObject(_layout)
  layout.value = getSelectedLayout(cloneObject(_layout))

  // if selected layout is affected by reset, select first layout
  if (
    !viewedGridLayout.value.some(item => item.id === selectedLayoutId.value)
  ) {
    selectedLayoutId.value = viewedGridLayout.value[0]?.id
  }
}

const clearSelection = () => {
  window.getSelection()?.removeAllRanges()
}

const handleItemMove = () => {
  clearSelection()
}

const handleItemMoved = () => {
  clearSelection()
  tempGridLayout.value = updateSelectedLayout(layout.value)
}

const handleItemResize = () => {
  clearSelection()
}

const handleItemResized = () => {
  clearSelection()
  tempGridLayout.value = updateSelectedLayout(layout.value)
}

// rebuild layout and track unsaved state when:
// - user make modifications in widgets (add/edit/remove/resize)
// - user toggles edit mode
watch(
  [tempGridLayout, isEditingGrid, selectedLayoutId],
  async () => {
    await nextTick()
    const updatedViewedLayout = buildLayout(
      viewedGridLayout.value,
      gridColumns.value,
      canEditGrid.value
    )

    const updatedTempLayout = buildLayout(
      tempGridLayout.value,
      gridColumns.value,
      canEditGrid.value
    )

    // if user is in edit mode we use temp layout, otherwise viewed layout
    if (isEditingGrid.value) {
      layout.value = getSelectedLayout(updatedTempLayout)
    } else {
      layout.value = getSelectedLayout(updatedViewedLayout)
    }

    const changes = compareGrids(updatedViewedLayout, updatedTempLayout)

    if (changes.length > 0) {
      hasUnsavedGrid.value = true
    } else {
      hasUnsavedGrid.value = false
    }

    // re-init selected layout id when user toggles edit mode in case the selected grid was changed
    initSelectedLayoutId()
  },
  { deep: true }
)

// initialize layout on initial render and when user connects/disconnects
watch(
  [isConnected.value],
  async () => {
    if (!isConnected.value) {
      hasUnsavedGrid.value = false
    }

    await initializeGridLayout(address.value, canEditGrid.value)
    layout.value = getSelectedLayout(currentLayout.value)
  },
  { immediate: true }
)

useResizeObserver(gridContainer, entries => {
  const { contentRect } = entries[0]
  handleResize(contentRect.width)
})

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div class="w-full">
    <div class="mx-auto max-w-content" ref="gridContainer">
      <GridTabs :grid="currentLayout" />
      <GridLayout
        v-model:layout="layout"
        :col-num="gridColumns"
        :row-height="gridRowHeight"
        :is-draggable="canEditGrid"
        :is-resizable="canEditGrid"
        :responsive="false"
        :is-bounded="false"
        :margin="[GRID_SPACING_PX, GRID_SPACING_PX]"
        :use-css-transforms="false"
        class="-m-4"
        @layout-updated="handleUpdateLayout"
      >
        <GridItem
          :id="`gridItem-${item.i}`"
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
          :style="itemStyle(item)"
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

/* CSS variables for grid layout */
.vgl-layout {
  --vgl-placeholder-bg: transparent;
  --vgl-placeholder-opacity: 100%;
  --vgl-item-dragging-z-index: 30;
}

:deep(.vgl-item__resizer) {
  display: none; /* hide library resizer handle to use custom one */
}

:deep(.vgl-item--dragging) {
  & > div {
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
</style>
