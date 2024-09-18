<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { GridItem, GridLayout } from 'grid-layout-plus'

import { toGridLayoutItems } from '@/domains/grid/utils/gridLayout'

const ROW_HEIGHT_PX = 280

const gridContainer = ref<HTMLElement | null>(null)

const DEBOUNCE_TIMEOUT = 250
let resizeTimeout: ReturnType<typeof setTimeout> | null = null

const { isEditingGrid, isConnected, gridLayout, hasUnsavedGrid, gridColumns } =
  storeToRefs(useAppStore())
const address = getCurrentProfileAddress()
const connectedProfile = useProfile().connectedProfile()
const { showModal } = useModal()
const { initializeGridLayout } = useGrid()

const canEditGrid = computed(
  () =>
    isConnected.value &&
    connectedProfile.value?.address?.toLowerCase() === address.toLowerCase()
)

const handleUpdateLayout = (newLayout: GridLayoutItem[]) => {
  console.log('Layout updated 🎉', newLayout)
  gridLayout.value = newLayout
}

const handleSaveLayout = async () => {
  if (!canEditGrid.value) {
    return
  }

  isEditingGrid.value = false
  hasUnsavedGrid.value = false
  const lsp27Grid = toLSP27TheGrid(gridLayout.value)

  if (!isValidLayout(lsp27Grid)) {
    console.warn('Invalid schema 😡')
    return
  }

  const response = await upsertGridConfig(address, lsp27Grid)

  if (!response) {
    console.warn('Failed to save layout 😢')
    return
  }

  console.log('Layout saved 🎉', response)
}

const handleResize = (width: number) => {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    const prevCols = gridColumns.value
    const newCols = getGridColumns(width)

    if (prevCols !== newCols) {
      gridColumns.value = newCols
      gridLayout.value = toGridLayoutItems(gridLayout.value, newCols)
    }
  }, DEBOUNCE_TIMEOUT)
}

const handleResetLayout = async () => {
  isEditingGrid.value = false
  hasUnsavedGrid.value = false
  gridLayout.value = await getGridLayout(address, gridColumns.value)
}

const clearSelection = () => {
  window.getSelection()?.removeAllRanges()
}

const handleItemMove = (itemNumber: number) => {
  console.log('Item move 🚚', itemNumber)
  clearSelection()
}

const handleItemMoved = (itemNumber: number) => {
  console.log('Item moved 🚚', itemNumber)
  clearSelection()
  hasUnsavedGrid.value = true
}

const handleItemResize = (itemNumber: number) => {
  console.log('Item resize 📏', itemNumber)
  clearSelection()
}

const handleItemResized = (itemNumber: number) => {
  console.log('Item resized 📏', itemNumber)
  clearSelection()
  hasUnsavedGrid.value = true
}

const handleToggleEditMode = () => {
  if (canEditGrid.value) {
    isEditingGrid.value = !isEditingGrid.value
  }
}

const handleAddWidget = () => {
  showModal({
    template: 'AddGridWidget',
  })
}

onMounted(async () => {
  await initializeGridLayout(address)
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
        v-model:layout="gridLayout"
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
          @move="handleItemMove"
          @moved="handleItemMoved"
          @resize="handleItemResize"
          @resized="handleItemResized"
          drag-allow-from=".cursor-move"
          drag-ignore-from=".z-10"
        >
          <GridWidget :widget="item" />
        </GridItem>
      </GridLayout>
    </div>

    <!-- This configuration tools are just temporal until we have the proper ones -->
    <div v-if="canEditGrid" class="fixed bottom-0 right-0 m-2 flex flex-col">
      <lukso-button
        v-if="isEditingGrid"
        size="small"
        type="button"
        variant="secondary"
        is-icon
        @click="handleAddWidget"
      >
        <lukso-icon name="plus" size="medium" class="mx-1"></lukso-icon>
      </lukso-button>
      <lukso-button
        v-if="!isEditingGrid"
        size="small"
        type="button"
        variant="secondary"
        is-icon
        @click="handleToggleEditMode"
      >
        <lukso-icon name="edit" size="medium" class="mx-1"></lukso-icon>
      </lukso-button>
      <template v-else>
        <lukso-button
          size="small"
          type="button"
          variant="secondary"
          is-icon
          @click="handleSaveLayout"
        >
          <lukso-icon name="tick" size="medium" class="mx-1"></lukso-icon>
        </lukso-button>
        <lukso-button
          size="small"
          type="button"
          variant="secondary"
          is-icon
          @click="handleResetLayout"
        >
          <lukso-icon name="close-lg" size="medium" class="mx-1"></lukso-icon>
        </lukso-button>
      </template>
    </div>

    <!-- Confirmation dialog for unsaved changes -->
    <GridConfirmationDialog
      v-if="isEditingGrid"
      @save="handleSaveLayout"
      @cancel="handleResetLayout"
    />
  </div>
</template>
