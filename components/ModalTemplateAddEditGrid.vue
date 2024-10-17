<script setup lang="ts">
import type { GridWidget } from '@/types/grid'

const { modal, closeModal } = useModal()
const { formatMessage } = useIntl()
const { tempGridLayout, selectedLayoutId } = storeToRefs(useGridStore())
const { addGrid, updateGrid } = useGrid()

const INPUT_FOCUS_DELAY = 10 // small delay for focusing input after element render
const DEFAULT_PROPERTIES = {
  title: '',
}
const inputValues = reactive(DEFAULT_PROPERTIES)
const inputErrors = reactive({
  title: '',
})

const id = computed(() => modal?.data?.grid?.id)
const canSubmit = ref(false)
const isEdit = computed(() => !!id.value)

const handleTitleChange = async (customEvent: CustomEvent) => {
  const event = customEvent.detail.event
  const input = event.target as HTMLInputElement

  inputErrors.title = ''

  if (!input.value) {
    inputErrors.title = formatMessage('errors_required')
    return
  }

  inputValues.title = input.value
}

const handleCancel = () => {
  closeModal()
}

const handleSave = () => {
  if (!canSubmit.value) {
    return
  }

  const grid = toRaw(inputValues)

  if (isEdit.value) {
    updateGrid(id.value, {
      ...grid,
    })
  } else {
    const newGrid: Grid<GridWidget> = {
      id: createGridId<GridWidget>(grid, tempGridLayout.value),
      title: grid.title,
      grid: [],
    }

    addGrid(newGrid)
    selectedLayoutId.value = newGrid.id
  }

  handleCancel()
}

watchEffect(() => {
  canSubmit.value = !!inputValues.title && !inputErrors.title
})

onMounted(() => {
  setTimeout(() => {
    const input = document?.querySelector(
      'lukso-input'
    ) as unknown as HTMLElement

    input?.shadowRoot?.querySelector('input')?.focus()
  }, INPUT_FOCUS_DELAY)

  Object.assign(inputValues, modal?.data?.grid || DEFAULT_PROPERTIES)
})
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

    <lukso-input
      .value="inputValues.title"
      :placeholder="formatMessage('add_grid_title_placeholder')"
      :error="inputErrors.title"
      is-full-width
      autofocus
      @on-input="handleTitleChange"
    ></lukso-input>

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
