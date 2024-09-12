<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { GridItem, GridLayout } from 'grid-layout-plus'

import { addGridLayoutItem, toGridLayoutItems } from '@/utils/gridLayout'

const COL_NUM_LARGE = 2
const COL_NUM_SMALL = 1
const ROW_HEIGHT_PX = 280

const gridContainer = ref<HTMLElement | null>(null)
const breakpoints: Record<number, number> = {
  0: COL_NUM_SMALL,
  768: COL_NUM_LARGE,
}

const DEBOUNCE_TIMEOUT = 250
let resizeTimeout: ReturnType<typeof setTimeout> | null = null

const editMode = ref(false)

// TODO: gridConfig should be saved and fetched from local storage on changes
// Only sent to the server when the user saves the layout
const gridConfig = ref<LSP27TheGrid | undefined>()
const layout = ref<GridLayoutItem[]>([])

enum ModalType {
  DEBUG,
  NEW_WIDGET,
}

const showModal = ref(false)
const modalType = ref<ModalType | undefined>()

const address = getCurrentProfileAddress()

const getGridColumns = (width: number): number => {
  const breakpointsKeys = Object.keys(breakpoints)
    .map(Number)
    .sort((a, b) => b - a)
  const validBreakpoint = breakpointsKeys.find(bp => width >= bp)

  return validBreakpoint ? breakpoints[validBreakpoint] : COL_NUM_SMALL
}

const gridColumns = ref(getGridColumns(window.innerWidth))
const initializeTheGrid = async (
  address: string | undefined
): Promise<void> => {
  if (!address) {
    layout.value = []
    return
  }

  if (!gridConfig.value) {
    const gridConfigObject = await getGridConfig(address)
    if (
      !gridConfigObject ||
      !gridConfigObject.config ||
      !isValidLayout(gridConfigObject.config)
    ) {
      gridConfig.value = getNewUserLayout(address)
    } else {
      gridConfig.value = gridConfigObject.config
    }
  }

  layout.value = toGridLayoutItems(gridConfig.value, gridColumns.value)
}

const handleNewWidgetClick = () => {
  modalType.value = ModalType.NEW_WIDGET
  showModal.value = true
}

const handleDebugClick = () => {
  modalType.value = ModalType.DEBUG
  showModal.value = true
}

const handleModalClose = () => {
  showModal.value = false
}

const validateAndSaveLayout = async (newLayout: string) => {
  let parsedLayout: any
  try {
    parsedLayout = JSON.parse(newLayout)
  } catch (error) {
    console.warn('Invalid JSON 👿')

    return
  }

  if (!isValidLayout(parsedLayout)) {
    console.warn('Invalid schema 😡')

    return
  }

  layout.value = toGridLayoutItems(parsedLayout, COL_NUM_LARGE)

  // close modal
  showModal.value = false

  const response = await upsertGridConfig(address, parsedLayout)
  if (!response) {
    console.warn('Failed to save layout 😢')

    return
  }

  console.log('Layout saved 🎉')
}

const addWidget = (widget: GridWidget) => {
  layout.value = addGridLayoutItem(layout.value, widget, gridColumns.value)
}

const handleResize = (width: number) => {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    const prevCols = gridColumns.value
    const newCols = getGridColumns(width)

    if (prevCols !== newCols) {
      gridColumns.value = newCols
      layout.value = toGridLayoutItems(layout.value, newCols)
    }
  }, DEBOUNCE_TIMEOUT)
}

const handleResetLayout = () => {
  showModal.value = false
  const newUserLayout = getNewUserLayout(address)
  layout.value = toGridLayoutItems(newUserLayout, COL_NUM_LARGE)
}

const handleClearSelection = () => {
  window.getSelection()?.removeAllRanges()
}

const handleToggleEditMode = () => {
  editMode.value = !editMode.value
}

onMounted(async () => {
  await initializeTheGrid(address)
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
        :is-draggable="editMode"
        :is-resizable="editMode"
        :responsive="false"
        :is-bounded="true"
      >
        <GridItem
          v-for="item in layout"
          :key="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          @move="handleClearSelection"
          @moved="handleClearSelection"
          @resize="handleClearSelection"
          @resized="handleClearSelection"
          drag-allow-from=".cursor-move"
          drag-ignore-from=".z-10"
        >
          <!-- This will serve as a handle to drag the widget when enabled -->
          <div
            v-if="editMode"
            class="absolute left-0 top-0 z-20 cursor-move rounded-[10px] bg-white"
          >
            <lukso-icon
              name="hand-right-outline"
              size="small"
              class="m-1"
            ></lukso-icon>
          </div>
          <GridWidget :widget="item" />
        </GridItem>
      </GridLayout>
    </div>
    <!-- This configuration tools are just temporal until we have the proper ones -->
    <div class="fixed bottom-0 right-0 m-2 flex flex-col">
      <lukso-button
        v-if="editMode"
        size="small"
        type="button"
        variant="secondary"
        is-icon
        @click="handleNewWidgetClick()"
      >
        <lukso-icon name="plus" size="medium" class="mx-1"></lukso-icon>
      </lukso-button>
      <lukso-button
        v-if="editMode"
        size="small"
        type="button"
        variant="secondary"
        is-icon
        @click="handleDebugClick()"
      >
        <lukso-icon name="code-outline" size="medium" class="mx-1"></lukso-icon>
      </lukso-button>
      <lukso-button
        size="small"
        type="button"
        variant="secondary"
        is-icon
        @click="handleToggleEditMode"
      >
        <lukso-icon
          :name="editMode ? 'tick' : 'edit'"
          size="medium"
          class="mx-1"
        ></lukso-icon>
      </lukso-button>
    </div>
    <div>
      <lukso-modal
        :is-open="showModal.valueOf() ? true : undefined"
        size="medium"
        @on-backdrop-click="handleModalClose"
      >
        <ModalGridDebug
          v-if="modalType === ModalType.DEBUG"
          :layout="layout"
          :on-save="validateAndSaveLayout"
          :on-reset="handleResetLayout"
        />

        <ModalGridNewWidget
          v-else-if="modalType === ModalType.NEW_WIDGET"
          :on-add="addWidget"
        />
      </lukso-modal>
    </div>
  </div>
</template>
