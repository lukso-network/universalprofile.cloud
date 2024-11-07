<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { GridItem, GridLayout } from 'grid-layout-plus'

const { isMobile } = storeToRefs(useAppStore())
const {
  isEditingGrid,
  tempGrid,
  viewedGrid,
  hasUnsavedGrid,
  gridRowHeightRatio,
  selectedGridId,
  isSavingGrid,
  mobileLimitationsDisplayed,
} = storeToRefs(useGridStore())
const {
  saveGrid,
  canEditGrid,
  getSelectedGridWidgets,
  updateSelectedGrid,
  initSelectedGridId,
  getGridById,
  gridsForTabs,
} = useGrid()
const { showModal } = useModal()
const { formatMessage } = useIntl()
const gridContainer = ref<HTMLElement | null>(null)
const { width } = useElementSize(gridContainer)
const gridWidgets = ref<GridWidget[]>([])
const movementX = ref(0)
const address = computed(() => getCurrentProfileAddress())

const currentGrid = () => {
  // when user is editing and has unsaved changes, use temp grid
  if (canEditGrid.value && hasUnsavedGrid.value) {
    return tempGrid.value
  }

  return viewedGrid.value
}

const gridRowHeight = computed(() => {
  const columnSpacing = GRID_SPACING_PX * (gridColumnNumber.value - 1)
  const columnWidth = width.value - columnSpacing
  const rowHeight =
    (columnWidth / gridColumnNumber.value) * gridRowHeightRatio.value

  return rowHeight
})

const gridColumnNumber = computed(() =>
  isMobile.value
    ? 1
    : getGridById(currentGrid(), selectedGridId.value)?.gridColumns ||
      GRID_COLUMNS_MIN
)

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

const handleUpdateGrid = (newGrid: GridWidget[]) => {
  if (gridLog.enabled) {
    gridLog('Grid updated', toRaw(newGrid))
  }

  gridWidgets.value = newGrid
}

const handleSaveGrid = async () => {
  if (!canEditGrid.value) {
    return
  }

  await saveGrid(tempGrid.value)
}

const handleResetGrid = async () => {
  const userGrid = await getUserGrid(address.value)
  const _grid = buildGrid(userGrid, isMobile.value, canEditGrid.value)

  // when user has no grids we re-create empty grids
  if (gridsForTabs.value.length === 1) {
    viewedGrid.value = cloneObject(EMPTY_GRID)
    tempGrid.value = cloneObject(EMPTY_GRID)
  } else {
    tempGrid.value = cloneObject(_grid)
    viewedGrid.value = cloneObject(_grid)
  }

  gridWidgets.value = getSelectedGridWidgets(cloneObject(_grid))
  isSavingGrid.value = false

  // if selected grid is affected by reset, select first grid
  if (!viewedGrid.value.some(item => item.id === selectedGridId.value)) {
    selectedGridId.value = viewedGrid.value[0]?.id
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
  tempGrid.value = updateSelectedGrid(gridWidgets.value)
}

const handleItemResize = () => {
  clearSelection()
}

const handleItemResized = () => {
  clearSelection()
  tempGrid.value = updateSelectedGrid(gridWidgets.value)
}

// rebuild grid and track unsaved state when:
// - user make modifications in widgets (add/edit/remove/resize)
// - user toggles edit mode
watch(
  [tempGrid, isEditingGrid, selectedGridId, isMobile, viewedGrid],
  () => {
    const updatedViewedGrid = buildGrid(
      viewedGrid.value,
      isMobile.value,
      canEditGrid.value || gridsForTabs.value.length === 1
    )

    // if user is in edit mode we use temp grid, otherwise viewed grid
    if (canEditGrid.value) {
      const updatedTempGrid = buildGrid(
        tempGrid.value,
        isMobile.value,
        canEditGrid.value || gridsForTabs.value.length === 1
      )
      gridWidgets.value = getSelectedGridWidgets(updatedTempGrid)
      const changes = compareGrids(updatedViewedGrid, updatedTempGrid)

      if (changes.length > 0) {
        hasUnsavedGrid.value = true
      } else {
        hasUnsavedGrid.value = false
      }

      // show mobile limitations modal (only once)
      if (isMobile.value && !mobileLimitationsDisplayed.value) {
        showModal<DefaultModalData>({
          data: {
            icon: '/images/grid.svg',
            title: formatMessage('grid_mobile_limitations_title'),
            message: formatMessage('grid_mobile_limitations_message'),
            confirmButtonText: formatMessage('grid_mobile_limitations_confirm'),
          },
        })
        mobileLimitationsDisplayed.value = true
      }
    } else {
      gridWidgets.value = getSelectedGridWidgets(updatedViewedGrid)
    }

    // re-init selected grid id when user toggles edit mode in case the selected grid was changed
    initSelectedGridId()
  },
  { deep: true, immediate: true }
)

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
      <GridTabs />
      <GridLayout
        v-model:layout="gridWidgets"
        :col-num="gridColumnNumber"
        :row-height="gridRowHeight"
        :is-draggable="canEditGrid"
        :is-resizable="canEditGrid"
        :responsive="false"
        :is-bounded="false"
        :margin="[GRID_SPACING_PX, GRID_SPACING_PX]"
        :use-css-transforms="false"
        class="-m-4"
        @layout-updated="handleUpdateGrid"
      >
        <GridItem
          :id="`gridItem-${item.i}`"
          v-for="item in gridWidgets"
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

    <!-- Grid floating menu -->
    <GridFloatingMenu @on-save="handleSaveGrid" @on-reset="handleResetGrid" />
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
