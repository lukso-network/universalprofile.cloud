<script setup lang="ts">
import draggable from 'vuedraggable'

type GridTab = {
  grid: Grid
}

const { selectedGridId, tempGrid, viewedGrid } = storeToRefs(useGridStore())
const { canEditGrid, gridsForDisplay } = useGrid()
const tabs = ref<GridTab[]>([])

// we only show tabs when user has more then one
const hasTabs = computed(() => tabs.value.length > 1)

const handleDragEnd = () => {
  tempGrid.value = cloneObject(tabs.value.map(tab => tab.grid))
}

watch(
  [canEditGrid, tempGrid, viewedGrid],
  () => {
    tabs.value = gridsForDisplay.value
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <div class="flex select-none gap-x-6 gap-y-3 pb-4">
    <!-- Draggable Grid tabs -->
    <draggable
      v-if="canEditGrid"
      v-model="tabs"
      tag="ul"
      :animation="300"
      item-key="grid.id"
      class="flex flex-wrap justify-start gap-x-6 gap-y-3"
      @end="handleDragEnd"
    >
      <template #item="{ element: tab }">
        <GridTabsItem
          :grid="tab.grid"
          :is-active="tab.grid.id === selectedGridId"
          is-moveable
        />
      </template>
    </draggable>

    <!-- Static Grid tabs -->
    <ul
      v-else-if="hasTabs"
      class="flex flex-wrap justify-start gap-x-6 gap-y-3"
    >
      <GridTabsItem
        v-for="tab in tabs"
        :key="tab.grid.id"
        :grid="tab.grid"
        :is-active="tab.grid.id === selectedGridId"
      />
    </ul>
  </div>
</template>
