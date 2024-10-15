<script setup lang="ts">
type GridTab = {
  id: string
  label: string
}

type Props = {
  grid: Grid<GridWidget>[]
}

const props = defineProps<Props>()
const { selectedLayoutId, isEditingGrid } = storeToRefs(useGridStore())
const { formatMessage } = useIntl()
const { showModal } = useModal()

const tabs = computed<GridTab[]>(() => {
  return props.grid.map(grid => {
    return {
      id: grid.id,
      label: grid.title,
    }
  })
})

const handleSelectTab = (id: string) => {
  selectedLayoutId.value = id
}

const handleAddGrid = () => {
  showModal({
    template: 'AddEditGrid',
    data: {
      id: undefined,
      grid: undefined,
    },
  })
}
</script>

<template>
  <div class="pb-4">
    <ul class="flex justify-center gap-6 sm:justify-start">
      <ProfileTabsItem
        v-for="tab in tabs"
        :key="tab.id"
        :label="tab.label"
        :is-active="tab.id === selectedLayoutId"
        @click="handleSelectTab(tab.id)"
      />
      <li
        v-if="isEditingGrid"
        class="heading-inter-17-semi-bold flex cursor-pointer items-center opacity-50 transition hover:opacity-100"
        @click="handleAddGrid"
      >
        {{ formatMessage('grid_tabs_add_widget') }}
        <lukso-icon name="plus" size="small" class="ml-2" />
      </li>
    </ul>
  </div>
</template>
