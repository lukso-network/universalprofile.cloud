<script setup lang="ts">
const { modal, closeModal } = useModal<Partial<Grid>>()
const { formatMessage } = useIntl()
const { tempGrid, selectedGridId } = storeToRefs(useGridStore())
const { addGrid, updateGrid } = useGrid()
const id = computed(() => modal?.data?.id)
const isEdit = computed(() => !!id.value)
const {
  inputValues,
  canSubmit,
  getFieldErrorMessage,
  handleFieldChange,
  handleFormErrors,
  handleSelectChange,
} = useForm(
  gridInputSchema,
  (
    await gridInputSchema
      .partial({ title: true })
      ?.safeParseAsync(modal?.data || {})
  )?.data
)

const gridColumnsOptions = computed(() => {
  return Array.from({ length: GRID_COLUMNS_MAX - GRID_COLUMNS_MIN + 1 }).map(
    (_, index) => ({
      id: index + GRID_COLUMNS_MIN,
      value: index + GRID_COLUMNS_MIN,
    })
  )
})

const selectedGridColumns = computed(() => {
  return gridColumnsOptions.value.find(
    option =>
      option.id === (inputValues.value as { gridColumns: number }).gridColumns
  )
})

const handleCancel = () => {
  closeModal()
}

const handleSave = async () => {
  if (!canSubmit.value) {
    return
  }

  try {
    const grid = await gridInputSchema?.parseAsync(inputValues.value)

    if (isEdit.value) {
      updateGrid(id.value, {
        ...grid,
      })
    } else {
      const newGrid: Grid = {
        id: createGridId(grid, tempGrid.value),
        ...grid,
        grid: [],
      }

      addGrid(newGrid)
      selectedGridId.value = newGrid.id
    }

    handleCancel()
  } catch (error: unknown) {
    handleFormErrors(error)
  }
}
</script>

<template>
  <div class="p-6">
    <div class="heading-inter-21-semi-bold pb-4">
      {{ formatMessage(isEdit ? 'edit_grid_title' : 'add_grid_title') }}
    </div>
    <div class="paragraph-inter-14-regular pb-6">
      {{
        formatMessage(isEdit ? 'edit_grid_description' : 'add_grid_description')
      }}
    </div>

    <div class="flex flex-col gap-4">
      <!-- Title -->
      <lukso-input
        .value="inputValues.title"
        :placeholder="formatMessage('add_grid_title_placeholder')"
        :error="getFieldErrorMessage('title')"
        :label="formatMessage('add_grid_title_label')"
        is-full-width
        autofocus
        @on-input="
          (customEvent: CustomEvent) => handleFieldChange(customEvent, 'title')
        "
      ></lukso-input>

      <!-- Column number -->
      <lukso-select
        :value="JSON.stringify(selectedGridColumns)"
        :options="JSON.stringify(gridColumnsOptions)"
        :label="formatMessage('add_grid_columns_label')"
        is-full-width
        @on-select="
          (customEvent: CustomEvent) =>
            handleSelectChange(customEvent, 'gridColumns')
        "
      ></lukso-select>
    </div>

    <!-- Buttons -->
    <div class="grid grid-cols-[max-content,auto] pt-6">
      <lukso-button variant="text" @click="handleCancel">
        {{ formatMessage('add_widget_cancel') }}
      </lukso-button>
      <lukso-button
        :disabled="!canSubmit ? true : undefined"
        variant="landing"
        is-full-width
        @click="handleSave"
      >
        {{ formatMessage('add_widget_confirm') }}
      </lukso-button>
    </div>
  </div>
</template>
