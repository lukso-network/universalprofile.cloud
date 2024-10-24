<script setup lang="ts">
import { tv } from 'tailwind-variants'

type Props = {
  grid: Grid
  isActive: boolean
}

const props = defineProps<Props>()
const { formatMessage } = useIntl()
const { canEditGrid, addGrid } = useGrid()
const { showModal } = useModal()
const { selectedGridId, tempGrid } = storeToRefs(useGridStore())
const dropdownId = `dropdown-${generateItemId()}`

const styleVariants = tv({
  slots: {
    label: 'whitespace-nowrap',
  },
  variants: {
    isActive: {
      true: {
        label: 'cursor-default',
      },
      false: {
        label: 'cursor-pointer opacity-50 transition hover:opacity-100',
      },
    },
  },
})

const styles = computed(() => {
  return styleVariants({
    isActive: props.isActive,
  })
})

const handleEdit = () => {
  showModal({
    template: 'AddEditGrid',
    data: {
      grid: {
        id: props.grid.id,
        title: props.grid.title,
        gridColumns: props.grid.gridColumns,
      },
    },
  })
}

const handleDelete = () => {
  showModal({
    template: 'DeleteGrid',
    data: {
      id: props.grid.id,
      title: props.grid.title,
    },
  })
}

const handleDuplicate = () => {
  const newGrid: Grid = {
    id: createGridId(props.grid, tempGrid.value),
    title: formatMessage('grid_tabs_copy_of', { title: props.grid.title }),
    grid: props.grid.grid,
    gridColumns: props.grid.gridColumns,
  }

  addGrid(newGrid)
  selectedGridId.value = newGrid.id
}

const handleSelectTab = (id: string) => {
  selectedGridId.value = id
}
</script>

<template>
  <li class="heading-inter-17-semi-bold flex min-h-[26px] items-center">
    <div class="group relative flex w-full items-center">
      <div :class="styles.label()" @click="handleSelectTab(grid.id)">
        {{ grid.title }}
      </div>
      <lukso-icon
        v-if="canEditGrid"
        :id="dropdownId"
        class="absolute right-[-18px] mx-1 -mr-1 cursor-pointer p-1 opacity-0 transition hover:!opacity-100 group-hover:opacity-50"
        name="edit"
        size="small"
      ></lukso-icon>
    </div>
    <lukso-dropdown
      :trigger-id="dropdownId"
      size="medium"
      class="relative -bottom-2 -left-2"
    >
      <!-- Edit option -->
      <lukso-dropdown-option size="medium" @click="handleEdit">
        <lukso-icon name="edit" size="small"></lukso-icon>
        {{ formatMessage('grid_tabs_menu_edit') }}</lukso-dropdown-option
      >

      <!-- Duplicate option -->
      <lukso-dropdown-option size="medium" @click="handleDuplicate">
        <lukso-icon name="copy" size="small"></lukso-icon>
        {{ formatMessage('grid_tabs_menu_duplicate') }}</lukso-dropdown-option
      >

      <!-- Delete option -->
      <lukso-dropdown-option size="medium" @click="handleDelete">
        <lukso-icon name="trash" size="small" color="red-65"></lukso-icon>
        <span class="text-red-65">
          {{ formatMessage('grid_tabs_menu_delete') }}
        </span>
      </lukso-dropdown-option>
    </lukso-dropdown>
  </li>
</template>
