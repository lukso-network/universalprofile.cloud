<script setup lang="ts">
import { GridItem, GridLayout } from 'grid-layout-plus'
import { useResizeObserver } from '@vueuse/core'

import { toGridLayoutItems } from '@/utils/gridLayout'

const COL_NUM_LARGE = 2
const COL_NUM_SMALL = 1
const ROW_HEIGHT_PX = 280

const gridContainer = ref<HTMLElement | null>(null)
const breakpoints: Record<number, number> = {
  0: COL_NUM_SMALL,
  768: COL_NUM_LARGE,
}

const gridColumns = ref(getGridColumns(window.innerWidth))

const DEBOUNCE_TIMEOUT = 250
let resizeTimeout: ReturnType<typeof setTimeout> | null = null

const gridOptions = reactive<GridProperties>({
  isDraggable: false,
  isResizable: false,
  isResponsive: false,
})

// TODO: gridConfig should be saved and fetched from local storage on changes
// Only sent to the server when the user saves the layout
const gridConfig = ref<LSP27TheGrid | undefined>()
const layout = ref<GridLayoutItem[]>([])
const showSettingsModal = ref(false)
const layoutStringified = ref('')

const address = getCurrentProfileAddress()

function getGridColumns(width: number): number {
  const breakpointsKeys = Object.keys(breakpoints)
    .map(Number)
    .sort((a, b) => b - a)
  const validBreakpoint = breakpointsKeys.find(bp => width >= bp)

  return validBreakpoint ? breakpoints[validBreakpoint] : COL_NUM_SMALL
}

async function initializeTheGrid(address: string | undefined): Promise<void> {
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

function onSettingsClick() {
  showSettingsModal.value = true
  const lsp27Config = toLSP27TheGrid(layout.value)
  layoutStringified.value = JSON.stringify(lsp27Config, null, 2)
}

function onModalClose() {
  showSettingsModal.value = false
}

async function validateAndSaveLayout(newLayout: string): Promise<void> {
  let parsedLayout: any
  try {
    parsedLayout = JSON.parse(newLayout)
  } catch (error) {
    console.warn('Invalid JSON 👿')

    return
  }

  // Convert the layout to grid layout items
  const gridLayoutItems = toGridLayoutItems(parsedLayout, COL_NUM_LARGE)

  if (!isValidLayout(gridLayoutItems)) {
    console.warn('Invalid schema 😡')

    return
  }

  layout.value = gridLayoutItems

  // close modal
  showSettingsModal.value = false

  const lsp27Config = toLSP27TheGrid(layout.value)
  const response = await upsertGridConfig(address, lsp27Config)
  if (!response) {
    console.warn('Failed to save layout 😢')

    return
  }

  console.log('Layout saved 🎉')
}

function resizeHandler(width: number): void {
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

function resetLayout(): void {
  showSettingsModal.value = false
  const newUserLayout = getNewUserLayout(address)
  layout.value = toGridLayoutItems(newUserLayout, COL_NUM_LARGE)
}

function clearSelection(): void {
  window.getSelection()?.removeAllRanges()
}

onMounted(async () => {
  await initializeTheGrid(address)
})

useResizeObserver(gridContainer, entries => {
  const { contentRect } = entries[0]
  resizeHandler(contentRect.width)
})
</script>

<template>
  <div class="w-full">
    <div class="mx-auto max-w-content" ref="gridContainer">
      <GridLayout
        v-model:layout="layout"
        :col-num="gridColumns"
        :row-height="ROW_HEIGHT_PX"
        :is-draggable="gridOptions.isDraggable"
        :is-resizable="gridOptions.isDraggable"
        :responsive="gridOptions.isResponsive"
      >
        <GridItem
          v-for="item in layout"
          :key="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          @move="clearSelection"
          @moved="clearSelection"
          @resize="clearSelection"
          @resized="clearSelection"
        >
          <GridWidget :widget="item" />
        </GridItem>
      </GridLayout>
    </div>
    <!-- This configuration tools are just temporal until we have the proper ones -->
    <div class="fixed bottom-0 right-0 m-2">
      <lukso-button
        size="small"
        type="button"
        variant="secondary"
        @click="onSettingsClick()"
        >⚙️
      </lukso-button>
    </div>
    <div>
      <lukso-modal
        :is-open="showSettingsModal.valueOf() ? true : undefined"
        size="medium"
        @on-backdrop-click="onModalClose"
      >
        <div class="m-4 flex flex-col space-y-2 text-sm">
          <div class="flex space-x-2">
            <lukso-checkbox
              type="text"
              size="x-small"
              :checked="gridOptions.isDraggable ? true : undefined"
              @click="
                () => {
                  gridOptions.isDraggable = !gridOptions.isDraggable
                }
              "
            >
              Draggable
            </lukso-checkbox>
            <lukso-checkbox
              type="text"
              size="x-small"
              :checked="gridOptions.isResizable ? true : undefined"
              @click="
                () => {
                  gridOptions.isResizable = !gridOptions.isResizable
                }
              "
            >
              Resizable
            </lukso-checkbox>
            <lukso-checkbox
              type="text"
              size="x-small"
              :checked="gridOptions.isResponsive ? true : undefined"
              @click="
                () => {
                  gridOptions.isResponsive = !gridOptions.isResponsive
                }
              "
            >
              Responsive
            </lukso-checkbox>
          </div>

          <div>
            Current items info as i: [x, y, w, h]:
            <div class="columns-4">
              <div v-for="item in layout" :key="item.i">
                <strong>{{ item.i }}</strong
                >: [{{ item.x }}, {{ item.y }}, {{ item.w }}, {{ item.h }}]
              </div>
            </div>
          </div>
          <textarea
            v-model="layoutStringified"
            class="h-96 w-full border-2 border-solid border-black"
            wrap="off"
          ></textarea>
          <span class="space-x-2">
            <lukso-button
              @click="validateAndSaveLayout(layoutStringified)"
              size="small"
            >
              Apply
            </lukso-button>
            <lukso-button @click="resetLayout()" size="small">
              Reset
            </lukso-button>
          </span>
        </div>
      </lukso-modal>
    </div>
  </div>
</template>
