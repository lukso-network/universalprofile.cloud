<script setup lang="ts">
type GridTab = {
  grid: Grid<GridWidget>
}

type Props = {
  grid: Grid<GridWidget>[]
}

const props = defineProps<Props>()
const { selectedGridId } = storeToRefs(useGridStore())
const { formatMessage } = useIntl()
const { showModal } = useModal()
const { canEditGrid } = useGrid()

const tabs = computed<GridTab[]>(() => {
  return props.grid.map(grid => {
    return {
      grid,
    }
  })
})

const handleAddGrid = () => {
  showModal({
    template: 'AddEditGrid',
    data: {
      id: undefined,
      grid: undefined,
      gridColumns: undefined,
    },
  })
}
</script>

<template>
  <div class="pb-4">
    <ul class="flex flex-wrap justify-start gap-x-6 gap-y-3">
      <GridTabsItem
        v-for="tab in tabs"
        :key="tab.grid.id"
        :grid="tab.grid"
        :is-active="tab.grid.id === selectedGridId"
      />
      <li
        v-if="canEditGrid"
        class="heading-inter-17-semi-bold flex cursor-pointer items-center opacity-50 transition hover:opacity-100"
        @click="handleAddGrid"
      >
        {{ formatMessage('grid_tabs_add_widget') }}
        <lukso-icon name="plus" size="small" class="ml-2" />
      </li>
    </ul>
  </div>
</template>
